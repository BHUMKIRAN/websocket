import crypto from "crypto";

export function generateCode(length = 6) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

console.log(generateCode());