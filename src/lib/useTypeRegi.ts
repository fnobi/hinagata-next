import TypeRegi from "type-regi";
import { useState, useEffect } from "react";

export function useTypeRegiReducer<State, Reduced>(
  store: TypeRegi<State, unknown>,
  reduce: (state: State) => Reduced
) {
  const [state, setState] = useState(reduce(store.getState()));
  useEffect(() => store.subscribe(s => setState(reduce(s))), []);
  return state;
}

export function useTypeRegi<State>(store: TypeRegi<State, unknown>) {
  return useTypeRegiReducer(store, (s: State) => s);
}
