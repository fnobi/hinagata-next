import React, { useState, useEffect } from "react";
import TypeRegi from "./TypeRegi";

export function connectStore<State, PropsFromStore, Props>(
  store: TypeRegi<State, unknown>,
  reduce: (state: State) => PropsFromStore,
  Cmp: React.FunctionComponent<Props & PropsFromStore>
) {
  return (props => {
    const [state, setState] = useState(store.getState());
    useEffect(() => store.subscribe(setState), [state]);
    const merged = {
      ...reduce(state),
      ...props
    };
    return <Cmp {...merged} />;
  }) as React.FunctionComponent<Props>;
}

export function connectStoreAll<State, Props>(
  store: TypeRegi<State, unknown>,
  Cmp: React.FunctionComponent<Props & State>
) {
  return connectStore<State, State, Props>(store, (state: State) => state, Cmp);
}
