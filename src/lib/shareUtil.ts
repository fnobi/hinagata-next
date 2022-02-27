import { stringify } from "querystring";

export function createTweetIntent(opts: {
  text: string;
  url?: string;
  hashtags?: string;
}) {
  return `http://twitter.com/intent/tweet?${stringify(opts)}`;
}

export function createFacebookIntent(u: string) {
  return `http://www.facebook.com/share.php?${stringify({ u })}`;
}

export function createLineIntent(opts: { url: string; text: string }) {
  return `https://social-plugins.line.me/lineit/share?${stringify(opts)}`;
}
