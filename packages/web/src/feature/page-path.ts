import PageEntry from "@hinagata-next/core/common/PageEntry";
import { BASE_URL } from "~/common/constants";

const PAGE_ROOT = new PageEntry(BASE_URL);

export const PAGE_TOP = PAGE_ROOT;
export const PAGE_REMOTE_PROFILE = PAGE_ROOT.child("remote-profile");
export const PAGE_LOCAL_PROFILE = PAGE_ROOT.child("local-profile");
