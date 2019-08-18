import React, { useState, useEffect } from "react";
import TypeRegi from "./TypeRegi";

export function hoge() {}

export function connectStore<T, S, A>(
  store: TypeRegi<S, A>,
  Cmp: (props: T & S) => JSX.Element
) {
  return (props: T) => {
    const [state, setState] = useState(store.getState());
    useEffect(() => store.subscribe(setState), []);
    const merged = { ...state, ...props };
    return <Cmp {...merged} />;
  };
}
