import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  RawShaderMaterial,
  Vector2,
  PlaneGeometry
} from "three";
import fullScreenVertex from "~/glsl/fullScreenVertex.glsl";
import sampleFragment from "~/glsl/sampleFragment.glsl";

export default class ThreeFullScreen {
  private scene: Scene;

  private camera: PerspectiveCamera;

  private renderer: WebGLRenderer;

  private plane: Mesh;

  public constructor(el: HTMLCanvasElement) {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.scene = new Scene();

    this.camera = new PerspectiveCamera(75, w / h, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new WebGLRenderer({ canvas: el });
    this.renderer.setSize(w, h);

    const material = new RawShaderMaterial({
      uniforms: {
        resolution: { value: new Vector2(w, h) },
        time: { value: 0.0 } // TODO: どうやって更新する?
      },
      vertexShader: fullScreenVertex,
      fragmentShader: sampleFragment
    });
    this.plane = new Mesh(new PlaneGeometry(2.0, 2.0), material);
    this.scene.add(this.plane);
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }
}
