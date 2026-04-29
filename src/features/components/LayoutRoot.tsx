"use client";

import { type ReactNode, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { buttonReset, px, alphaColor } from "~/common/lib/css-util";
import {
  useAuthRoot,
  useAuthorizedUser
} from "~/common/lib/firebase-auth-tools";
import { firebaseAuth } from "~/common/lib/firebase-app";
import { THEME_COLOR } from "~/features/lib/emotion-mixin";

export const TITLE_BAR_HEIGHT = 56;

const ACCENT = "#6366f1";
const ACCENT_LIGHT = "#e0e7ff";
const BORDER = "#e2e8f0";
const BG = "#f8fafc";
const TEXT_MAIN = "#1e293b";

const TitleBar = styled.header({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  height: px(TITLE_BAR_HEIGHT),
  background: THEME_COLOR.WHITE,
  borderBottom: `1px solid ${BORDER}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 100
});

const TitleBarText = styled.h1({
  fontSize: px(16),
  fontWeight: 700,
  color: TEXT_MAIN,
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
  "&:hover": { background: BG }
});

const MenuLine = styled.span({
  display: "block",
  height: px(2),
  background: TEXT_MAIN,
  borderRadius: px(2)
});

const SidebarOverlay = styled.div<{ open: boolean }>(
  {
    position: "fixed",
    inset: 0,
    background: alphaColor(TEXT_MAIN as `#${string}`, 0.4),
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
    background: THEME_COLOR.WHITE,
    borderRight: `1px solid ${BORDER}`,
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
  color: TEXT_MAIN
});

const SidebarItem = styled.p(sidebarItemStyle);

const SidebarButton = styled.button(buttonReset, sidebarItemStyle, {
  display: "flex",
  alignItems: "center",
  gap: px(10),
  borderRadius: px(8),
  cursor: "pointer",
  transition: "background 0.15s ease",
  "&:hover": { background: BG }
});

const SidebarNav = styled.nav({
  display: "flex",
  flexDirection: "column",
  gap: px(4),
  marginBottom: px(24),
  overflow: "hidden",
  borderRadius: px(8)
});

const SidebarNavItem = styled(Link)<{ $isActive?: boolean }>(
  sidebarItemStyle,
  {
    display: "flex",
    alignItems: "center",
    borderRadius: px(8),
    textDecoration: "none",
    color: "inherit",
    transition: "background 0.15s ease, color 0.15s ease",
    "&:hover": { background: BG }
  },
  ({ $isActive }) =>
    $isActive
      ? {
          background: ACCENT_LIGHT,
          color: ACCENT,
          fontWeight: 600
        }
      : {}
);

const SidebarDivider = styled.div({
  height: "1px",
  background: BORDER,
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

  const isActive = (href: string) => pathname === href || pathname === `${href}/`;

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
        <SidebarNav>
          <SidebarNavItem
            href="/"
            $isActive={isActive("/")}
            onClick={() => setSidebarOpen(false)}
          >
            プロンプト作成
          </SidebarNavItem>
          <SidebarNavItem
            href="/my-prompt"
            $isActive={isActive("/my-prompt")}
            onClick={() => setSidebarOpen(false)}
          >
            保存したプロンプト
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
