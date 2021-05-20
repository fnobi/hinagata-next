import { Application, Graphics, Container } from "pixi.js";
import { CanvasPlayer } from "~/lib/useCanvasAgent";

const RECT_SIZE = 100;

export default class SamplePixiPlayer implements CanvasPlayer {
  public readonly canvas: HTMLCanvasElement;

  private app: Application;

  private graphics: Graphics;

  private angle = 0;

  public constructor() {
    const app = new Application({
      backgroundAlpha: 0,
      resolution: window.devicePixelRatio
    });

    const container = new Container();
    app.stage.addChild(container);

    const graphics = new Graphics();
    graphics.beginFill(0x000000);
    graphics.drawRect(-RECT_SIZE / 2, -RECT_SIZE / 2, RECT_SIZE, RECT_SIZE);
    graphics.endFill();
    container.addChild(graphics);

    this.app = app;
    this.graphics = graphics;
    this.canvas = app.view;

    this.resize();
  }

  private render() {
    this.graphics.transform.rotation = (this.angle / 180) * Math.PI;
  }

  public update(delta: number) {
    this.angle += delta * 0.1;
    this.render();
  }

  public resize() {
    const w = this.app.view.offsetWidth;
    const h = this.app.view.offsetHeight;
    this.app.renderer.resize(w, h);
    this.graphics.position.set(w / 2, h / 2);
  }

  public dispose() {
    this.app.destroy();
  }
}
