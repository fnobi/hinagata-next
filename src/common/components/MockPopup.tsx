import styled from "@emotion/styled";
import { type ComponentPropsWithoutRef } from "react";
import { em, PRIMITIVE_COLOR } from "~/common/lib/css-util";
import PopupBase from "~/common/components/PopupBase";

const PopupBody = styled.div({
  backgroundColor: PRIMITIVE_COLOR.WHITE,
  padding: em(1),
  textAlign: "center"
});

const MockPopup = ({
  children,
  ...props
}: ComponentPropsWithoutRef<typeof PopupBase>) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <PopupBase {...props}>
    <PopupBody>{children}</PopupBody>
  </PopupBase>
);

export default MockPopup;
