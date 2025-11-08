import {
  BoxGeometry,
  Mesh,
  MeshNormalMaterial,
  TetrahedronGeometry,
  TorusGeometry
} from "three";
import AbstractThreeController from "~/common/lib/AbstractThreeController";
import { makeArray } from "~/common/lib/array-util";

class SampleThreeController extends AbstractThreeController {
  private meshes: Mesh[];

  private mode = 0;

  public constructor() {
    super();

    const cube = new Mesh(new BoxGeometry(1, 1, 1), new MeshNormalMaterial());
    this.scene.add(cube);

    const torus = new Mesh(
      new TorusGeometry(0.5, 0.2),
      new MeshNormalMaterial()
    );
    this.scene.add(torus);

    const tetrahedron = new Mesh(
      new TetrahedronGeometry(1),
      new MeshNormalMaterial()
    );
    this.scene.add(tetrahedron);

    this.meshes = [cube, torus, tetrahedron];

    this.camera.position.set(0, 5, 5);
    this.camera.lookAt(0, 0, 0);

    this.switchVisible();
  }

  private switchVisible() {
    makeArray(this.meshes.length).forEach((_, i) => {
      this.meshes[i].visible = this.mode === i;
    });
  }

  public toggleMode() {
    this.mode = (this.mode + 1) % this.meshes.length;
    this.switchVisible();
  }

  public update(t: number) {
    const r = t / 1000;
    this.meshes.forEach(m => {
      m.rotation.set(r, r, r);
    });
  }
}

export default SampleThreeController;
