import React, { useState, useEffect } from "react";
import TypeRegi from "./TypeRegi";

export function connectStore<State, PropsFromStore, Props>(
  store: TypeRegi<State, unknown>,
  reduce: (state: State) => PropsFromStore,
  Cmp: (props: Props & PropsFromStore) => JSX.Element
) {
  return (props: Props) => {
    const [state, setState] = useState(store.getState());
    useEffect(() => store.subscribe(setState), [state]);
    const merged = {
      ...reduce(state),
      ...props
    };
    return <Cmp {...merged} />;
  };
}

export function connectStoreAll<State, Props>(
  store: TypeRegi<State, unknown>,
  Cmp: (props: Props & State) => JSX.Element
) {
  return connectStore<State, State, Props>(store, (state: State) => state, Cmp);
}
