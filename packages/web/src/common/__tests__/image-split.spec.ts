import {
  clampRect,
  fitRectToAspect,
  resizeRectFromCorner,
  resizeRectFromCornerLocked,
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

  it("resizeRectFromCornerLocked keeps the target aspect and follows the larger drag axis", () => {
    const rect = { x: 20, y: 20, width: 30, height: 30 };
    expect(resizeRectFromCornerLocked(rect, "se", 20, 5, bounds, 1)).toEqual({
      x: 20,
      y: 20,
      width: 50,
      height: 50
    });
  });

  it("resizeRectFromCornerLocked clamps to bounds while keeping the aspect", () => {
    const rect = { x: 20, y: 20, width: 30, height: 30 };
    expect(
      resizeRectFromCornerLocked(rect, "se", 90, 90, bounds, 1)
    ).toEqual({ x: 20, y: 20, width: 80, height: 80 });

    const narrowBounds = { width: 200, height: 100 };
    const rect2 = { x: 0, y: 0, width: 50, height: 50 };
    expect(
      resizeRectFromCornerLocked(rect2, "se", 200, 10, narrowBounds, 1)
    ).toEqual({ x: 0, y: 0, width: 100, height: 100 });
  });

  it("fitRectToAspect inscribes the target aspect centered in the current rect", () => {
    expect(
      fitRectToAspect({ x: 10, y: 10, width: 80, height: 40 }, 1, {
        width: 200,
        height: 200
      })
    ).toEqual({ x: 30, y: 10, width: 40, height: 40 });
    expect(
      fitRectToAspect({ x: 0, y: 0, width: 30, height: 80 }, 1, {
        width: 200,
        height: 200
      })
    ).toEqual({ x: 0, y: 25, width: 30, height: 30 });
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
