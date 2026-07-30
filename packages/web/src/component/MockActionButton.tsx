"use client";

import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";
import { type ReactNode } from "react";
import type CommonActionParameter from "~/common/CommonActionParameter";
import { buttonReset, percent } from "~/common/css-util";

const actionItemCommonStyle = css({
  color: "inherit",
  textDecoration: "underline"
});
const ActionItemLink = styled.a(actionItemCommonStyle);
// next/link は自前で <a> を描画するため、styled で直接ラップして装飾する
// （旧 legacyBehavior + 子の <a> に passHref する書き方は非推奨のため）。
const ActionItemPageLink = styled(Link)(actionItemCommonStyle);
const ActionItemButton = styled.button(buttonReset, actionItemCommonStyle, {
  "&:disabled": {
    opacity: 0.5,
    pointerEvents: "none"
  }
});

const MockActionButton = <T extends ReactNode>({
  children,
  action
}: {
  children: T;
  action: CommonActionParameter | null;
}) => {
  if (!action || action.type === "button" || action.type === "submit") {
    return (
      <ActionItemButton
        type={action && action.type === "submit" ? "submit" : "button"}
        disabled={!action}
        onClick={
          action && action.type === "button" ? action.onClick : undefined
        }
      >
        {children}
      </ActionItemButton>
    );
  }
  if (action.type === "input-file") {
    return (
      <div
        style={{
          position: "relative"
        }}
      >
        <ActionItemButton type="button">{children}</ActionItemButton>
        <input
          type="file"
          onChange={e => {
            const { files } = e.target;
            action.onChange(Array.from(files || []));
          }}
          style={{
            position: "absolute",
            display: "block",
            appearance: "none",
            left: 0,
            top: 0,
            width: percent(100),
            height: percent(100),
            opacity: 0,
            cursor: "pointer"
          }}
        />
      </div>
    );
  }
  if (action.type === "page-link") {
    return (
      <ActionItemPageLink href={action.page.href}>
        {children}
      </ActionItemPageLink>
    );
  }
  return (
    <ActionItemLink
      href={action.href}
      target={
        action.type === "external-link" && action.blank ? "_blank" : undefined
      }
      rel={
        action.type === "external-link" && action.blank
          ? "noopener noreferrer"
          : undefined
      }
      download={action.type === "download" ? action.download : undefined}
    >
      {children}
    </ActionItemLink>
  );
};

export default MockActionButton;
