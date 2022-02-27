import { uniq, uniqBy } from "../arrayUtil";

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
