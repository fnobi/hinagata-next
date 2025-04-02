import type PageEntry from "~/lib/PageEntry";

type PageLinkParameter = {
  type: "page-link";
  page: PageEntry;
};
type LinkParamater =
  | PageLinkParameter
  | {
      type: "external-link";
      href: string;
      blank?: boolean;
    }
  | {
      type: "download";
      href: string;
      download: string;
    };
type CommonActionParameter =
  | { type: "button"; onClick: () => void }
  | { type: "input-file"; onChange: (f: File[]) => void }
  | { type: "submit" }
  | LinkParamater;

export default CommonActionParameter;
