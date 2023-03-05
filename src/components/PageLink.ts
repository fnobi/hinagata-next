import { AnchorHTMLAttributes, createElement, FC, ReactNode } from "react";
import Link from "next/link";
import { PageEntry } from "~/lib/page-entry";

const PageLink: FC<
  AnchorHTMLAttributes<Element> & {
    children: ReactNode;
    page: PageEntry;
  }
> = props => {
  const { children, page } = props;
  return createElement(
    Link,
    { href: page.href, passHref: true },
    createElement("a", { ...props, href: "passHref" }, children)
  );
};

export default PageLink;
