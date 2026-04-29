"use client";

import { useCallback, useMemo } from "react";
import styled from "@emotion/styled";
import { useRouter } from "next/navigation";
import { ClientDataStoreAgent } from "~/common/lib/ClientDataStoreAgent";
import { buttonReset, px, alphaColor } from "~/common/lib/css-util";
import { useDataStoreList } from "~/common/lib/database-common-hooks";
import { useAuthorizedUser } from "~/common/lib/firebase-auth-tools";
import type FirebaseErrorParameter from "~/common/schema/FirebaseErrorParameter";
import { type QueryFormula } from "~/common/lib/DataStoreAgent";
import { TITLE_BAR_HEIGHT } from "~/features/components/LayoutRoot";
import { THEME_COLOR } from "~/features/lib/emotion-mixin";
import PROMPT_CATEGORIES from "~/features/lib/promptData";
import { PAGE_TOP } from "~/features/lib/page-path";
import usePromptStore from "~/features/lib/promptStore";
import { myPromptDataStoreScheme } from "~/features/schema/app-data-store-scheme";
import type MyPromptItem from "~/features/schema/MyPromptItem";
import type PromptState from "~/features/schema/PromptState";

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
  padding: px(14, 20),
  marginBottom: px(12)
});

const CardHeader = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: px(10)
});

const DateLabel = styled.span({
  fontSize: px(12),
  color: TEXT_SUB
});

const CardActions = styled.div({
  display: "flex",
  gap: px(6)
});

const TagList = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: px(6)
});

const Tag = styled.span({
  display: "inline-block",
  padding: px(3, 8),
  borderRadius: px(20),
  fontSize: px(12),
  background: "#eef2ff",
  color: ACCENT,
  lineHeight: 1.5
});

const EmptyTag = styled.span({
  fontSize: px(13),
  color: TEXT_SUB,
  fontStyle: "italic"
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

const LIST_QUERY: QueryFormula<MyPromptItem>[] = [["orderBy", "createdAt", "desc"]];

const buildJapaneseLabels = ({ subjectItems, subjectSelectedIds, selectedIds }: PromptState): string[] => {
  const labels: string[] = [];
  for (const item of subjectItems) {
    if (subjectSelectedIds.includes(item.id)) {
      labels.push(item.label);
    }
  }
  for (const category of PROMPT_CATEGORIES) {
    for (const item of category.items) {
      if (selectedIds.includes(item.id)) {
        labels.push(item.label);
      }
    }
  }
  return labels;
};

const formatCreatedAt = (ts: number) => {
  const d = new Date(ts);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
};

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

  const labels = buildJapaneseLabels(data.prompt);

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
      <CardHeader>
        <DateLabel>{formatCreatedAt(data.createdAt)}</DateLabel>
        <CardActions>
          <LoadButton type="button" onClick={handleLoad}>
            読み込む
          </LoadButton>
          <DeleteButton type="button" onClick={handleDelete}>
            削除
          </DeleteButton>
        </CardActions>
      </CardHeader>
      <TagList>
        {labels.length > 0 ? (
          labels.map((label, i) => <Tag key={i}>{label}</Tag>)
        ) : (
          <EmptyTag>(選択項目なし)</EmptyTag>
        )}
      </TagList>
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
    query: LIST_QUERY,
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
