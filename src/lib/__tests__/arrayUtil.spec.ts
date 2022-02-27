import {
  combination,
  gachaLogic,
  sum,
  sumBy,
  uniq,
  uniqBy
} from "../arrayUtil";

describe("array util: uniq, uniqBy", () => {
  it("remove duplicated", () => {
    const arr = ["a", "b", "c", "d", "b"];
    expect(uniq(arr)).toEqual(["a", "b", "c", "d"]);
  });
  it("remove duplicated with property", () => {
    const arr = [
      { id: 1, type: "a" },
      { id: 2, type: "b" },
      { id: 3, type: "c" },
      { id: 4, type: "d" },
      { id: 5, type: "b" }
    ];
    expect(uniqBy(arr, item => item.type)).toEqual([
      { id: 1, type: "a" },
      { id: 2, type: "b" },
      { id: 3, type: "c" },
      { id: 4, type: "d" }
    ]);
  });
});

describe("array util: sum, sumBy", () => {
  it("sum array values", () => {
    const arr = [1, 10, 100, 1000];
    expect(sum(arr)).toEqual(1111);
  });
  it("sum array values with property", () => {
    const arr = [{ value: 1 }, { value: 10 }, { value: 100 }, { value: 1000 }];
    expect(sumBy(arr, item => item.value)).toEqual(1111);
  });
});

describe("array util: combination", () => {
  const arr = ["a", "b", "c", "d", "e"];
  it("make 1 items array", () => {
    expect(combination(arr, 1)).toEqual([["a"], ["b"], ["c"], ["d"], ["e"]]);
  });
  it("make 2 items array", () => {
    expect(combination(arr, 2)).toEqual([
      ["a", "b"],
      ["a", "c"],
      ["a", "d"],
      ["a", "e"],
      ["b", "c"],
      ["b", "d"],
      ["b", "e"],
      ["c", "d"],
      ["c", "e"],
      ["d", "e"]
    ]);
  });
  it("make 3 items array", () => {
    expect(combination(arr, 3)).toEqual([
      ["a", "b", "c"],
      ["a", "b", "d"],
      ["a", "b", "e"],
      ["a", "c", "d"],
      ["a", "c", "e"],
      ["a", "d", "e"],
      ["b", "c", "d"],
      ["b", "c", "e"],
      ["b", "d", "e"],
      ["c", "d", "e"]
    ]);
  });
  it("make 4 items array", () => {
    expect(combination(arr, 4)).toEqual([
      ["a", "b", "c", "d"],
      ["a", "b", "c", "e"],
      ["a", "b", "d", "e"],
      ["a", "c", "d", "e"],
      ["b", "c", "d", "e"]
    ]);
  });
  it("make 5 items array", () => {
    expect(combination(arr, 5)).toEqual([["a", "b", "c", "d", "e"]]);
  });
});

describe("gachaLogic", () => {
  const master = [
    // 0 <= seed < 0.1
    { rate: 1, item: { id: "a" } },
    // 0.1 <= seed < 0.3
    { rate: 2, item: { id: "b" } },
    // 0.3 <= seed < 0.6
    { rate: 3, item: { id: "c" } },
    // 0.6 <= seed < 1
    { rate: 4, item: { id: "d" } }
  ];
  const master2 = [...master, { rate: 10, item: { id: "e" } }];
  it("hit pattern a", () => {
    expect(gachaLogic(master, 0)).toEqual({ id: "a" });
    expect(gachaLogic(master2, 0)).toEqual({ id: "a" });
  });
  it("hit pattern b", () => {
    expect(gachaLogic(master, 0.1)).toEqual({ id: "b" });
    expect(gachaLogic(master2, 0.05)).toEqual({ id: "b" });
  });
  it("hit pattern c", () => {
    expect(gachaLogic(master, 0.3)).toEqual({ id: "c" });
    expect(gachaLogic(master2, 0.15)).toEqual({ id: "c" });
  });
  it("hit pattern d", () => {
    expect(gachaLogic(master, 0.6)).toEqual({ id: "d" });
    expect(gachaLogic(master2, 0.3)).toEqual({ id: "d" });
  });
  it("hit pattern e", () => {
    expect(gachaLogic(master2, 0.5)).toEqual({ id: "e" });
  });
});
