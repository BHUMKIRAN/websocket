# Local graphify

This repository includes a lightweight local `graphify` tool for building a simple project knowledge graph.

Quick usage:

Install (creates cache):

```bash
./graphify install
```

Scan a folder (example `./raw`):

```bash
./graphify ./raw
```

Outputs are written to `graphify-out/`:

- `graph.json` — exportable graph
- `graph.html` — interactive viewer (uses d3 from CDN)
- `GRAPH_REPORT.md` — small summary

Notes:

- The tool is a small, self-contained scanner implemented in `tools/graphify_cli.py` and intentionally avoids external Python dependencies. For more advanced analysis you can still `pip install graphifyy` separately if you prefer that package.
- Make `graphify` executable if you want to run it directly: `chmod +x graphify`.
