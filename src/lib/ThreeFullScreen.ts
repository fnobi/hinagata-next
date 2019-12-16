import {
  Scene,
  WebGLRenderer,
  Mesh,
  RawShaderMaterial,
  Vector2,
  PlaneGeometry,
  OrthographicCamera
} from "three";
import fullScreenVertex from "~/glsl/fullScreenVertex.glsl";
import sampleFragment from "~/glsl/sampleFragment.glsl";

type UniformObject = {
  // TODO: typing
  resolution: {
    value: Vector2;
  };
  time: {
    value: number;
  };
};

function calcCameraArea(
  width: number,
  height: number
): [number, number, number, number] {
  return [-width / 2, width / 2, -height / 2, height / 2];
}

export default class ThreeFullScreen {
  private scene: Scene;

  private camera: OrthographicCamera;

  private plane: Mesh;

  private uniformObject: UniformObject;

  private startTime: number;

  private renderer?: WebGLRenderer;

  public constructor(defaultSize: [number, number] = [1, 1]) {
    this.scene = new Scene();

    this.camera = new OrthographicCamera(...calcCameraArea(...defaultSize));

    this.startTime = Date.now();

    this.uniformObject = {
      resolution: { value: new Vector2(...defaultSize) },
      time: { value: 0.0 }
    };

    const material = new RawShaderMaterial({
      uniforms: this.uniformObject,
      vertexShader: fullScreenVertex,
      fragmentShader: sampleFragment
    });
    this.plane = new Mesh(new PlaneGeometry(2.0, 2.0), material);
    this.scene.add(this.plane);
  }

  public setRenderer(el: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({ canvas: el });
  }

  public setSize(w: number, h: number) {
    if (this.renderer) {
      this.renderer.setSize(w, h);
    }
    [
      this.camera.left,
      this.camera.right,
      this.camera.top,
      this.camera.bottom
    ] = calcCameraArea(w, h);
    this.uniformObject.resolution.value = new Vector2(w, h);
  }

  public update() {
    const elapsedMilliseconds = Date.now() - this.startTime;
    const elapsedSeconds = elapsedMilliseconds / 1000;
    this.uniformObject.time.value = 60 * elapsedSeconds;
  }

  public render() {
    if (!this.renderer) {
      return;
    }
    this.renderer.render(this.scene, this.camera);
  }
}
