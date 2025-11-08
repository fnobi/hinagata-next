import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  TetrahedronGeometry,
  TorusGeometry,
  Vector3
} from "three";
import AbstractThreeController from "~/common/lib/AbstractThreeController";
import { makeArray } from "~/common/lib/array-util";

class SampleThreeController extends AbstractThreeController {
  private meshes: Mesh[];

  private ambientLight: AmbientLight;

  private directionalLight: DirectionalLight;

  private modelIndex = 0;

  private ambientLightProperties: Pick<AmbientLight, "color" | "intensity"> = {
    color: new Color(0xffffff),
    intensity: 1
  };

  private directionalLightProperties: Pick<
    DirectionalLight,
    "color" | "intensity" | "position"
  > = {
    color: new Color(0xffffff),
    intensity: 1,
    position: new Vector3(0, 5, 0)
  };

  public constructor() {
    super();

    const cube = new Mesh(
      new BoxGeometry(1, 1, 1),
      new MeshStandardMaterial({
        color: 0xcccccc
      })
    );
    this.scene.add(cube);

    const torus = new Mesh(
      new TorusGeometry(0.5, 0.2),
      new MeshStandardMaterial({
        color: 0xcccccc
      })
    );
    this.scene.add(torus);

    const tetrahedron = new Mesh(
      new TetrahedronGeometry(1),
      new MeshStandardMaterial({
        color: 0xcccccc
      })
    );
    this.scene.add(tetrahedron);

    this.meshes = [cube, torus, tetrahedron];

    const ambientLight = new AmbientLight();
    this.scene.add(ambientLight);
    this.ambientLight = ambientLight;

    const directionalLight = new DirectionalLight();
    this.scene.add(directionalLight);
    this.directionalLight = directionalLight;

    this.camera.position.set(0, 5, 5);
    this.camera.lookAt(0, 0, 0);

    this.switchVisible();
    this.applyAmbientLightProperties();
    this.applyDirectionalLightProperties();
  }

  private switchVisible() {
    makeArray(this.meshes.length).forEach((_, i) => {
      this.meshes[i].visible = this.modelIndex === i;
    });
  }

  private applyAmbientLightProperties() {
    const { color, intensity } = this.ambientLightProperties;
    this.ambientLight.color = color;
    this.ambientLight.intensity = intensity;
  }

  private applyDirectionalLightProperties() {
    const { color, intensity, position } = this.directionalLightProperties;
    this.directionalLight.color = color;
    this.directionalLight.intensity = intensity;
    this.directionalLight.position.copy(position);
  }

  public toggleModel() {
    this.modelIndex = (this.modelIndex + 1) % this.meshes.length;
    this.switchVisible();
    return this.modelIndex;
  }

  public setAmibentLightProperties(
    p: Partial<typeof this.ambientLightProperties>
  ) {
    this.ambientLightProperties = {
      ...this.ambientLightProperties,
      ...p
    };
    this.applyAmbientLightProperties();
  }

  public setDirectionalLightProperties(
    p: Partial<typeof this.directionalLightProperties>
  ) {
    this.directionalLightProperties = {
      ...this.directionalLightProperties,
      ...p
    };
    this.applyDirectionalLightProperties();
  }

  public update(t: number) {
    super.update(t);
    const r = t / 1000;
    this.meshes.forEach(m => {
      m.rotation.set(r, r, r);
    });
  }
}

export default SampleThreeController;
