import PageEntry from "~/lib/PageEntry";

export const createTweetIntent = (opts: {
  text: string;
  url?: string;
  hashtags?: string;
}) => `http://twitter.com/intent/tweet?${new URLSearchParams(opts).toString()}`;

export const createTweetIntentWithPage = (opts: {
  page: PageEntry;
  text: string;
  hashtags?: string;
}) =>
  createTweetIntent({
    ...opts,
    url: opts.page.url
  });

export const createFacebookIntent = (url: string) =>
  `http://www.facebook.com/share.php?${new URLSearchParams({
    u: url
  }).toString()}`;

export const createLineIntent = (opts: { url: string; text: string }) =>
  `https://social-plugins.line.me/lineit/share?${new URLSearchParams(
    opts
  ).toString()}`;
