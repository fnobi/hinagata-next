import { buildLinearGradient, em, percent, px, vh, vw } from "../cssUtil";

describe("css util", () => {
  it("px helper", () => {
    expect(px(10)).toEqual("10px");
    expect(px(10, 30)).toEqual("10px 30px");
  });
  it("% helper", () => {
    expect(percent(10)).toEqual("10%");
    expect(percent(10, 30)).toEqual("10% 30%");
  });
  it("em helper", () => {
    expect(em(10)).toEqual("10em");
    expect(em(10, 30)).toEqual("10em 30em");
  });
  it("vw helper", () => {
    expect(vw(10)).toEqual("10vw");
    expect(vw(10, 30)).toEqual("10vw 30vw");
  });
  it("vh helper", () => {
    expect(vh(10)).toEqual("10vh");
    expect(vh(10, 30)).toEqual("10vh 30vh");
  });
  it("linear gradient helper", () => {
    expect(buildLinearGradient([["#000", 0]])).toEqual(
      "linear-gradient(#000 0%)"
    );
    expect(buildLinearGradient([["#000", 0]], 20)).toEqual(
      "linear-gradient(20deg,#000 0%)"
    );
    expect(
      buildLinearGradient(
        [
          ["#000", 0],
          ["#fff", 100]
        ],
        20
      )
    ).toEqual("linear-gradient(20deg,#000 0%,#fff 100%)");
  });
});
