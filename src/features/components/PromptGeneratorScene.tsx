"use client";

import { useState, useCallback } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { buttonReset, px, alphaColor } from "~/common/lib/css-util";
import requestAppCallable from "~/features/lib/requestAppCallable";
import { THEME_COLOR } from "~/features/lib/emotion-mixin";
import {
  type PromptItem,
  type PromptCategory
} from "~/features/schema/PromptItem";
import PROMPT_CATEGORIES from "~/features/lib/promptData";

const ACCENT = "#6366f1";
const ACCENT_LIGHT = "#e0e7ff";
const BORDER = "#e2e8f0";
const BG = "#f8fafc";
const TEXT_MAIN = "#1e293b";
const TEXT_SUB = "#64748b";

const Root = styled.div({
  minHeight: "100vh",
  background: BG,
  padding: px(0, 0, 80)
});

const Header = styled.header({
  background: THEME_COLOR.WHITE,
  borderBottom: `1px solid ${BORDER}`,
  padding: px(24, 32)
});

const HeaderTitle = styled.h1({
  fontSize: px(22),
  fontWeight: 700,
  color: TEXT_MAIN,
  margin: 0
});

const HeaderDesc = styled.p({
  fontSize: px(13),
  color: TEXT_SUB,
  margin: px(6, 0, 0)
});

const Body = styled.div({
  maxWidth: px(1100),
  margin: "0 auto",
  padding: px(32, 24),
  display: "grid",
  gridTemplateColumns: "1fr 380px",
  gap: px(24),
  "@media (max-width: 860px)": {
    gridTemplateColumns: "1fr",
    padding: px(20, 16)
  }
});

const LeftCol = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: px(16)
});

const RightCol = styled.div({
  display: "flex",
  flexDirection: "column",
  gap: px(16),
  "@media (max-width: 860px)": {
    order: -1
  }
});

const Card = styled.div({
  background: THEME_COLOR.WHITE,
  border: `1px solid ${BORDER}`,
  borderRadius: px(10),
  padding: px(20)
});

const CategoryTitle = styled.h2({
  fontSize: px(13),
  fontWeight: 700,
  color: TEXT_SUB,
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
  border: `1.5px solid ${BORDER}`,
  background: THEME_COLOR.WHITE,
  color: TEXT_MAIN,
  cursor: "pointer",
  transition: "all 0.15s ease",
  "&:hover": {
    borderColor: ACCENT,
    color: ACCENT,
    background: ACCENT_LIGHT
  }
});

const tagSelected = css({
  background: ACCENT,
  borderColor: ACCENT,
  color: THEME_COLOR.WHITE,
  "&:hover": {
    background: "#4f46e5",
    borderColor: "#4f46e5",
    color: THEME_COLOR.WHITE
  }
});

const Tag = styled.button<{ selected: boolean }>(tagBase, ({ selected }) =>
  selected ? tagSelected : {}
);

const TooltipWrapper = styled.div({
  position: "relative",
  display: "inline-block"
});

const Tooltip = styled.div({
  position: "absolute",
  bottom: "calc(100% + 8px)",
  left: "50%",
  transform: "translateX(-50%)",
  background: TEXT_MAIN,
  color: THEME_COLOR.WHITE,
  borderRadius: px(8),
  padding: px(10, 12),
  width: px(220),
  zIndex: 100,
  pointerEvents: "none",
  boxShadow: `0 4px 16px ${alphaColor(THEME_COLOR.BLACK, 0.2)}`,
  "&::after": {
    content: '""',
    position: "absolute",
    top: "100%",
    left: "50%",
    transform: "translateX(-50%)",
    borderWidth: px(6),
    borderStyle: "solid",
    borderColor: `${TEXT_MAIN} transparent transparent transparent`
  }
});

const TooltipValue = styled.div({
  fontSize: px(11),
  color: alphaColor(THEME_COLOR.WHITE, 0.7),
  fontFamily: "monospace",
  marginBottom: px(4),
  wordBreak: "break-word"
});

const TooltipDesc = styled.div({
  fontSize: px(12),
  lineHeight: 1.5
});

const SubjectCard = styled(Card)({});

const SubjectLabel = styled.label({
  display: "block",
  fontSize: px(13),
  fontWeight: 700,
  color: TEXT_SUB,
  marginBottom: px(8),
  textTransform: "uppercase",
  letterSpacing: "0.08em"
});

const SubjectTagsGrid = styled(TagsGrid)({
  marginBottom: px(12)
});

const SubjectInput = styled.input({
  width: "100%",
  boxSizing: "border-box",
  border: `1.5px solid ${BORDER}`,
  borderRadius: px(8),
  padding: px(10, 12),
  fontSize: px(13),
  fontFamily: "inherit",
  color: TEXT_MAIN,
  outline: "none",
  transition: "border-color 0.15s ease",
  "&:focus": {
    borderColor: ACCENT
  },
  "&::placeholder": {
    color: alphaColor(TEXT_SUB as `#${string}`, 0.6)
  }
});

const OutputCard = styled(Card)({
  position: "sticky",
  top: px(24)
});

const OutputLabel = styled.div({
  fontSize: px(13),
  fontWeight: 700,
  color: TEXT_SUB,
  marginBottom: px(8),
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
});

const SelectedCount = styled.span({
  fontSize: px(12),
  fontWeight: 400,
  color: TEXT_SUB
});

const OutputText = styled.div({
  minHeight: px(120),
  border: `1.5px solid ${BORDER}`,
  borderRadius: px(8),
  padding: px(12),
  fontSize: px(13),
  lineHeight: 1.7,
  color: TEXT_MAIN,
  fontFamily: "monospace",
  background: BG,
  wordBreak: "break-word",
  whiteSpace: "pre-wrap",
  marginBottom: px(12)
});

const EmptyOutput = styled.div({
  color: alphaColor(TEXT_SUB as `#${string}`, 0.5),
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
          background: "#10b981",
          color: THEME_COLOR.WHITE,
          cursor: "default"
        }
      : {
          background: ACCENT,
          color: THEME_COLOR.WHITE,
          "&:hover": { background: "#4f46e5" },
          "&:active": { background: "#4338ca" }
        }
);

const TranslateRow = styled.div({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: px(8),
  marginTop: px(6)
});

const TranslateError = styled.span({
  fontSize: px(11),
  color: "#ef4444"
});

const TranslateButton = styled.button<{ isLoading: boolean }>(buttonReset, {
  padding: px(5, 12),
  borderRadius: px(6),
  fontSize: px(12),
  fontWeight: 500,
  border: `1.5px solid ${BORDER}`,
  color: TEXT_SUB,
  transition: "all 0.15s ease",
  "&:not(:disabled):hover": {
    borderColor: ACCENT,
    color: ACCENT,
    background: ACCENT_LIGHT
  },
  "&:disabled": {
    opacity: 0.5,
    cursor: "default"
  }
});

const ClearButton = styled.button(buttonReset, {
  width: "100%",
  padding: px(9),
  borderRadius: px(8),
  fontSize: px(13),
  fontWeight: 500,
  textAlign: "center",
  border: `1.5px solid ${BORDER}`,
  color: TEXT_SUB,
  marginTop: px(8),
  transition: "all 0.15s ease",
  "&:hover": {
    borderColor: "#ef4444",
    color: "#ef4444"
  }
});

const SelectedBadges = styled.div({
  display: "flex",
  flexWrap: "wrap",
  gap: px(4),
  marginTop: px(12)
});

const SelectedBadge = styled.div({
  display: "flex",
  alignItems: "center",
  gap: px(4),
  padding: px(3, 8),
  background: ACCENT_LIGHT,
  borderRadius: px(12),
  fontSize: px(11),
  color: ACCENT,
  fontWeight: 500
});

const BadgeRemove = styled.button(buttonReset, {
  width: px(14),
  height: px(14),
  borderRadius: "50%",
  background: ACCENT,
  color: THEME_COLOR.WHITE,
  fontSize: px(10),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  lineHeight: 1,
  flexShrink: 0,
  "&:hover": {
    background: "#4f46e5"
  }
});

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

const buildPrompt = (
  subjectItems: SubjectItem[],
  subjectSelectedIds: Set<string>,
  selectedIds: Set<string>,
  categories: PromptCategory[]
): string => {
  const parts: string[] = [];
  for (const item of subjectItems) {
    if (subjectSelectedIds.has(item.id)) {
      parts.push(item.value);
    }
  }
  for (const category of categories) {
    for (const item of category.items) {
      if (selectedIds.has(item.id)) {
        parts.push(item.value);
      }
    }
  }
  return parts.join(", ");
};

const findItem = (
  id: string,
  categories: PromptCategory[]
): PromptItem | undefined => {
  for (const cat of categories) {
    const found = cat.items.find(i => i.id === id);
    if (found) {
      return found;
    }
  }
  return undefined;
};

const PromptGeneratorScene = () => {
  const [subjectInput, setSubjectInput] = useState("");
  const [subjectItems, setSubjectItems] = useState<SubjectItem[]>([]);
  const [subjectSelectedIds, setSubjectSelectedIds] = useState<Set<string>>(
    new Set()
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translateError, setTranslateError] = useState("");

  const toggleItem = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const toggleSubjectItem = useCallback((id: string) => {
    setSubjectSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setSelectedIds(new Set());
    setSubjectItems([]);
    setSubjectSelectedIds(new Set());
    setSubjectInput("");
    setCopied(false);
  }, []);

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
      setSubjectItems(prev => [...prev, newItem]);
      setSubjectSelectedIds(prev => new Set([...prev, newItem.id]));
      setSubjectInput("");
    } catch {
      setTranslateError("翻訳に失敗しました");
    } finally {
      setTranslating(false);
    }
  }, [subjectInput]);

  const prompt = buildPrompt(
    subjectItems,
    subjectSelectedIds,
    selectedIds,
    PROMPT_CATEGORIES
  );

  const handleCopy = useCallback(() => {
    if (!prompt) {
      return;
    }
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [prompt]);

  const selectedCount = selectedIds.size + subjectSelectedIds.size;

  return (
    <Root>
      <Header>
        <HeaderTitle>AI 画像プロンプトジェネレーター</HeaderTitle>
        <HeaderDesc>
          各カテゴリからオプションを選んでプロンプトを組み立てましょう。タグにカーソルを合わせると説明が表示されます。
        </HeaderDesc>
      </Header>

      <Body>
        <LeftCol>
          <SubjectCard>
            <SubjectLabel htmlFor="subject-input">主題・被写体</SubjectLabel>
            {subjectItems.length > 0 && (
              <SubjectTagsGrid>
                {subjectItems.map(item => (
                  <SubjectTagItem
                    key={item.id}
                    item={item}
                    selected={subjectSelectedIds.has(item.id)}
                    onToggle={toggleSubjectItem}
                  />
                ))}
              </SubjectTagsGrid>
            )}
            <SubjectInput
              id="subject-input"
              type="text"
              placeholder="例: 花畑に立つ若い女性"
              value={subjectInput}
              onChange={e => setSubjectInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !translating && subjectInput.trim()) {
                  handleAddSubject();
                }
              }}
            />
            <TranslateRow>
              {translateError && (
                <TranslateError>{translateError}</TranslateError>
              )}
              <TranslateButton
                type="button"
                isLoading={translating}
                disabled={translating || !subjectInput.trim()}
                onClick={handleAddSubject}
              >
                {translating ? "追加中..." : "追加"}
              </TranslateButton>
            </TranslateRow>
          </SubjectCard>

          {PROMPT_CATEGORIES.map(category => (
            <Card key={category.id}>
              <CategoryTitle>{category.label}</CategoryTitle>
              <TagsGrid>
                {category.items.map(item => (
                  <TooltipItem
                    key={item.id}
                    item={item}
                    selected={selectedIds.has(item.id)}
                    onToggle={toggleItem}
                  />
                ))}
              </TagsGrid>
            </Card>
          ))}
        </LeftCol>

        <RightCol>
          <OutputCard>
            <OutputLabel>
              生成プロンプト
              <SelectedCount>
                {selectedCount > 0 ? `${selectedCount} 件選択中` : "未選択"}
              </SelectedCount>
            </OutputLabel>

            <OutputText>
              {prompt || (
                <EmptyOutput>
                  左のカテゴリからオプションを選ぶと、ここにプロンプトが表示されます。
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

            <ClearButton onClick={clearAll} type="button">
              すべてクリア
            </ClearButton>

            {selectedIds.size > 0 && (
              <SelectedBadges>
                {Array.from(selectedIds).map(id => {
                  const item = findItem(id, PROMPT_CATEGORIES);
                  if (!item) {
                    return null;
                  }
                  return (
                    <SelectedBadge key={id}>
                      {item.label}
                      <BadgeRemove
                        onClick={() => toggleItem(id)}
                        type="button"
                        aria-label={`${item.label}を削除`}
                      >
                        ×
                      </BadgeRemove>
                    </SelectedBadge>
                  );
                })}
              </SelectedBadges>
            )}
          </OutputCard>
        </RightCol>
      </Body>
    </Root>
  );
};

export default PromptGeneratorScene;
