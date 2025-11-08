import { PerspectiveCamera, Scene, type WebGLRenderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

abstract class AbstractThreeController {
  private aspect: number = 1;

  protected readonly scene: Scene;

  protected readonly camera: PerspectiveCamera;

  protected orbitControls: OrbitControls | null = null;

  public constructor() {
    const scene = new Scene();
    const camera = new PerspectiveCamera();
    this.scene = scene;
    this.camera = camera;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(t: number) {
    if (this.orbitControls) {
      this.orbitControls.update();
    }
  }

  public setSize(w: number, h: number): void {
    this.aspect = w / h;
    this.resize();
  }

  public resize() {
    this.camera.aspect = this.aspect;
    this.camera.updateProjectionMatrix();
  }

  public renderWith(r: WebGLRenderer) {
    r.render(this.scene, this.camera);
  }

  public activateOrbitControls(el: HTMLElement) {
    const o = new OrbitControls(this.camera, el);
    o.update();
    this.orbitControls = o;
    return () => {
      o.reset();
      o.disconnect();
      this.orbitControls = null;
    };
  }
}

export default AbstractThreeController;
