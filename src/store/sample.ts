import TypeRegi from "~/lib/TypeRegi";

export type SampleState = {
  mouse: [number, number];
};

interface SampleActions {
  setMouse: {
    x: number;
    y: number;
  };
}

export const initialSampleState = {
  mouse: [0, 0] as [number, number]
};

const sampleActions = {
  setMouse: (
    state: SampleState,
    payload: { x: number; y: number }
  ): SampleState => {
    const { x, y } = payload;
    return {
      ...state,
      mouse: [x, y]
    };
  }
};

export default new TypeRegi<SampleState, SampleActions>(
  initialSampleState,
  sampleActions
);
