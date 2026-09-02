import { writeFileSync } from "fs";
import { profilePostDataStoreSchema } from "@hinagata-next/core/feature/app-data-store-schema";
import { CliDataStoreAgent } from "~/lib/CliDataStoreAgent";
import { firebaseFirestore } from "~/lib/firebase-app";
import { toCsv } from "~/lib/csv-util";

const OUTPUT_PATH = process.argv[2] || "profilePosts.csv";

const CSV_HEADER = ["postId", "userId", "name", "email", "createdAt"];

const profilePostDataStore = new CliDataStoreAgent(
  firebaseFirestore,
  profilePostDataStoreSchema
);

async function main() {
  const list = await profilePostDataStore.fetchList({});

  const rows = list.map(({ id, data }) => [
    id,
    data.userId,
    data.profile.name,
    data.profile.email,
    data.createdAt ? data.createdAt.toDate().toISOString() : ""
  ]);

  writeFileSync(OUTPUT_PATH, toCsv(CSV_HEADER, rows), "utf8");
  console.log(`exported ${rows.length} profilePosts to ${OUTPUT_PATH}`);
}

main();
