import {
  Scene,
  Mesh,
  PerspectiveCamera,
  BoxGeometry,
  ShaderMaterial,
  Vector2
} from "three";
import { FloatUniform, Vec2Uniform } from "~/lib/GLSLUniformType";
import beatBoxVertex from "~/glsl/beatBoxVertex.glsl";
import cubeGradFragment from "~/glsl/cubeGradFragment.glsl";
import { ThreeAgent } from "~/components/FullScreenThree";

type UniformObject = {
  resolution: Vec2Uniform;
  time: FloatUniform;
};

export default class SampleCubeAgent implements ThreeAgent {
  public activeScene: Scene;

  public activeCamera: PerspectiveCamera;

  private cube: Mesh;

  private uniformObject: UniformObject;

  public constructor(defaultSize: [number, number] = [1, 1]) {
    this.activeScene = new Scene();

    this.activeCamera = new PerspectiveCamera(
      75,
      defaultSize[0] / defaultSize[1],
      0.1,
      1000
    );
    this.activeCamera.position.z = 5;

    this.uniformObject = {
      resolution: { type: "vec2", value: new Vector2(...defaultSize) },
      time: { type: "float", value: 0.0 }
    };

    const material = new ShaderMaterial({
      uniforms: this.uniformObject,
      vertexShader: beatBoxVertex,
      fragmentShader: cubeGradFragment
    });

    this.cube = new Mesh(new BoxGeometry(1, 1, 1), material);
    this.activeScene.add(this.cube);
  }

  public setSize(w: number, h: number) {
    this.activeCamera.aspect = w / h;
    this.activeCamera.updateProjectionMatrix();
    this.uniformObject.resolution.value = new Vector2(w, h);
  }

  public update(time: number) {
    this.uniformObject.time.value = time;

    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
    this.cube.rotation.z += 0.01;
  }

  public dispose() {
    this.activeScene.dispose();
  }
}
