import { css } from "@emotion/react";
import styled from "@emotion/styled";
import Link from "next/link";
import { buttonReset, percent } from "~/lib/css-util";
import type CommonActionParameter from "~/scheme/CommonActionParameter";

const actionItemCommonStyle = css({
  color: "inherit",
  textDecoration: "underline"
});
const ActionItemLink = styled.a(actionItemCommonStyle);
const ActionItemButton = styled.button(buttonReset, actionItemCommonStyle, {
  "&:disabled": {
    opacity: 0.5,
    pointerEvents: "none"
  }
});

const MockActionButton = ({
  children,
  action
}: {
  children: string;
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
      <Link href={action.page.href} passHref legacyBehavior>
        <ActionItemLink href="passHref">{children}</ActionItemLink>
      </Link>
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
