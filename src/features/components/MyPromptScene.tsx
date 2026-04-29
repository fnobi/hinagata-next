"use client";

import { useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { ClientDataStoreAgent } from "~/common/lib/ClientDataStoreAgent";
import { buttonReset, px, alphaColor } from "~/common/lib/css-util";
import { useDataStoreList } from "~/common/lib/database-common-hooks";
import { useAuthorizedUser } from "~/common/lib/firebase-auth-tools";
import type FirebaseErrorParameter from "~/common/schema/FirebaseErrorParameter";
import { TITLE_BAR_HEIGHT } from "~/features/components/LayoutRoot";
import { THEME_COLOR } from "~/features/lib/emotion-mixin";
import buildPrompt from "~/features/lib/buildPrompt";
import { PAGE_TOP } from "~/features/lib/page-path";
import usePromptStore from "~/features/lib/promptStore";
import { myPromptDataStoreScheme } from "~/features/schema/app-data-store-scheme";
import type MyPromptItem from "~/features/schema/MyPromptItem";

const ACCENT = "#6366f1";
const BORDER = "#e2e8f0";
const BG = "#f8fafc";
const TEXT_MAIN = "#1e293b";
const TEXT_SUB = "#64748b";

const Root = styled.div({
  minHeight: "100vh",
  background: BG,
  paddingTop: px(TITLE_BAR_HEIGHT + 24),
  paddingBottom: px(100)
});

const Inner = styled.div({
  maxWidth: px(760),
  margin: "0 auto",
  padding: px(0, 16)
});

const PageTitle = styled.h1({
  fontSize: px(18),
  fontWeight: 700,
  color: TEXT_MAIN,
  marginBottom: px(20)
});

const EmptyMessage = styled.p({
  color: TEXT_SUB,
  fontSize: px(14),
  fontStyle: "italic"
});

const PromptCard = styled.div({
  background: THEME_COLOR.WHITE,
  border: `1px solid ${BORDER}`,
  borderRadius: px(10),
  padding: px(16, 20),
  marginBottom: px(12),
  display: "flex",
  gap: px(8),
  alignItems: "flex-start"
});

const PromptText = styled.p({
  flex: 1,
  fontSize: px(13),
  lineHeight: 1.7,
  color: TEXT_MAIN,
  fontFamily: "monospace",
  wordBreak: "break-word",
  margin: 0
});

const ActionButton = styled.button(buttonReset, {
  flexShrink: 0,
  padding: px(5, 10),
  borderRadius: px(6),
  fontSize: px(12),
  border: `1px solid ${BORDER}`,
  transition: "all 0.15s ease"
});

const LoadButton = styled(ActionButton)({
  color: ACCENT,
  borderColor: ACCENT,
  "&:hover": {
    background: "#e0e7ff"
  }
});

const DeleteButton = styled(ActionButton)({
  color: TEXT_SUB,
  "&:hover": {
    borderColor: "#ef4444",
    color: "#ef4444"
  }
});

const LoginMessage = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: px(200),
  fontSize: px(14),
  color: alphaColor(TEXT_SUB as `#${string}`, 0.8)
});

const myPromptDataStore = new ClientDataStoreAgent(myPromptDataStoreScheme);

type PromptItemCardProps = {
  id: string;
  data: MyPromptItem;
  userId: string;
};

const PromptItemCard = ({ id, data, userId }: PromptItemCardProps) => {
  const router = useRouter();
  const setSubjectItems = usePromptStore(state => state.setSubjectItems);
  const setSubjectSelectedIds = usePromptStore(
    state => state.setSubjectSelectedIds
  );
  const setSelectedIds = usePromptStore(state => state.setSelectedIds);

  const text = buildPrompt(data.prompt);

  const handleLoad = useCallback(() => {
    setSubjectItems(data.prompt.subjectItems);
    setSubjectSelectedIds(data.prompt.subjectSelectedIds);
    setSelectedIds(data.prompt.selectedIds);
    router.push(PAGE_TOP.href);
  }, [data.prompt, setSubjectItems, setSubjectSelectedIds, setSelectedIds, router]);

  const handleDelete = useCallback(() => {
    myPromptDataStore.deleteItem({ userId, promptId: id });
  }, [id, userId]);

  return (
    <PromptCard>
      <PromptText>{text || "(空のプロンプト)"}</PromptText>
      <LoadButton type="button" onClick={handleLoad}>
        読み込む
      </LoadButton>
      <DeleteButton type="button" onClick={handleDelete}>
        削除
      </DeleteButton>
    </PromptCard>
  );
};

const ListView = ({ userId }: { userId: string }) => {
  const params = useMemo(() => ({ userId }), [userId]);
  const handleError = useCallback(
    (e: FirebaseErrorParameter) => console.error(e),
    []
  );
  const list = useDataStoreList({
    dataStore: myPromptDataStore,
    params,
    onError: handleError
  });

  if (!list) {
    return <p>読み込み中...</p>;
  }

  return (
    <div>
      {list.length === 0 ? (
        <EmptyMessage>保存されたプロンプトはありません。</EmptyMessage>
      ) : (
        list.map(({ id, data }) => (
          <PromptItemCard key={id} id={id} data={data} userId={userId} />
        ))
      )}
    </div>
  );
};

const MyPromptScene = () => {
  const { myId } = useAuthorizedUser();

  if (!myId) {
    return (
      <Root>
        <LoginMessage>この機能を使うにはログインしてください。</LoginMessage>
      </Root>
    );
  }

  return (
    <Root>
      <Inner>
        <PageTitle>お気に入りのプロンプト</PageTitle>
        <ListView userId={myId} />
      </Inner>
    </Root>
  );
};

export default MyPromptScene;
