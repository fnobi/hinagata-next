import { config } from "dotenv";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "../..");

config({ path: join(packageRoot, ".env.local"), quiet: true });

export const GOOGLE_CLOUD_PROJECT = process.env.GOOGLE_CLOUD_PROJECT;
