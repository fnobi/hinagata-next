import { useState, useEffect } from "react";
import TypeRegi from "./TypeRegi";

/* eslint react-hooks/rules-of-hooks: 0 */

export function hoge() {}

export function connectToHooks<S, A>(sampleStore: TypeRegi<S, A>) {
  const [sampleState, setSampleState] = useState(sampleStore.getState());
  useEffect(() => sampleStore.subscribe(setSampleState), []);
  return sampleState;
}
