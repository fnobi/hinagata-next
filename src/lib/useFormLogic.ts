import { useState } from "react";
import { every } from "~/lib/arrayUtil";

export type FormPlot<T> = {
  title: string;
  required: boolean;
  key: keyof T;
};

function useFormLogic<T>(opts: { defaultValue: T; plot: FormPlot<T>[] }) {
  const { defaultValue, plot } = opts;
  const [current, setCurrent] = useState(defaultValue);
  function updateForm<TT extends keyof T>(key: TT, val: T[TT]) {
    return setCurrent(c => ({ ...c, [key]: val }));
  }
  const sections = plot.map(p => ({ plot: p, valid: !!current[p.key] }));
  const valid = every(sections, s => s.valid);
  return { current, updateForm, sections, valid };
}

export default useFormLogic;
