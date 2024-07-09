import {
  type AnchorHTMLAttributes,
  createElement,
  type ReactNode
} from "react";
import Link from "next/link";
import type PageEntry from "~/lib/PageEntry";

function PageLink(
  props: AnchorHTMLAttributes<Element> & {
    children: ReactNode;
    page: PageEntry;
  }
) {
  const { children, page } = props;
  return createElement(
    Link,
    { href: page.href, passHref: true, legacyBehavior: true },
    createElement("a", { ...props, href: "passHref" }, children)
  );
}

export default PageLink;
