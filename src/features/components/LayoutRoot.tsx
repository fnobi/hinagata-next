"use client";

import { type ReactNode } from "react";
// import { useAuthRoot } from "~/common/lib/firebase-auth-tools";

const LayoutRoot = ({ children }: { children: ReactNode }) => {
  // useAuthRoot();
  return <div>{children}</div>;
};

export default LayoutRoot;
