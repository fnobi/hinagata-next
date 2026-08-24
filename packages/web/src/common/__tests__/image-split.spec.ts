import {
  clampRect,
  moveRect,
  resizeRectFromCorner,
  splitRectIntoColumns
} from "~/common/image-split";

describe("image-split", () => {
  const bounds = { width: 100, height: 200 };

  it("clampRect keeps a rect fully inside the bounds", () => {
    expect(clampRect({ x: -10, y: -10, width: 50, height: 50 }, bounds)).toEqual({
      x: 0,
      y: 0,
      width: 50,
      height: 50
    });
    expect(
      clampRect({ x: 80, y: 190, width: 50, height: 50 }, bounds)
    ).toEqual({ x: 50, y: 150, width: 50, height: 50 });
    expect(
      clampRect({ x: 0, y: 0, width: 1000, height: 1000 }, bounds)
    ).toEqual({ x: 0, y: 0, width: 100, height: 200 });
  });

  it("moveRect translates and clamps within bounds", () => {
    const rect = { x: 10, y: 10, width: 20, height: 20 };
    expect(moveRect(rect, 5, 5, bounds)).toEqual({
      x: 15,
      y: 15,
      width: 20,
      height: 20
    });
    expect(moveRect(rect, -50, -50, bounds)).toEqual({
      x: 0,
      y: 0,
      width: 20,
      height: 20
    });
  });

  it("resizeRectFromCorner grows/shrinks from the dragged corner", () => {
    const rect = { x: 20, y: 20, width: 30, height: 30 };
    expect(resizeRectFromCorner(rect, "se", 10, 10, bounds)).toEqual({
      x: 20,
      y: 20,
      width: 40,
      height: 40
    });
    expect(resizeRectFromCorner(rect, "nw", -10, -10, bounds)).toEqual({
      x: 10,
      y: 10,
      width: 40,
      height: 40
    });
  });

  it("resizeRectFromCorner respects minSize", () => {
    const rect = { x: 20, y: 20, width: 30, height: 30 };
    const next = resizeRectFromCorner(rect, "se", -100, -100, bounds, 20);
    expect(next.width).toBe(20);
    expect(next.height).toBe(20);
  });

  it("splitRectIntoColumns divides width evenly and gives the remainder to the last column", () => {
    expect(
      splitRectIntoColumns({ x: 0, y: 0, width: 90, height: 60 }, 3)
    ).toEqual([
      { x: 0, y: 0, width: 30, height: 60 },
      { x: 30, y: 0, width: 30, height: 60 },
      { x: 60, y: 0, width: 30, height: 60 }
    ]);
    expect(
      splitRectIntoColumns({ x: 5, y: 0, width: 100, height: 60 }, 3)
    ).toEqual([
      { x: 5, y: 0, width: 33, height: 60 },
      { x: 38, y: 0, width: 33, height: 60 },
      { x: 71, y: 0, width: 34, height: 60 }
    ]);
  });
});
