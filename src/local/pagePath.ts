import PageEntry from "~/lib/PageEntry";
import { BASE_URL } from "~/local/constants";

export const PAGE_TOP = new PageEntry(BASE_URL);
export const PAGE_ABOUT = PAGE_TOP.child("about");
export const PAGE_ARTICLE = PAGE_TOP.child("article");
