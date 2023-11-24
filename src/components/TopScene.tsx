import styled from "@emotion/styled";
import { percent } from "~/lib/css-util";

const Wrapper = styled.div({
  position: "fixed",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  top: percent(0),
  left: percent(0),
  width: percent(100),
  height: percent(100)
});

const TitleLine = styled.div({
  fontWeight: "bold"
});

function TopScene() {
  return (
    <Wrapper>
      <TitleLine>Welcome to Next.js!</TitleLine>
    </Wrapper>
  );
}

export default TopScene;
