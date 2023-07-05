import PageEntry from "~/lib/PageEntry";
import { BASE_URL } from "~/local/constants";

const PAGE_ROOT = new PageEntry(BASE_URL);

export const PAGE_TOP = PAGE_ROOT;
export const PAGE_ABOUT = PAGE_ROOT.child("about");
export const PAGE_ARTICLE_INDEX = PAGE_ROOT.child("article");
