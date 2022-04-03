const path = require("path");
const fs = require("fs");

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const EXPORT_DIR = "out";
const DIST_DIR = "dist";

const distPath = path.join(DIST_DIR, BASE_PATH);

function main() {
  if (!fs.existsSync(EXPORT_DIR)) {
    throw new Error(`"${EXPORT_DIR}" doesn't exist.`);
  }
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true });
  } else {
    fs.mkdirSync(distPath, { recursive: true });
    fs.rmSync(distPath);
  }
  fs.renameSync(EXPORT_DIR, distPath);
}

main();
