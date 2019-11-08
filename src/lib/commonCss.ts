import { css } from "@emotion/core";

export const globalStyle = css({
  body: {
    fontFamily: "sans-serif",
    fontSize: 16,
    lineHeight: 1.5,
    textSizeAdjust: "100%"
  }
});

export const linkReset = css({
  display: "inline-block",
  textDecoration: "none",
  color: "inherit"
});

export const buttonReset = css({
  padding: 0,
  margin: 0,
  appearance: "none",
  border: "none",
  background: "none"
});

export class TransformBuilder {
  private readonly queue: string[];

  public constructor(queue: string[] = []) {
    this.queue = queue;
  }

  private addOperation(fn: string, val: string) {
    return new TransformBuilder([...this.queue, `${fn}(${val})`]);
  }

  private addOperationNumbers(fn: string, nums: number[], unit: string = "") {
    return this.addOperation(fn, nums.map(n => `${n}${unit}`).join(","));
  }

  // matrix(数値, 数値, 数値, 数値, 数値, 数値)
  // matrix3d(数値, 数値, 数値, 数値, 数値, 数値, 数値, 数値, 数値, 数値, 数値, 数値, 数値, 数値, 数値, 数値)

  public scale(x: number, y: number) {
    return this.addOperationNumbers("scale", [x, y]);
  }

  public scaleX(x: number) {
    return this.addOperationNumbers("scaleX", [x]);
  }

  public scaleY(y: number) {
    return this.addOperationNumbers("scaleY", [y]);
  }

  public scaleZ(z: number) {
    return this.addOperationNumbers("scaleZ", [z]);
  }

  public scale3d(x: number, y: number, z: number) {
    return this.addOperationNumbers("scale3d", [x, y, z]);
  }

  public translate(x: number, y: number) {
    return this.addOperationNumbers("translate", [x, y], "px");
  }

  public translateX(num: number) {
    return this.addOperationNumbers("translateX", [num], "px");
  }

  public translateY(num: number) {
    return this.addOperationNumbers("translateY", [num], "px");
  }

  public translateZ(num: number) {
    return this.addOperationNumbers("translateZ", [num], "px");
  }

  public translate3d(x: number, y: number, z: number) {
    return this.addOperationNumbers("translate3d", [x, y, z], "px");
  }

  public rotate(num: number) {
    return this.addOperationNumbers("rotate", [num], "deg");
  }

  public rotate3d(x: number, y: number, z: number, deg: number) {
    return this.addOperation("rotate3d", [x, y, z, `${deg}deg`].join(","));
  }

  public rotateX(num: number) {
    return this.addOperationNumbers("rotateX", [num], "deg");
  }

  public rotateY(num: number) {
    return this.addOperationNumbers("rotateY", [num], "deg");
  }

  public rotateZ(num: number) {
    return this.addOperationNumbers("rotateZ", [num], "deg");
  }

  public skew(x: number, y: number) {
    return this.addOperationNumbers("skew", [x, y], "deg");
  }

  public skewX(num: number) {
    return this.addOperationNumbers("skewX", [num], "deg");
  }

  public skewY(num: number) {
    return this.addOperationNumbers("skewY", [num], "deg");
  }

  public perspective(num: number) {
    return this.addOperationNumbers("perspective", [num]);
  }

  public toString() {
    return this.queue.length ? this.queue.join(" ") : "none";
  }
}
