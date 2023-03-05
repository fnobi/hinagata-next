import { atom, useRecoilState } from "recoil";

type SampleState = {
  count: number;
};

const initialSampleState: SampleState = {
  count: 0
};

const sampleStore = atom<SampleState>({
  key: "sampleStore",
  default: initialSampleState
});

const useSampleCounter = (): [number, () => void] => {
  const [sample, setSample] = useRecoilState(sampleStore);
  const { count } = sample;
  const increment = () => {
    setSample(s => ({
      ...s,
      count: count + 1
    }));
  };
  return [count, increment];
};

export default useSampleCounter;
