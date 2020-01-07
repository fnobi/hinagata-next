import TypeRegi from "type-regi";

export type SampleState = {
  count: number;
};

interface SampleActions {
  incrementCounter: {
    value: number;
  };
}

export const initialSampleState: SampleState = {
  count: 0
};

const sampleActions = {
  incrementCounter: (
    state: SampleState,
    payload: { value: number }
  ): SampleState => {
    const { value } = payload;
    return {
      ...state,
      count: state.count + value
    };
  }
};

export default new TypeRegi<SampleState, SampleActions>(
  initialSampleState,
  sampleActions
);
