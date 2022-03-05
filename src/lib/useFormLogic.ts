import { useState } from "react";
import { every } from "~/lib/arrayUtil";

export type FormPlot<T> = {
  id: string;
  title: string;
  required?: boolean;
  getter: (c: T) => string;
  setter: (v: string) => Partial<T>;
  options?: string[];
  validator?: (v: string) => string | null;
};

function useFormLogic<T>(opts: { defaultValue: T; plot: FormPlot<T>[] }) {
  const { defaultValue, plot } = opts;
  const [current, setCurrent] = useState(defaultValue);
  const sections = plot.map(
    ({ id, title, required = true, options, validator, getter, setter }) => {
      const value = getter(current);
      const error = validator ? validator(value) : null;
      const valid = (() => {
        if (error) {
          return false;
        }
        if (required && !value) {
          return false;
        }
        return true;
      })();
      const update = (v: string) => setCurrent(c => ({ ...c, ...setter(v) }));

      return {
        id,
        title,
        value,
        required,
        options,
        error,
        valid,
        update
      };
    }
  );
  const valid = every(sections, s => s.valid);
  return { current, sections, valid };
}

export const emailValidator = (v: string) => {
  if (!v) {
    return null;
  }
  if (
    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(
      v
    )
  ) {
    return null;
  }
  return "不正なメールアドレスです";
};

export default useFormLogic;
