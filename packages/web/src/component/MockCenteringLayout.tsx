import styled from "@emotion/styled";
import { type ReactNode } from "react";
import { percent } from "~/common/css-util";
import { THEME_COLOR } from "~/feature/emotion-mixin";

const Wrapper = styled.div({
  position: "fixed",
  left: 0,
  top: 0,
  width: percent(100),
  height: percent(100),
  backgroundColor: THEME_COLOR.WHITE,
  display: "flex",
  justifyContent: "center",
  alignItems: "center"
});

const MockCenteringLayout = ({ children }: { children: ReactNode }) => (
  <Wrapper>{children}</Wrapper>
);

export default MockCenteringLayout;
