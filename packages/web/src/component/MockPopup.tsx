"use client";

import styled from "@emotion/styled";
import { type ComponentPropsWithoutRef } from "react";
import { em, PRIMITIVE_COLOR } from "~/common/css-util";
import PopupBase from "~/component/PopupBase";

const PopupBody = styled.div({
  backgroundColor: PRIMITIVE_COLOR.WHITE,
  color: PRIMITIVE_COLOR.BLACK,
  padding: em(1),
  textAlign: "center"
});

const MockPopup = ({
  children,
  ...props
}: ComponentPropsWithoutRef<typeof PopupBase>) => (
  <PopupBase {...props}>
    <PopupBody>{children}</PopupBody>
  </PopupBase>
);

export default MockPopup;
