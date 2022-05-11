const { existsSync } = require("fs");
const { rename, mkdir, rm, rmdir } = require("fs/promises");
const path = require("path");

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const EXPORT_DIR = "out";
const DIST_DIR = "dist";

const distPath = path.join(DIST_DIR, BASE_PATH);

async function main() {
  if (!existsSync(EXPORT_DIR)) {
    throw new Error(`"${EXPORT_DIR}" doesn't exist.`);
  }
  if (existsSync(distPath)) {
    await rm(distPath, { recursive: true });
  } else {
    await mkdir(distPath, { recursive: true });
    await rmdir(distPath);
  }
  await rename(EXPORT_DIR, distPath);
}

main();
