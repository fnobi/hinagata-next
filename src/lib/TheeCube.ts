import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh
} from "three";

export default class ThreeCube {
  private scene: Scene;

  private camera: PerspectiveCamera;

  private renderer: WebGLRenderer;

  private cube: Mesh;

  public constructor(el: HTMLCanvasElement) {
    const w = window.innerWidth;
    const h = window.innerHeight;

    this.scene = new Scene();

    this.camera = new PerspectiveCamera(75, w / h, 0.1, 1000);
    this.camera.position.z = 5;

    this.renderer = new WebGLRenderer({ canvas: el });
    this.renderer.setSize(w, h);

    const geometry = new BoxGeometry(1, 1, 1);
    const material = new MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  public update() {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.cube.rotation.z += 0.01;
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }
}
