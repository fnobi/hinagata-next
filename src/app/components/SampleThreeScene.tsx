import styled from "@emotion/styled";
import {
  type ComponentPropsWithoutRef,
  useCallback,
  useEffect,
  useState
} from "react";
import { Color, Vector3 } from "three";
import { em, percent, px } from "~/common/lib/css-util";
import useThreeRenderer from "~/common/lib/useThreeRenderer";
import MockActionButton from "~/common/components/MockActionButton";
import { parseNumber } from "~/common/lib/parser-helper";
import SampleThreeController from "~/app/lib/SampleThreeController";

const Wrapper = styled.div({
  position: "fixed",
  left: 0,
  top: 0,
  width: percent(100),
  height: percent(100),
  display: "grid",
  gridTemplateColumns: px(250, "auto")
});

const Container = styled.div({
  position: "relative",
  canvas: {
    position: "absolute",
    display: "block",
    left: 0,
    top: 0,
    width: percent(100),
    height: percent(100)
  }
});

const Sidebar = styled.div({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "stretch",
  flexDirection: "column",
  gap: em(1),
  padding: em(1)
});

const PropRow = styled.div({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: em(0.5),
  hr: {
    flexGrow: 1
  }
});

const NumFormRow = ({
  label,
  value,
  min,
  step,
  onChange
}: {
  label: string;
  value: number;
  min?: number;
  step?: number;
  onChange: (v: number) => void;
}) => (
  <PropRow>
    <p>{label}</p>
    <hr />
    <input
      type="number"
      value={value}
      min={min}
      step={step}
      style={{ width: em(3) }}
      onChange={e => onChange(parseNumber(e.target.value))}
    />
  </PropRow>
);

const IntensityFormRow = (
  props: ComponentPropsWithoutRef<typeof NumFormRow>
  // eslint-disable-next-line react/jsx-props-no-spreading
) => <NumFormRow {...props} min={0} step={0.1} />;

const SampleThreeScene = () => {
  const [modelIndex, setModelIndex] = useState(0);
  const [controlsFlag, setControlsFlag] = useState(true);
  const { controllerRef, containerRef } =
    useThreeRenderer<SampleThreeController>();
  const [ambientLight, setAmbientLight] = useState<{
    color: string;
    intensity: number;
  }>({
    color: "#ffffff",
    intensity: 1
  });
  const [directionalLight, setDirectionalLight] = useState<{
    color: string;
    intensity: number;
    x: number;
    y: number;
    z: number;
  }>({
    color: "#ffffff",
    intensity: 1,
    x: 0,
    y: 5,
    z: 0
  });

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

  useEffect(() => {
    const { current: controller } = controllerRef;
    if (!controller) {
      return () => {};
    }
    return controller.setAmibentLightProperties({
      color: new Color(ambientLight.color),
      intensity: ambientLight.intensity
    });
  }, [ambientLight.color, ambientLight.intensity, controllerRef]);

  useEffect(() => {
    const { current: controller } = controllerRef;
    if (!controller) {
      return () => {};
    }
    return controller.setDirectionalLightProperties({
      color: new Color(directionalLight.color),
      intensity: directionalLight.intensity,
      position: new Vector3(
        directionalLight.x,
        directionalLight.y,
        directionalLight.z
      )
    });
  }, [
    directionalLight.color,
    directionalLight.intensity,
    controllerRef,
    directionalLight.x,
    directionalLight.y,
    directionalLight.z
  ]);

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
      <Sidebar>
        <p>
          <MockActionButton
            action={{ type: "button", onClick: () => setControlsFlag(f => !f) }}
          >
            controls:&nbsp;{controlsFlag ? "ON" : "OFF"}
          </MockActionButton>
        </p>
        <p>
          <MockActionButton action={{ type: "button", onClick: handleClick }}>
            model:&nbsp;{modelIndex + 1}
          </MockActionButton>
        </p>
        <div>
          <h3>ambient light</h3>
          <PropRow>
            <p>color</p>
            <hr />
            <input
              type="color"
              value={ambientLight.color}
              onChange={e =>
                setAmbientLight(o => ({ ...o, color: e.target.value }))
              }
            />
          </PropRow>
          <IntensityFormRow
            label="intensity"
            value={ambientLight.intensity}
            onChange={v => setAmbientLight(o => ({ ...o, intensity: v }))}
          />
        </div>
        <div>
          <h3>directional light</h3>
          <PropRow>
            <p>color</p>
            <hr />
            <input
              type="color"
              value={directionalLight.color}
              onChange={e =>
                setDirectionalLight(o => ({ ...o, color: e.target.value }))
              }
            />
          </PropRow>
          <IntensityFormRow
            label="intensity"
            value={directionalLight.intensity}
            onChange={v => setDirectionalLight(o => ({ ...o, intensity: v }))}
          />
          <NumFormRow
            label="x"
            value={directionalLight.x}
            onChange={v => setDirectionalLight(o => ({ ...o, x: v }))}
          />
          <NumFormRow
            label="y"
            value={directionalLight.y}
            onChange={v => setDirectionalLight(o => ({ ...o, y: v }))}
          />
          <NumFormRow
            label="z"
            value={directionalLight.z}
            onChange={v => setDirectionalLight(o => ({ ...o, z: v }))}
          />
        </div>
      </Sidebar>
      <Container ref={containerRef} />
    </Wrapper>
  );
};

export default SampleThreeScene;
