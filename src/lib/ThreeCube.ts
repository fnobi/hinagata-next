import {
  Scene,
  WebGLRenderer,
  Mesh,
  PerspectiveCamera,
  BoxGeometry,
  ShaderMaterial,
  Vector2
} from "three";
import nejiVertex from "~/glsl/nejiVertex.glsl";
import flatFragment from "~/glsl/flatFragment.glsl";

type UniformObject = {
  // TODO: typing
  resolution: {
    value: Vector2;
  };
  time: {
    value: number;
  };
};

export default class ThreeCube {
  private scene: Scene;

  private camera: PerspectiveCamera;

  private cube: Mesh;

  private uniformObject: UniformObject;

  private startTime: number;

  private renderer?: WebGLRenderer;

  public constructor(defaultSize: [number, number] = [1, 1]) {
    this.scene = new Scene();

    this.camera = new PerspectiveCamera(
      75,
      defaultSize[1] / defaultSize[0],
      0.1,
      1000
    );
    this.camera.position.z = 5;

    this.startTime = Date.now();

    this.uniformObject = {
      resolution: { value: new Vector2(...defaultSize) },
      time: { value: 0.0 }
    };

    const material = new ShaderMaterial({
      uniforms: this.uniformObject,
      vertexShader: nejiVertex,
      fragmentShader: flatFragment
    });

    this.cube = new Mesh(new BoxGeometry(1, 1, 1), material);
    this.scene.add(this.cube);
  }

  public setRenderer(el: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({ canvas: el });
  }

  public setSize(w: number, h: number) {
    if (this.renderer) {
      this.renderer.setSize(w, h);
    }
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.uniformObject.resolution.value = new Vector2(w, h);
  }

  public update() {
    const elapsedMilliseconds = Date.now() - this.startTime;
    const elapsedSeconds = elapsedMilliseconds / 1000;
    this.uniformObject.time.value = 60 * elapsedSeconds;

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.cube.rotation.z += 0.01;
  }

  public render() {
    if (!this.renderer) {
      return;
    }
    this.renderer.render(this.scene, this.camera);
  }
}
