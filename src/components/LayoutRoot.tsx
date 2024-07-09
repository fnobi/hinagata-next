import { type ReactNode } from "react";

function LayoutRoot({ children }: { children: ReactNode }) {
  return <div>{children}</div>;
}

export default LayoutRoot;
