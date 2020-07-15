const path = require("path");
const fs = require("fs");
const { basePath } = require("../next.config");

const EXPORT_DIR = "out";
const DIST_DIR = "dist";

const distPath = path.join(DIST_DIR, basePath);

function main() {
  if (!fs.existsSync(EXPORT_DIR)) {
    throw new Error(`"${EXPORT_DIR}" doesn't exist.`);
  }
  if (fs.existsSync(distPath)) {
    fs.rmdirSync(distPath, { recursive: true });
  } else {
    fs.mkdirSync(distPath, { recursive: true });
    fs.rmdirSync(distPath);
  }
  fs.renameSync(EXPORT_DIR, distPath);
}

main();
