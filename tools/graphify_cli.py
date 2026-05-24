#!/usr/bin/env python3
"""Simple project graphifier: scans a folder, builds a file-import graph,
and emits graphify-out/graph.json, graph.html and GRAPH_REPORT.md.

Usage:
  ./graphify install         # create cache dirs
  ./graphify <path>          # scan target folder (default: .)
"""
import os
import re
import sys
import json
from pathlib import Path
from collections import defaultdict, Counter

ROOT = Path(__file__).resolve().parent.parent

SUPPORTED_EXTS = [".js", ".mjs", ".cjs", ".ts", ".jsx", ".tsx", ".py"]

IMPORT_RE = re.compile(r'''import\s+(?:.+?from\s+)?['\"]([^'\"]+)['\"]|require\(\s*['\"]([^'\"]+)['\"]\s*\)''')


def find_files(target: Path):
    files = []
    for p in target.rglob("*"):
        if p.is_file() and p.suffix in SUPPORTED_EXTS:
            files.append(p)
    return files


def read_text(path: Path):
    try:
        return path.read_text(encoding="utf8", errors="ignore")
    except Exception:
        return ""


def resolve_import(base: Path, imp: str, target_root: Path):
    # only handle relative imports and local file paths
    if not imp.startswith("."):
        return None
    candidate = (base.parent / imp).resolve()
    # try file with extensions
    if candidate.is_file():
        return candidate
    for ext in SUPPORTED_EXTS:
        p = Path(str(candidate) + ext)
        if p.exists():
            return p
    # try index files
    for ext in SUPPORTED_EXTS:
        p = candidate / ("index" + ext)
        if p.exists():
            return p
    return None


def build_graph(files, target_root: Path):
    id_map = {}
    nodes = []
    edges = []

    for i, f in enumerate(sorted(files)):
        rel = str(f.relative_to(target_root))
        id_map[str(f)] = i
        nodes.append({"id": i, "label": rel, "path": str(f), "group": f.suffix})

    outdeg = Counter()
    indeg = Counter()

    for f in files:
        text = read_text(f)
        for m in IMPORT_RE.finditer(text):
            imp = m.group(1) or m.group(2)
            if not imp:
                continue
            tgt = resolve_import(f, imp, target_root)
            if tgt is None:
                continue
            a = id_map.get(str(f))
            b = id_map.get(str(tgt))
            if a is None or b is None:
                continue
            edges.append({"source": a, "target": b})
            outdeg[a] += 1
            indeg[b] += 1

    return {"nodes": nodes, "links": edges, "stats": {"nodes": len(nodes), "links": len(edges), "top_out": outdeg.most_common(10), "top_in": indeg.most_common(10)}}


def write_outputs(graph, outdir: Path):
    outdir.mkdir(parents=True, exist_ok=True)
    (outdir / "graph.json").write_text(json.dumps(graph, indent=2), encoding="utf8")

    # simple report
    lines = []
    lines.append(f"# Graph Report\n")
    lines.append(f"- nodes: {graph['stats']['nodes']}")
    lines.append(f"- links: {graph['stats']['links']}")
    lines.append("\n## Top outgoing (by count)")
    for node_id, cnt in graph['stats']['top_out']:
        label = next((n['label'] for n in graph['nodes'] if n['id'] == node_id), str(node_id))
        lines.append(f"- {label}: {cnt}")
    lines.append("\n## Top incoming (by count)")
    for node_id, cnt in graph['stats']['top_in']:
        label = next((n['label'] for n in graph['nodes'] if n['id'] == node_id), str(node_id))
        lines.append(f"- {label}: {cnt}")

    (outdir / "GRAPH_REPORT.md").write_text("\n".join(lines), encoding="utf8")

    # simple interactive HTML embedding graph.json
    html = _generate_html()
    (outdir / "graph.html").write_text(html, encoding="utf8")


def _generate_html():
    # Uses d3 from CDN to keep the file small; JSON is loaded inline by fetching graph.json
    return """<!doctype html>
<html>
<head>
  <meta charset="utf-8">
  <title>Graphify - graph</title>
  <style>body{font-family:Arial}svg{width:100%;height:90vh;border:1px solid #ddd}</style>
</head>
<body>
<h2>Project Graph</h2>
<div id="count"></div>
<svg id="svg"></svg>
<script src="https://d3js.org/d3.v6.min.js"></script>
<script>
fetch('graph.json').then(r=>r.json()).then(data=>{
  document.getElementById('count').innerText = `nodes: ${data.nodes.length} links: ${data.links.length}`;
  const width = document.documentElement.clientWidth;
  const height = window.innerHeight * 0.75;
  const svg = d3.select('#svg').attr('width', width).attr('height', height);
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const sim = d3.forceSimulation(data.nodes).force('link', d3.forceLink(data.links).id(d=>d.id).distance(50)).force('charge', d3.forceManyBody().strength(-120)).force('center', d3.forceCenter(width/2, height/2));

  const link = svg.append('g').attr('stroke', '#999').selectAll('line').data(data.links).join('line').attr('stroke-width',1);
  const node = svg.append('g').selectAll('circle').data(data.nodes).join('circle').attr('r',5).attr('fill', d=>color(d.group)).call(drag(sim));

  const label = svg.append('g').selectAll('text').data(data.nodes).join('text').text(d=>d.label).attr('font-size',10).attr('x',8).attr('y',3);

  sim.on('tick', ()=>{
    link.attr('x1', d=>d.source.x).attr('y1', d=>d.source.y).attr('x2', d=>d.target.x).attr('y2', d=>d.target.y);
    node.attr('cx', d=>d.x).attr('cy', d=>d.y);
    label.attr('x', d=>d.x).attr('y', d=>d.y);
  });

  function drag(sim){
    function started(event,d){ if(!event.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y }
    function dragged(event,d){ d.fx = event.x; d.fy = event.y }
    function ended(event,d){ if(!event.active) sim.alphaTarget(0); d.fx = null; d.fy = null }
    return d3.drag().on('start',started).on('drag',dragged).on('end',ended)
  }
});
</script>
</body>
</html>
"""


def main(argv):
    if len(argv) >= 2 and argv[1] == 'install':
        out = ROOT / 'graphify-out'
        (out / 'cache').mkdir(parents=True, exist_ok=True)
        print('Created', out)
        print('Note: to enable richer Python-based extraction you may `pip install graphifyy` separately.')
        return 0

    target = Path(argv[1]) if len(argv) > 1 else Path('.')
    target = (ROOT / target).resolve() if not target.is_absolute() else target
    if not target.exists():
        print('Target does not exist:', target)
        return 2

    files = find_files(target)
    graph = build_graph(files, target)
    outdir = ROOT / 'graphify-out'
    # write graph.json and report and html; graph.html expects graph.json in same folder
    write_outputs(graph, outdir)
    print('Wrote outputs to', outdir)
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv))
