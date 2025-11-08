import { PerspectiveCamera, Scene, type WebGLRenderer } from "three";

abstract class AbstractThreeController {
  private aspect: number = 1;

  protected readonly scene: Scene;

  protected readonly camera: PerspectiveCamera;

  public constructor() {
    const scene = new Scene();
    const camera = new PerspectiveCamera();
    this.scene = scene;
    this.camera = camera;
  }

  public abstract update(t: number): void;

  public setSize(w: number, h: number): void {
    this.aspect = w / h;
    this.applyCameraAspect();
  }

  public applyCameraAspect() {
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
  }

  public renderWith(r: WebGLRenderer) {
    r.render(this.scene, this.camera);
  }
}

export default AbstractThreeController;
