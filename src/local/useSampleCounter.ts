import { atom, useRecoilState } from "recoil";

export type SampleState = {
  count: number;
};

export const initialSampleState: SampleState = {
  count: 0
};

export const sampleStore = atom<SampleState>({
  key: "sampleStore",
  default: initialSampleState
});

const useSampleCounter = (): [number, () => void] => {
  const [sample, setSample] = useRecoilState(sampleStore);
  const { count } = sample;
  const increment = () => {
    setSample({
      ...sample,
      count: count + 1
    });
  };
  return [count, increment];
};

export default useSampleCounter;
