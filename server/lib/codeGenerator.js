import crypto from "crypto";

const generateCode = () => {
  return crypto.randomBytes(6).toString("hex").slice(0, length);
}

export default generateCode;