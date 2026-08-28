const { existsSync } = require("fs");
const { rm, rename, mkdir, glob } = require("fs/promises");
const { basename, dirname, relative, join } = require("path");

const SRC_DIR = join("packages/web", "dist");
const DEST_DIR = join(
  "packages/functions",
  process.env.FUNCTIONS_PUBLIC_DIR_NAME ?? "public"
);

async function main() {
  if (existsSync(DEST_DIR)) {
    console.log("rm:", DEST_DIR);
    await rm(DEST_DIR, { recursive: true });
  }

  for await (const src of glob(`${SRC_DIR}/**/*.html`)) {
    const relativePath = relative(SRC_DIR, src);
    const dest = join(DEST_DIR, relativePath);
    const destDir = dirname(dest);
    if (!existsSync(destDir)) {
      console.log("mkdir:", destDir);
      await mkdir(destDir, { recursive: true });
    }
    console.log("move:", src, "->", dest);
    await rename(src, dest);
  }
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});