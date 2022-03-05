import { useState } from "react";

function useFormLogic<T>(opts: { defaultValue: T }) {
  const { defaultValue } = opts;
  const [current, setCurrent] = useState(defaultValue);
  function updateForm<TT extends keyof T>(key: TT, val: T[TT]) {
    return setCurrent(c => ({ ...c, [key]: val }));
  }
  return { current, updateForm };
}

export default useFormLogic;
