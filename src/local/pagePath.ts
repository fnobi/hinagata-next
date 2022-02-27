export const PAGE_TOP = "/";
export const PAGE_ABOUT = "/about";
export const PAGE_ARTICLE_INDEX = "/article";
export const PAGE_ARTICLE_DETAIL = (id: string) =>
  `${PAGE_ARTICLE_INDEX}/${id}`;
