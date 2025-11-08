import styled from "@emotion/styled";
import { useCallback, useEffect, useState } from "react";
import { em, percent } from "~/common/lib/css-util";
import useThreeRenderer from "~/common/lib/useThreeRenderer";
import MockActionButton from "~/common/components/MockActionButton";
import { THEME_COLOR } from "~/app/lib/emotion-mixin";
import SampleThreeController from "~/app/lib/SampleThreeController";

const Wrapper = styled.div({
  position: "fixed",
  left: 0,
  top: 0,
  width: percent(100),
  height: percent(100)
});

const Container = styled.div({
  position: "absolute",
  left: 0,
  top: 0,
  width: percent(100),
  height: percent(100),
  canvas: {
    position: "absolute",
    display: "block",
    left: 0,
    top: 0,
    width: percent(100),
    height: percent(100)
  }
});

const Footer = styled.div({
  position: "absolute",
  right: em(1),
  bottom: em(1),
  padding: em(0.5),
  backgroundColor: THEME_COLOR.WHITE
});

const EditorScene = () => {
  const [modelIndex, setModelIndex] = useState(0);
  const [controlsFlag, setControlsFlag] = useState(true);
  const { controllerRef, containerRef } =
    useThreeRenderer<SampleThreeController>();

  useEffect(() => {
    const controller = new SampleThreeController();
    controllerRef.current = controller;
    return () => {
      controllerRef.current = null;
    };
  }, [controllerRef]);

  useEffect(() => {
    const { current: container } = containerRef;
    const { current: controller } = controllerRef;
    if (!controlsFlag || !container || !controller) {
      return () => {};
    }
    return controller.activateOrbitControls(container);
  }, [containerRef, controllerRef, controlsFlag]);

  const handleClick = useCallback(() => {
    const { current: controller } = controllerRef;
    if (!controller) {
      return;
    }
    const i = controller.toggleModel();
    setModelIndex(i);
  }, [controllerRef]);

  return (
    <Wrapper>
      <Container ref={containerRef} />
      <Footer>
        <MockActionButton
          action={{ type: "button", onClick: () => setControlsFlag(f => !f) }}
        >
          controls:&nbsp;{controlsFlag ? "ON" : "OFF"}
        </MockActionButton>
        ・
        <MockActionButton action={{ type: "button", onClick: handleClick }}>
          model:&nbsp;{modelIndex + 1}
        </MockActionButton>
      </Footer>
    </Wrapper>
  );
};

export default EditorScene;
