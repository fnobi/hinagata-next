import { google } from "googleapis";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const DEFAULT_QUERY = "東京 アート展示 企画展 #Shorts";
const DEFAULT_DAYS = 7;
const DEFAULT_MAX_RESULTS = 20;

function parseArgs() {
  const args = process.argv.slice(2);
  const query = args[0] || DEFAULT_QUERY;
  const days = Number(args[1]) || DEFAULT_DAYS;
  const maxResults = Number(args[2]) || DEFAULT_MAX_RESULTS;
  return { query, days, maxResults };
}

// YouTube Shorts は公式には60秒以下。videoDuration=short (4分以内) + タイトル/#Shorts確認で絞り込む
function isLikelyShort(title: string, description: string, durationIso: string): boolean {
  const hasShortTag =
    title.toLowerCase().includes("#shorts") ||
    title.toLowerCase().includes("#short") ||
    description.toLowerCase().includes("#shorts");

  // ISO 8601 duration を秒に変換 (e.g. PT58S, PT1M2S)
  const match = durationIso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return hasShortTag;
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  return totalSeconds <= 60 || hasShortTag;
}

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleString("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function main() {
  if (!YOUTUBE_API_KEY) {
    console.error("Error: 環境変数 YOUTUBE_API_KEY が設定されていません。");
    process.exit(1);
  }

  const { query, days, maxResults } = parseArgs();

  const publishedAfter = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

  console.log(`\n🔍 検索条件`);
  console.log(`  クエリ    : ${query}`);
  console.log(`  期間      : 過去 ${days} 日以内 (${publishedAfter.slice(0, 10)} 以降)`);
  console.log(`  最大件数  : ${maxResults} 件\n`);

  const youtube = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });

  // Step 1: 動画を検索 (videoDuration=short = 4分以内)
  const searchRes = await youtube.search.list({
    q: query,
    part: ["snippet"],
    type: ["video"],
    videoDuration: "short",
    publishedAfter,
    relevanceLanguage: "ja",
    regionCode: "JP",
    maxResults,
    order: "date",
  });

  const items = searchRes.data.items ?? [];
  if (items.length === 0) {
    console.log("該当動画が見つかりませんでした。");
    return;
  }

  const videoIds = items
    .map((item) => item.id?.videoId)
    .filter((id): id is string => !!id);

  // Step 2: 動画の詳細を取得（duration確認用）
  const detailRes = await youtube.videos.list({
    id: videoIds,
    part: ["contentDetails", "statistics"],
  });

  const detailMap = new Map(
    (detailRes.data.items ?? []).map((v) => [v.id, v])
  );

  // Step 3: Shorts らしいものに絞り込んで表示
  const results = items
    .map((item) => {
      const videoId = item.id?.videoId ?? "";
      const snippet = item.snippet;
      const detail = detailMap.get(videoId);
      const duration = detail?.contentDetails?.duration ?? "";
      const viewCount = detail?.statistics?.viewCount ?? "N/A";
      const title = snippet?.title ?? "";
      const description = snippet?.description ?? "";
      const publishedAt = snippet?.publishedAt ?? "";
      const channelTitle = snippet?.channelTitle ?? "";

      return {
        videoId,
        title,
        channelTitle,
        publishedAt,
        duration,
        viewCount,
        isShort: isLikelyShort(title, description, duration),
        url: `https://www.youtube.com/shorts/${videoId}`,
      };
    })
    .filter((v) => v.isShort);

  if (results.length === 0) {
    console.log("Shorts と判定できる動画が見つかりませんでした。");
    console.log("（--shorts フィルタを外すには isLikelyShort の条件を緩和してください）");
    return;
  }

  console.log(`✅ ${results.length} 件の Shorts が見つかりました\n`);
  console.log("─".repeat(70));

  for (const v of results) {
    console.log(`📹 ${v.title}`);
    console.log(`   チャンネル : ${v.channelTitle}`);
    console.log(`   投稿日時   : ${formatDate(v.publishedAt)}`);
    console.log(`   再生数     : ${Number(v.viewCount).toLocaleString("ja-JP")} 回`);
    console.log(`   URL        : ${v.url}`);
    console.log("─".repeat(70));
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
