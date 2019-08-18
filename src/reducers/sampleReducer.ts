enum ActionType {
  SET_COUNTER
}

type Action<T> = {
  type: T;
};

type ActionWithPayload<P, T> = Action<T> & {
  payload: {
    [K in keyof P]: P[K];
  };
};

type SetCounter = ActionWithPayload<{ count: number }, ActionType.SET_COUNTER>;

type SampleAction = SetCounter;

export type SampleState = {
  count: number;
};

export const setCounter = (count: number): SetCounter => {
  return {
    type: ActionType.SET_COUNTER,
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
    case ActionType.SET_COUNTER: {
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
