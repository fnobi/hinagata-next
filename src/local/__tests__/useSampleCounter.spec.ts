import { renderHook, act } from "@testing-library/react-hooks";
import { RecoilRoot } from "recoil";
import useSampleCounter from "../useSampleCounter";

describe("useSampleCounter", () => {
  it("set default value as 0", () => {
    const { result } = renderHook(() => useSampleCounter(), {
      wrapper: RecoilRoot
    });
    const [count] = result.current;
    expect(count).toEqual(0);
  });
  it("increment by 1", () => {
    const { result } = renderHook(() => useSampleCounter(), {
      wrapper: RecoilRoot
    });
    const [, increment] = result.current;
    act(() => {
      increment();
    });
    const [count] = result.current;
    expect(count).toEqual(1);
  });
});
