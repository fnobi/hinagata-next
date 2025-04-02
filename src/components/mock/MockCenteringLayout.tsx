import styled from "@emotion/styled";
import { percent } from "~/lib/css-util";

const Wrapper = styled.div({
  position: "fixed",
  left: 0,
  top: 0,
  width: percent(100),
  height: percent(100),
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
});

function MockCenteringLayout({ children }: { children: string }) {
  return <Wrapper>{children}</Wrapper>;
}

export default MockCenteringLayout;
