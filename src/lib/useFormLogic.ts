import { useState } from "react";
import { every } from "~/lib/arrayUtil";

export type FormPlot<T> = {
  id: string;
  title: string;
  required: boolean;
  getter: (c: T) => string;
  setter: (v: string) => Partial<T>;
};

function useFormLogic<T>(opts: { defaultValue: T; plot: FormPlot<T>[] }) {
  const { defaultValue, plot } = opts;
  const [current, setCurrent] = useState(defaultValue);
  function updateForm<TT extends keyof T>(key: TT, val: T[TT]) {
    return setCurrent(c => ({ ...c, [key]: val }));
  }
  const sections = plot.map(p => {
    const value = p.getter(current);
    return {
      id: p.id,
      title: p.title,
      value,
      valid: !!value,
      update: (v: string) => setCurrent(c => ({ ...c, ...p.setter(v) }))
    };
  });
  const valid = every(sections, s => s.valid);
  return { current, updateForm, sections, valid };
}

export default useFormLogic;
