"use client";

import { useState, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { ClientDataStoreAgent } from "~/common/lib/ClientDataStoreAgent";
import { buttonReset, px } from "~/common/lib/css-util";
import { useAuthorizedUser } from "~/common/lib/firebase-auth-tools";
import { TITLE_BAR_HEIGHT } from "~/features/components/LayoutRoot";
import { THEME_COLOR } from "~/features/lib/emotion-mixin";
import buildPrompt from "~/features/lib/buildPrompt";
import PROMPT_CATEGORIES from "~/features/lib/promptData";
import requestAppCallable from "~/features/lib/requestAppCallable";
import usePromptStore from "~/features/lib/promptStore";
import { myPromptDataStoreScheme } from "~/features/schema/app-data-store-scheme";
import {
  type PromptItem,
  type PromptCategory
} from "~/features/schema/PromptItem";

// ─── Layout ───────────────────────────────────────────────────────────────────

const Root = styled.div({
  minHeight: "100vh",
  background: THEME_COLOR.BG,
  paddingBottom: px(100)
});

// ─── Scrollable tab bar ────────────────────────────────────────────────────────

const TabBarOuter = styled.div({
  background: THEME_COLOR.SURFACE,
  borderBottom: `1px solid ${THEME_COLOR.BORDER}`,
  position: "sticky",
  top: px(TITLE_BAR_HEIGHT),
  zIndex: 10
});

const TabBarScroll = styled.div({
  display: "flex",
  overflowX: "auto",
  padding: px(10, 16),
  gap: px(8),
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" }
});

const tabPillBase = css(buttonReset, {
  flexShrink: 0,
  padding: px(7, 16),
  borderRadius: px(999),
  fontSize: px(13),
  fontWeight: 500,
  whiteSpace: "nowrap",
  transition: "background 0.15s ease, color 0.15s ease",
  border: `1.5px solid transparent`
});

const TabPill = styled.button<{ active: boolean }>(tabPillBase, ({ active }) =>
  active
    ? {
        background: THEME_COLOR.ACCENT,
        color: "#ffffff"
      }
    : {
        background: THEME_COLOR.SURFACE,
        color: THEME_COLOR.TEXT_SUB,
        border: `1.5px solid ${THEME_COLOR.BORDER}`,
        "&:hover": {
          borderColor: THEME_COLOR.ACCENT,
          color: THEME_COLOR.ACCENT,
          background: THEME_COLOR.ACCENT_LIGHT
        }
      }
);

// ─── Body ─────────────────────────────────────────────────────────────────────

const Body = styled.div({
  maxWidth: px(760),
  margin: "0 auto",
  padding: px(24, 16)
});

const Card = styled.div({
  background: THEME_COLOR.SURFACE,
  border: `1px solid ${THEME_COLOR.BORDER}`,
  borderRadius: px(10),
  padding: px(20)
});

const CategoryTitle = styled.h2({
  fontSize: px(13),
  fontWeight: 700,
  color: THEME_COLOR.TEXT_SUB,
  margin: px(0, 0, 12),
  textTransform: "uppercase",
  letterSpacing: "0.08em"
});

const TagsGrid = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: px(8)
});

const tagBase = css(buttonReset, {
  position: "relative",
  padding: px(6, 12),
  borderRadius: px(20),
  fontSize: px(13),
  fontWeight: 500,
  border: `1.5px solid ${THEME_COLOR.BORDER}`,
  background: THEME_COLOR.SURFACE,
  color: THEME_COLOR.TEXT_MAIN,
  cursor: "pointer",
  transition: "all 0.15s ease",
  "&:hover": {
    borderColor: THEME_COLOR.ACCENT,
    color: THEME_COLOR.ACCENT,
    background: THEME_COLOR.ACCENT_LIGHT
  }
});

const tagSelected = css({
  background: THEME_COLOR.ACCENT,
  borderColor: THEME_COLOR.ACCENT,
  color: "#ffffff",
  "&:hover": {
    background: THEME_COLOR.ACCENT_HOVER,
    borderColor: THEME_COLOR.ACCENT_HOVER,
    color: "#ffffff"
  }
});

const Tag = styled.button<{ selected: boolean }>(tagBase, ({ selected }) =>
  selected ? tagSelected : {}
);

// ─── Tooltip ──────────────────────────────────────────────────────────────────

const TooltipWrapper = styled.div({
  position: "relative",
  display: "inline-block"
});

const Tooltip = styled.div({
  position: "absolute",
  bottom: "calc(100% + 8px)",
  left: "50%",
  transform: "translateX(-50%)",
  background: THEME_COLOR.TOOLTIP_BG,
  color: THEME_COLOR.TOOLTIP_TEXT,
  borderRadius: px(8),
  padding: px(10, 12),
  width: px(220),
  zIndex: 100,
  pointerEvents: "none",
  boxShadow: `0 4px 16px ${THEME_COLOR.SHADOW_SM}`,
  "&::after": {
    content: '""',
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    borderWidth: px(6),
    borderStyle: "solid",
    borderColor: `${THEME_COLOR.TOOLTIP_BG} transparent transparent transparent`
  }
});

const TooltipValue = styled.div({
  fontSize: px(11),
  color: THEME_COLOR.TOOLTIP_VALUE,
  fontFamily: "monospace",
  marginBottom: px(4),
  wordBreak: "break-word"
});

const TooltipDesc = styled.div({
  fontSize: px(12),
  lineHeight: 1.5
});

// ─── Subject card ─────────────────────────────────────────────────────────────

const SubjectHeaderRow = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: px(8)
});

const SubjectLabel = styled.label({
  display: "block",
  fontSize: px(13),
  fontWeight: 700,
  color: THEME_COLOR.TEXT_SUB,
  textTransform: "uppercase",
  letterSpacing: "0.08em"
});

const EditTrigger = styled.button(buttonReset, {
  display: "flex",
  alignItems: "center",
  gap: px(3),
  fontSize: px(11),
  color: THEME_COLOR.TEXT_SUB,
  padding: px(3, 7),
  borderRadius: px(4),
  transition: "all 0.15s ease",
  "&:hover": {
    color: THEME_COLOR.ACCENT,
    background: THEME_COLOR.ACCENT_LIGHT
  }
});

const SubjectTagsGrid = styled(TagsGrid)({
  marginBottom: px(12)
});

const SubjectInput = styled.input({
  width: "100%",
  boxSizing: "border-box",
  border: `1.5px solid ${THEME_COLOR.BORDER}`,
  borderRadius: px(8),
  padding: px(10, 12),
  fontSize: px(13),
  fontFamily: "inherit",
  color: THEME_COLOR.TEXT_MAIN,
  outline: "none",
  transition: "border-color 0.15s ease",
  "&:focus": {
    borderColor: THEME_COLOR.ACCENT
  },
  background: THEME_COLOR.SURFACE,
  "&::placeholder": {
    color: THEME_COLOR.TEXT_SUB_60
  }
});

const TranslateRow = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: px(8),
  marginTop: px(6)
});

const TranslateError = styled.span({
  fontSize: px(11),
  color: THEME_COLOR.ERROR
});

const TranslateButton = styled.button<{ isLoading: boolean }>(buttonReset, {
  padding: px(5, 12),
  borderRadius: px(6),
  fontSize: px(12),
  fontWeight: 500,
  border: `1.5px solid ${THEME_COLOR.BORDER}`,
  color: THEME_COLOR.TEXT_SUB,
  transition: "all 0.15s ease",
  "&:not(:disabled):hover": {
    borderColor: THEME_COLOR.ACCENT,
    color: THEME_COLOR.ACCENT,
    background: THEME_COLOR.ACCENT_LIGHT
  },
  "&:disabled": {
    opacity: 0.5,
    cursor: "default"
  }
});

// ─── FAB ──────────────────────────────────────────────────────────────────────

const Fab = styled.button<{ hasPrompt: boolean }>(buttonReset, {
  position: "fixed",
  bottom: px(28),
  right: px(28),
  width: px(56),
  height: px(56),
  borderRadius: "50%",
  background: THEME_COLOR.ACCENT,
  color: "#ffffff",
  boxShadow: `0 4px 20px ${THEME_COLOR.SHADOW_MD}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: px(24),
  zIndex: 200,
  transition: "background 0.15s ease, transform 0.15s ease",
  "&:hover": {
    background: THEME_COLOR.ACCENT_HOVER,
    transform: "scale(1.07)"
  },
  "&:active": {
    transform: "scale(0.96)"
  }
});

const FabBadge = styled.span({
  position: "absolute",
  top: px(-4),
  right: px(-4),
  background: THEME_COLOR.SUCCESS,
  color: "#ffffff",
  borderRadius: "50%",
  width: px(20),
  height: px(20),
  fontSize: px(10),
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1
});

// ─── Popup ────────────────────────────────────────────────────────────────────

const Overlay = styled.div({
  position: "fixed",
  inset: 0,
  background: THEME_COLOR.BLACK_OVERLAY,
  zIndex: 300,
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "center",
  "@media (min-width: 600px)": {
    alignItems: "center"
  }
});

const PopupPanel = styled.div({
  background: THEME_COLOR.SURFACE,
  borderRadius: px(16, 16, 0, 0),
  padding: px(24),
  width: "100%",
  maxWidth: px(600),
  maxHeight: "80vh",
  overflowY: "auto",
  "@media (min-width: 600px)": {
    borderRadius: px(16),
    margin: px(16)
  }
});

const PopupHeader = styled.div({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: px(16)
});

const PopupTitle = styled.div({
  fontSize: px(14),
  fontWeight: 700,
  color: THEME_COLOR.TEXT_MAIN
});

const PopupClose = styled.button(buttonReset, {
  width: px(32),
  height: px(32),
  borderRadius: "50%",
  background: THEME_COLOR.BG,
  color: THEME_COLOR.TEXT_SUB,
  fontSize: px(18),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": { background: THEME_COLOR.BORDER }
});

const OutputText = styled.div({
  minHeight: px(100),
  border: `1.5px solid ${THEME_COLOR.BORDER}`,
  borderRadius: px(8),
  padding: px(12),
  fontSize: px(13),
  lineHeight: 1.7,
  color: THEME_COLOR.TEXT_MAIN,
  fontFamily: "monospace",
  background: THEME_COLOR.BG,
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
  marginBottom: px(12)
});

const EmptyOutput = styled.div({
  color: THEME_COLOR.TEXT_SUB_50,
  fontFamily: "sans-serif",
  fontStyle: "italic",
  fontSize: px(13)
});

const CopyButton = styled.button<{ copied: boolean }>(
  buttonReset,
  {
    width: "100%",
    padding: px(11),
    borderRadius: px(8),
    fontSize: px(14),
    fontWeight: 600,
    textAlign: "center",
    transition: "all 0.15s ease"
  },
  ({ copied }) =>
    copied
      ? {
          background: THEME_COLOR.SUCCESS,
          color: "#ffffff",
          cursor: "default"
        }
      : {
          background: THEME_COLOR.ACCENT,
          color: "#ffffff",
          "&:hover": { background: THEME_COLOR.ACCENT_HOVER },
          "&:active": { background: THEME_COLOR.ACCENT_DEEP }
        }
);

const ClearButton = styled.button(buttonReset, {
  width: "100%",
  padding: px(9),
  borderRadius: px(8),
  fontSize: px(13),
  fontWeight: 500,
  textAlign: "center",
  border: `1.5px solid ${THEME_COLOR.BORDER}`,
  color: THEME_COLOR.TEXT_SUB,
  marginTop: px(8),
  transition: "all 0.15s ease",
  "&:hover": {
    borderColor: THEME_COLOR.ERROR,
    color: THEME_COLOR.ERROR
  }
});

const SaveButton = styled.button<{ saved: boolean }>(
  buttonReset,
  {
    width: "100%",
    padding: px(11),
    borderRadius: px(8),
    fontSize: px(14),
    fontWeight: 600,
    textAlign: "center",
    marginTop: px(8),
    transition: "all 0.15s ease"
  },
  ({ saved }) =>
    saved
      ? {
          background: THEME_COLOR.SUCCESS,
          color: "#ffffff",
          cursor: "default"
        }
      : {
          background: THEME_COLOR.SURFACE,
          color: THEME_COLOR.ACCENT,
          border: `1.5px solid ${THEME_COLOR.ACCENT}`,
          "&:hover:not(:disabled)": { background: THEME_COLOR.ACCENT_LIGHT },
          "&:disabled": { opacity: 0.5, cursor: "default" }
        }
);

// ─── Subject edit popup ───────────────────────────────────────────────────────

const EditListItem = styled.div({
  display: "flex",
  alignItems: "center",
  gap: px(8),
  padding: px(10, 0),
  borderBottom: `1px solid ${THEME_COLOR.BORDER}`,
  "&:last-child": { borderBottom: "none" }
});

const EditItemInfo = styled.div({
  flex: 1,
  minWidth: 0
});

const EditItemLabelText = styled.div({
  fontSize: px(13),
  fontWeight: 600,
  color: THEME_COLOR.TEXT_MAIN
});

const EditItemValue = styled.div({
  fontSize: px(11),
  color: THEME_COLOR.TEXT_SUB,
  fontFamily: "monospace",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  marginTop: px(2)
});

const EditItemActions = styled.div({
  display: "flex",
  gap: px(4),
  flexShrink: 0
});

const SmallIconBtn = styled.button(buttonReset, {
  width: px(28),
  height: px(28),
  borderRadius: px(6),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: px(13),
  color: THEME_COLOR.TEXT_SUB,
  border: `1px solid ${THEME_COLOR.BORDER}`,
  transition: "all 0.15s ease",
  "&:hover:not(:disabled)": {
    borderColor: THEME_COLOR.ACCENT,
    color: THEME_COLOR.ACCENT,
    background: THEME_COLOR.ACCENT_LIGHT
  },
  "&:disabled": {
    opacity: 0.3,
    cursor: "default"
  }
});

const DeleteIconBtn = styled(SmallIconBtn)({
  "&:hover:not(:disabled)": {
    borderColor: THEME_COLOR.ERROR,
    color: THEME_COLOR.ERROR,
    background: THEME_COLOR.ERROR_BG
  }
});

const EditEmptyState = styled.div({
  textAlign: "center",
  color: THEME_COLOR.TEXT_SUB_50,
  fontSize: px(13),
  padding: px(24, 0),
  fontStyle: "italic"
});

// ─── Sub-components ───────────────────────────────────────────────────────────

type TooltipItemProps = {
  item: PromptItem;
  selected: boolean;
  onToggle: (id: string) => void;
};

const TooltipItem = ({ item, selected, onToggle }: TooltipItemProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <TooltipWrapper
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {visible && (
        <Tooltip>
          <TooltipValue>{item.value}</TooltipValue>
          <TooltipDesc>{item.description}</TooltipDesc>
        </Tooltip>
      )}
      <Tag selected={selected} onClick={() => onToggle(item.id)} type="button">
        {item.label}
      </Tag>
    </TooltipWrapper>
  );
};

type SubjectItem = {
  id: string;
  label: string;
  value: string;
};

type SubjectTagItemProps = {
  item: SubjectItem;
  selected: boolean;
  onToggle: (id: string) => void;
};

const SubjectTagItem = ({ item, selected, onToggle }: SubjectTagItemProps) => {
  const [visible, setVisible] = useState(false);
  return (
    <TooltipWrapper
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {visible && (
        <Tooltip>
          <TooltipValue>{item.value}</TooltipValue>
        </Tooltip>
      )}
      <Tag selected={selected} onClick={() => onToggle(item.id)} type="button">
        {item.label}
      </Tag>
    </TooltipWrapper>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SUBJECT_TAB_ID = "__subject__";

type Tab = { id: string; label: string };

const buildTabs = (categories: PromptCategory[]): Tab[] => [
  { id: SUBJECT_TAB_ID, label: "主題・被写体" },
  ...categories.map(c => ({ id: c.id, label: c.label }))
];

// ─── Scene ────────────────────────────────────────────────────────────────────

const myPromptDataStore = new ClientDataStoreAgent(myPromptDataStoreScheme);

const TABS = buildTabs(PROMPT_CATEGORIES);

const PromptGeneratorScene = () => {
  const subjectItems = usePromptStore(state => state.subjectItems);
  const subjectSelectedIds = usePromptStore(state => state.subjectSelectedIds);
  const selectedIds = usePromptStore(state => state.selectedIds);
  const addSubjectItem = usePromptStore(state => state.addSubjectItem);
  const removeSubjectItem = usePromptStore(state => state.removeSubjectItem);
  const moveSubjectItem = usePromptStore(state => state.moveSubjectItem);
  const toggleSubjectSelected = usePromptStore(
    state => state.toggleSubjectSelected
  );
  const toggleSelected = usePromptStore(state => state.toggleSelected);
  const clearAllStore = usePromptStore(state => state.clearAll);

  const { myId } = useAuthorizedUser();

  const [activeTab, setActiveTab] = useState(SUBJECT_TAB_ID);
  const [subjectInput, setSubjectInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);
  const [editSubjectOpen, setEditSubjectOpen] = useState(false);

  const toggleItem = useCallback(
    (id: string) => {
      toggleSelected(id);
    },
    [toggleSelected]
  );

  const toggleSubjectItem = useCallback(
    (id: string) => {
      toggleSubjectSelected(id);
    },
    [toggleSubjectSelected]
  );

  const clearAll = useCallback(() => {
    clearAllStore();
    setSubjectInput("");
    setCopied(false);
  }, [clearAllStore]);

  const handleAddSubject = useCallback(async () => {
    const trimmed = subjectInput.trim();
    if (!trimmed) {
      return;
    }
    setTranslating(true);
    setTranslateError("");
    try {
      const res = await requestAppCallable("translateWithApi", {
        jaWord: trimmed
      });
      if (res.case !== "ok") {
        throw new Error(`HTTP ${res.error}`);
      }
      const newItem: SubjectItem = {
        id: `subject-${Date.now()}`,
        label: trimmed,
        value: res.data.enWord
      };
      addSubjectItem(newItem);
      setSubjectInput("");
    } catch {
      setTranslateError("翻訳に失敗しました");
    } finally {
      setTranslating(false);
    }
  }, [subjectInput, addSubjectItem]);

  const prompt = buildPrompt({ subjectItems, subjectSelectedIds, selectedIds });

  const handleCopy = useCallback(() => {
    if (!prompt) {
      return;
    }
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [prompt]);

  const handleSave = useCallback(async () => {
    if (!myId || !prompt) {
      return;
    }
    await myPromptDataStore.addItem({
      userId: myId,
      data: { prompt: { subjectItems, subjectSelectedIds, selectedIds }, createdAt: Date.now() }
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [myId, prompt, subjectItems, subjectSelectedIds, selectedIds]);

  const selectedCount = selectedIds.length + subjectSelectedIds.length;

  const activeCategory = PROMPT_CATEGORIES.find(c => c.id === activeTab);

  return (
    <Root>
      {/* Scrollable pill tab bar */}
      <TabBarOuter>
        <TabBarScroll>
          {TABS.map(tab => (
            <TabPill
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              type="button"
            >
              {tab.label}
            </TabPill>
          ))}
        </TabBarScroll>
      </TabBarOuter>

      <Body>
        {activeTab === SUBJECT_TAB_ID ? (
          <Card>
            <SubjectHeaderRow>
              <SubjectLabel htmlFor="subject-input">主題・被写体</SubjectLabel>
              {subjectItems.length > 0 && (
                <EditTrigger
                  type="button"
                  onClick={() => setEditSubjectOpen(true)}
                >
                  ✏ 編集
                </EditTrigger>
              )}
            </SubjectHeaderRow>
            {subjectItems.length > 0 && (
              <SubjectTagsGrid>
                {subjectItems.map(item => (
                  <SubjectTagItem
                    key={item.id}
                    item={item}
                    selected={subjectSelectedIds.includes(item.id)}
                    onToggle={toggleSubjectItem}
                  />
                ))}
              </SubjectTagsGrid>
            )}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleAddSubject();
              }}
            >
              <SubjectInput
                id="subject-input"
                type="text"
                placeholder="例: 花畑に立つ若い女性"
                value={subjectInput}
                onChange={e => setSubjectInput(e.target.value)}
              />
              <TranslateRow>
                {translateError && (
                  <TranslateError>{translateError}</TranslateError>
                )}
                <TranslateButton
                  type="submit"
                  isLoading={translating}
                  disabled={translating || !subjectInput.trim()}
                >
                  {translating ? "追加中..." : "追加"}
                </TranslateButton>
              </TranslateRow>
            </form>
          </Card>
        ) : activeCategory ? (
          <Card>
            <CategoryTitle>{activeCategory.label}</CategoryTitle>
            <TagsGrid>
              {activeCategory.items.map(item => (
                <TooltipItem
                  key={item.id}
                  item={item}
                  selected={selectedIds.includes(item.id)}
                  onToggle={toggleItem}
                />
              ))}
            </TagsGrid>
          </Card>
        ) : null}
      </Body>

      {/* FAB */}
      <Fab
        hasPrompt={!!prompt}
        onClick={() => setPopupOpen(true)}
        type="button"
        aria-label="プロンプトを表示"
      >
        ✦{selectedCount > 0 && <FabBadge>{selectedCount}</FabBadge>}
      </Fab>

      {/* Subject edit popup */}
      {editSubjectOpen && (
        <Overlay onClick={() => setEditSubjectOpen(false)}>
          <PopupPanel onClick={e => e.stopPropagation()}>
            <PopupHeader>
              <PopupTitle>主題・被写体を編集</PopupTitle>
              <PopupClose
                onClick={() => setEditSubjectOpen(false)}
                type="button"
                aria-label="閉じる"
              >
                ×
              </PopupClose>
            </PopupHeader>
            {subjectItems.length === 0 ? (
              <EditEmptyState>登録済みの項目がありません</EditEmptyState>
            ) : (
              subjectItems.map((item, index) => (
                <EditListItem key={item.id}>
                  <EditItemInfo>
                    <EditItemLabelText>{item.label}</EditItemLabelText>
                    <EditItemValue>{item.value}</EditItemValue>
                  </EditItemInfo>
                  <EditItemActions>
                    <SmallIconBtn
                      type="button"
                      onClick={() => moveSubjectItem(index, index - 1)}
                      disabled={index === 0}
                      aria-label="上に移動"
                    >
                      ↑
                    </SmallIconBtn>
                    <SmallIconBtn
                      type="button"
                      onClick={() => moveSubjectItem(index, index + 1)}
                      disabled={index === subjectItems.length - 1}
                      aria-label="下に移動"
                    >
                      ↓
                    </SmallIconBtn>
                    <DeleteIconBtn
                      type="button"
                      onClick={() => removeSubjectItem(item.id)}
                      aria-label="削除"
                    >
                      ×
                    </DeleteIconBtn>
                  </EditItemActions>
                </EditListItem>
              ))
            )}
          </PopupPanel>
        </Overlay>
      )}

      {/* Prompt popup */}
      {popupOpen && (
        <Overlay onClick={() => setPopupOpen(false)}>
          <PopupPanel onClick={e => e.stopPropagation()}>
            <PopupHeader>
              <PopupTitle>
                生成プロンプト
                {selectedCount > 0 && `　${selectedCount} 件選択中`}
              </PopupTitle>
              <PopupClose
                onClick={() => setPopupOpen(false)}
                type="button"
                aria-label="閉じる"
              >
                ×
              </PopupClose>
            </PopupHeader>

            <OutputText>
              {prompt || (
                <EmptyOutput>
                  カテゴリからオプションを選ぶと、ここにプロンプトが表示されます。
                </EmptyOutput>
              )}
            </OutputText>

            <CopyButton
              copied={copied}
              onClick={handleCopy}
              disabled={!prompt}
              type="button"
            >
              {copied ? "コピーしました ✓" : "クリップボードにコピー"}
            </CopyButton>

            {myId && (
              <SaveButton
                saved={saved}
                onClick={handleSave}
                disabled={!prompt || saved}
                type="button"
              >
                {saved ? "保存しました ✓" : "お気に入りに保存"}
              </SaveButton>
            )}

            <ClearButton onClick={clearAll} type="button">
              すべてクリア
            </ClearButton>
          </PopupPanel>
        </Overlay>
      )}
    </Root>
  );
};

export default PromptGeneratorScene;
