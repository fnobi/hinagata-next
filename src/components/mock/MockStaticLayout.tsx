import styled from "@emotion/styled";
import { type ReactNode } from "react";
import { em } from "~/lib/css-util";

const Wrapper = styled.div({
  margin: "auto",
  maxWidth: em(40),
  padding: em(1),
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "stretch",
  flexDirection: "column",
  gap: em(1)
});

const TitleLine = styled.div({
  fontWeight: "bold"
});

function MockStaticLayout({
  title,
  children
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <Wrapper>
      {title ? <TitleLine>{title}</TitleLine> : null}
      {children}
    </Wrapper>
  );
}

export default MockStaticLayout;
