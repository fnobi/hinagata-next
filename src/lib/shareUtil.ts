import qs from "querystring";

export function createTweetIntent(opts: {
  text: string;
  url?: string;
  hashtags?: string;
}) {
  return `http://twitter.com/intent/tweet?${qs.stringify(opts)}`;
}

export function createFacebookIntent(u: string) {
  return `http://www.facebook.com/share.php?${qs.stringify({ u })}`;
}

export function createLineIntent(opts: { url: string; text: string }) {
  return `https://social-plugins.line.me/lineit/share?${qs.stringify(opts)}`;
}
