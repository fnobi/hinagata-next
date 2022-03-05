import { useState } from "react";
import { every } from "~/lib/arrayUtil";

export type FormPlot<T> = {
  id: string;
  title: string;
  required?: boolean;
  getter: (c: T) => string;
  setter: (v: string) => Partial<T>;
};

function useFormLogic<T>(opts: { defaultValue: T; plot: FormPlot<T>[] }) {
  const { defaultValue, plot } = opts;
  const [current, setCurrent] = useState(defaultValue);
  const sections = plot.map(
    ({ id, title, required = true, getter, setter }) => {
      const value = getter(current);
      return {
        id,
        title,
        value,
        valid: required ? !!value : true,
        update: (v: string) => setCurrent(c => ({ ...c, ...setter(v) }))
      };
    }
  );
  const valid = every(sections, s => s.valid);
  return { current, sections, valid };
}

export default useFormLogic;
