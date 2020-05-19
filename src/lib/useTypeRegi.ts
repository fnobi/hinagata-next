import TypeRegi from "type-regi";
import { useState, useEffect } from "react";

export default function useTypeRegi<State>(store: TypeRegi<State, unknown>) {
  const [s, setS] = useState(store.getState());
  useEffect(() => store.subscribe(setS), []);
  return s;
}
