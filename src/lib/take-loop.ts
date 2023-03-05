import { useEffect, useState } from "react";

export const takeLoop = (fn: (time: number) => void) => {
  const startTime = Date.now();
  let t = -1;
  const handler = () => {
    t = window.requestAnimationFrame(handler);
    fn(Date.now() - startTime);
  };
  t = window.requestAnimationFrame(handler);
  return () => window.cancelAnimationFrame(t);
};

export const usePeriodLoop = (period: number, flag: boolean = true) => {
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (!flag) {
      setTime(0);
      return () => {};
    }
    return takeLoop(setTime);
  }, [flag]);
  return (time % period) / period;
};
