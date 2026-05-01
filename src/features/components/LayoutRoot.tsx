"use client";

import { type ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { buttonReset, px } from "~/common/lib/css-util";
import {
  useAuthRoot,
  useAuthorizedUser
} from "~/common/lib/firebase-auth-tools";
import { firebaseAuth } from "~/common/lib/firebase-app";
import { THEME_COLOR } from "~/features/lib/emotion-mixin";
import { PAGE_TOP, PAGE_MY_PROMPT } from "~/features/lib/page-path";

export const TITLE_BAR_HEIGHT = 56;

const TitleBar = styled.header({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: px(TITLE_BAR_HEIGHT),
  background: THEME_COLOR.SURFACE,
  borderBottom: `1px solid ${THEME_COLOR.BORDER}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100
});

const TitleBarText = styled.h1({
  fontSize: px(16),
  fontWeight: 700,
  color: THEME_COLOR.TEXT_MAIN,
  margin: 0,
  letterSpacing: "0.04em"
});

const MenuButton = styled.button(buttonReset, {
  position: "absolute",
  left: px(16),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  gap: px(5),
  width: px(36),
  height: px(36),
  padding: px(6),
  borderRadius: px(6),
  cursor: "pointer",
  "&:hover": { background: THEME_COLOR.BG }
});

const MenuLine = styled.span({
  display: "block",
  height: px(2),
  background: THEME_COLOR.TEXT_MAIN,
  borderRadius: px(2)
});

const SidebarOverlay = styled.div<{ open: boolean }>(
  {
    position: "fixed",
    inset: 0,
    background: THEME_COLOR.OVERLAY,
    zIndex: 400,
    transition: "opacity 0.25s ease"
  },
  ({ open }) => ({
    opacity: open ? 1 : 0,
    pointerEvents: open ? "auto" : "none"
  })
);

const Sidebar = styled.nav<{ open: boolean }>(
  {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: px(280),
    background: THEME_COLOR.SURFACE,
    borderRight: `1px solid ${THEME_COLOR.BORDER}`,
    zIndex: 500,
    transition: "transform 0.25s ease",
    padding: px(TITLE_BAR_HEIGHT + 16, 20, 20)
  },
  ({ open }) => ({
    transform: open ? "translateX(0)" : "translateX(-100%)"
  })
);

const sidebarItemStyle = css({
  width: "100%",
  padding: px(12, 14),
  fontSize: px(14),
  fontWeight: 500,
  color: THEME_COLOR.TEXT_MAIN
});

const SidebarItem = styled.p(sidebarItemStyle);

const SidebarButton = styled.button(buttonReset, sidebarItemStyle, {
  display: "flex",
  alignItems: "center",
  gap: px(10),
  borderRadius: px(8),
  cursor: "pointer",
  transition: "background 0.15s ease",
  "&:hover": { background: THEME_COLOR.BG }
});

const SidebarNav = styled.nav({
  display: "flex",
  flexDirection: "column",
  gap: px(4),
  marginBottom: px(24),
  overflow: "hidden",
  borderRadius: px(8)
});

const SidebarNavItem = styled(Link, {
  shouldForwardProp: prop => prop !== "$isActive"
})<{ $isActive?: boolean }>(
  sidebarItemStyle,
  {
    display: "flex",
    alignItems: "center",
    borderRadius: px(8),
    textDecoration: "none",
    color: "inherit",
    transition: "background 0.15s ease, color 0.15s ease",
    "&:hover": { background: THEME_COLOR.BG }
  },
  ({ $isActive }) =>
    $isActive
      ? {
          background: THEME_COLOR.ACCENT_LIGHT,
          color: THEME_COLOR.ACCENT,
          fontWeight: 600
        }
      : {}
);

const SidebarCloseButton = styled.button(buttonReset, {
  position: "absolute",
  top: px(10),
  left: px(10),
  width: px(36),
  height: px(36),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: px(6),
  fontSize: px(20),
  color: THEME_COLOR.TEXT_MAIN,
  cursor: "pointer",
  "&:hover": { background: THEME_COLOR.BG }
});

const SidebarDivider = styled.div({
  height: "1px",
  background: THEME_COLOR.BORDER,
  margin: px(16, 0)
});

const ContentArea = styled.div({
  paddingTop: px(TITLE_BAR_HEIGHT)
});

const LayoutRoot = ({ children }: { children: ReactNode }) => {
  useAuthRoot();
  const pathname = usePathname();
  const { myId, myEmail } = useAuthorizedUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname === `${href}/`;

  return (
    <div>
      <TitleBar>
        <MenuButton
          type="button"
          aria-label="メニューを開く"
          onClick={() => setSidebarOpen(true)}
        >
          <MenuLine />
          <MenuLine />
          <MenuLine />
        </MenuButton>
        <TitleBarText>prompt-holder</TitleBarText>
      </TitleBar>

      <SidebarOverlay
        open={sidebarOpen}
        onClick={() => setSidebarOpen(false)}
      />
      <Sidebar open={sidebarOpen}>
        <SidebarCloseButton
          type="button"
          aria-label="メニューを閉じる"
          onClick={() => setSidebarOpen(false)}
        >
          ✕
        </SidebarCloseButton>
        <SidebarNav>
          <SidebarNavItem
            href={PAGE_TOP.href}
            $isActive={isActive(PAGE_TOP.basePath)}
            onClick={() => setSidebarOpen(false)}
          >
            プロンプト作成
          </SidebarNavItem>
          <SidebarNavItem
            href={PAGE_MY_PROMPT.href}
            $isActive={isActive(PAGE_MY_PROMPT.basePath)}
            onClick={() => setSidebarOpen(false)}
          >
            お気に入りプロンプト
          </SidebarNavItem>
        </SidebarNav>
        <SidebarDivider />
        {myId ? (
          <>
            <SidebarItem>{myEmail}</SidebarItem>
            <SidebarButton
              type="button"
              onClick={() => signOut(firebaseAuth())}
            >
              ログアウト
            </SidebarButton>
          </>
        ) : (
          <SidebarButton
            type="button"
            onClick={() => {
              const a = firebaseAuth();
              const p = new GoogleAuthProvider();
              signInWithPopup(a, p).catch(e => {
                console.log(e);
              });
            }}
          >
            ログイン
          </SidebarButton>
        )}
      </Sidebar>

      <ContentArea>{children}</ContentArea>
    </div>
  );
};

export default LayoutRoot;
