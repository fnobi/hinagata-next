import { clampPeriod } from "~/lib/math-util";

describe("math util: clamp period", () => {
  it("plus arguments", () => {
    expect(clampPeriod(0, 5, 0)).toEqual(0);
    expect(clampPeriod(0, 5, 1)).toEqual(1);
    expect(clampPeriod(0, 5, 2)).toEqual(2);
    expect(clampPeriod(0, 5, 3)).toEqual(3);
    expect(clampPeriod(0, 5, 4)).toEqual(4);
    expect(clampPeriod(0, 5, 5)).toEqual(0);
    expect(clampPeriod(0, 5, 6)).toEqual(1);
    expect(clampPeriod(0, 5, 7)).toEqual(2);
    expect(clampPeriod(0, 5, 8)).toEqual(3);
    expect(clampPeriod(0, 5, 9)).toEqual(4);

    expect(clampPeriod(1, 6, 0)).toEqual(5);
    expect(clampPeriod(1, 6, 1)).toEqual(1);
    expect(clampPeriod(1, 6, 2)).toEqual(2);
    expect(clampPeriod(1, 6, 3)).toEqual(3);
    expect(clampPeriod(1, 6, 4)).toEqual(4);
    expect(clampPeriod(1, 6, 5)).toEqual(5);
    expect(clampPeriod(1, 6, 6)).toEqual(1);
    expect(clampPeriod(1, 6, 7)).toEqual(2);
    expect(clampPeriod(1, 6, 8)).toEqual(3);
    expect(clampPeriod(1, 6, 9)).toEqual(4);
  });
  it("minus arguments", () => {
    expect(clampPeriod(0, 5, 0)).toEqual(0);
    expect(clampPeriod(0, 5, -1)).toEqual(4);
    expect(clampPeriod(0, 5, -2)).toEqual(3);
    expect(clampPeriod(0, 5, -3)).toEqual(2);
    expect(clampPeriod(0, 5, -4)).toEqual(1);
    expect(clampPeriod(0, 5, -5)).toEqual(0);
    expect(clampPeriod(0, 5, -6)).toEqual(4);
    expect(clampPeriod(0, 5, -7)).toEqual(3);
    expect(clampPeriod(0, 5, -8)).toEqual(2);
    expect(clampPeriod(0, 5, -9)).toEqual(1);
  });
});
