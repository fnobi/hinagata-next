import { FC, ReactElement } from "react";
import Link from "next/link";
import PageEntry from "~/lib/PageEntry";

const PageLink: FC<{
  children: ReactElement;
  page: PageEntry;
}> = ({ children, page }) => (
  <Link href={page.href} passHref>
    {children}
  </Link>
);

export default PageLink;
