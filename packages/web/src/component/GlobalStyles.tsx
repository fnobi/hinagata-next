"use client";

import { Global, css } from "@emotion/react";
import emotionReset from "emotion-reset";
import { globalStyle } from "~/feature/emotion-mixin";

const GlobalStyles = () => <Global styles={css(emotionReset, globalStyle)} />;

export default GlobalStyles;
