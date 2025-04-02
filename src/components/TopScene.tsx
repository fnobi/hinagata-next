import styled from "@emotion/styled";
import { useState } from "react";
import { em } from "~/lib/css-util";
import MockProfileForm from "~/components/MockProfileForm";
import MockActionButton from "~/components/mock/MockActionButton";

const TABS = ["default", "form"] as const;

const Wrapper = styled.div({
  padding: em(1)
});

const TitleLine = styled.div({
  fontWeight: "bold"
});

const CommonSection = styled.div({
  margin: em(1, 0)
});

const TabRoot = styled.div({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: em(0.5)
});

function TopScene() {
  const [currentTab, setCurrentTab] =
    useState<(typeof TABS)[number]>("default");
  return (
    <Wrapper>
      <TitleLine>Welcome to Next.js!</TitleLine>
      <CommonSection>
        <TabRoot>
          {TABS.map(t => (
            <MockActionButton
              key={t}
              action={
                t === currentTab
                  ? null
                  : { type: "button", onClick: () => setCurrentTab(t) }
              }
            >
              {t}
            </MockActionButton>
          ))}
        </TabRoot>
      </CommonSection>
      {currentTab === "form" ? (
        <CommonSection>
          <MockProfileForm onCancel={() => setCurrentTab("default")} />
        </CommonSection>
      ) : null}
    </Wrapper>
  );
}

export default TopScene;
