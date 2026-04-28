const { readdir, writeFile } = require("fs/promises");
const { relative, join, basename } = require("path");

const SRC_ROOT = "./src";
const MODULE_ROOT = join(SRC_ROOT, "module");

async function main() {
  const dest = join(SRC_ROOT, "index.ts");
  const files = await readdir(MODULE_ROOT);
  const body = files
    .filter(name => /\.ts$/.test(name))
    .map(name => {
      const b = basename(name, ".ts");
      const p = relative(SRC_ROOT, join(MODULE_ROOT, b));
      return `if (!process.env.FUNCTION_NAME || process.env.FUNCTION_NAME === "${b}") { exports.${b} = require("./${p}").default; }`;
    })
    .join("\n");
  await writeFile(dest, body, { encoding: "utf8" });
}

main()
  .then(() => {
    process.exit();
  })
  .catch(e => {
    // eslint-disable-next-line no-console
    console.error(e);
  });
