const path = require("path");
const fs = require("fs");
const mkdirp = require("mkdirp");
const { basePath } = require("../buildConfig");

const EXPORT_DIR = "out";
const DIST_DIR = "dist";

const distPath = path.join(DIST_DIR, basePath);

function main() {
  if (!fs.existsSync(EXPORT_DIR)) {
    throw new Error(`"${EXPORT_DIR}" doesn't exist.`);
  }
  if (fs.existsSync(distPath)) {
    throw new Error(`"${distPath}" exists.`);
  }
  return Promise.resolve()
    .then(() => mkdirp(distPath))
    .then(() => fs.rmdirSync(distPath))
    .then(() => fs.renameSync(EXPORT_DIR, distPath));
}

main();
