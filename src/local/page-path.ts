import { BASE_URL } from "~/local/constants";
import PageEntry from "~/lib/PageEntry";

const PAGE_ROOT = new PageEntry(BASE_URL);

// eslint-disable-next-line import/prefer-default-export
export const PAGE_TOP = PAGE_ROOT;
// export const PAGE_ABOUT = PAGE_ROOT.child("about");
