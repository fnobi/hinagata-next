import { useState } from "react";

function useFormLogic<T>(opts: { defaultValue: T }) {
  const { defaultValue } = opts;
  const [current, setCurrent] = useState(defaultValue);
  return { current, setCurrent };
}

export default useFormLogic;
