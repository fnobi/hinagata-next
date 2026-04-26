"use client";

import { Global, css } from "@emotion/react";
import emotionReset from "emotion-reset";
import { type ReactNode } from "react";
import { globalStyle } from "~/features/lib/emotion-mixin";

const EmotionProvider = ({ children }: { children: ReactNode }) => (
  <>
    <Global styles={css(emotionReset, globalStyle)} />
    {children}
  </>
);

export default EmotionProvider;
