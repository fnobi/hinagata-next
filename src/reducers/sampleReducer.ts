const INCREMENT_COUNTER = "INCREMENT_COUNTER";

type Action<T> = {
  type: T;
};

type ActionWithPayload<P, T> = Action<T> & {
  payload: {
    [K in keyof P]: P[K];
  };
};

type IncrementCounter = ActionWithPayload<
  { count: number },
  typeof INCREMENT_COUNTER
>;

type SampleAction = IncrementCounter;

export type SampleState = {
  count: number;
};

export const incrementCounter = (count: number): IncrementCounter => {
  return {
    type: INCREMENT_COUNTER,
    payload: {
      count
    }
  };
};

const defaultState: SampleState = {
  count: 0
};

export default (state: SampleState = defaultState, action: SampleAction) => {
  switch (action.type) {
    case INCREMENT_COUNTER: {
      return {
        ...state,
        count: action.payload.count
      };
    }
    default:
      return {
        ...state
      };
  }
};
