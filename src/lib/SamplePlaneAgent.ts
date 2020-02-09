import {
  Scene,
  Mesh,
  RawShaderMaterial,
  Vector2,
  PlaneGeometry,
  OrthographicCamera
} from "three";
import flatVertex from "~/glsl/flatVertex.glsl";
import monotoneNoiseFragment from "~/glsl/monotoneNoiseFragment.glsl";
import { FloatUniform, Vec2Uniform } from "~/lib/GLSLUniformType";
import { ThreeAgent } from "~/components/FullScreenThree";

type UniformObject = {
  resolution: Vec2Uniform;
  time: FloatUniform;
};

function calcCameraArea(
  width: number,
  height: number
): [number, number, number, number] {
  return [-width / 2, width / 2, -height / 2, height / 2];
}

export default class SamplePlaneAgent implements ThreeAgent {
  public activeScene: Scene;

  public activeCamera: OrthographicCamera;

  private plane: Mesh;

  private uniformObject: UniformObject;

  public constructor(defaultSize: [number, number] = [1, 1]) {
    this.activeScene = new Scene();

    this.activeCamera = new OrthographicCamera(
      ...calcCameraArea(...defaultSize)
    );

    this.uniformObject = {
      resolution: { type: "vec2", value: new Vector2(...defaultSize) },
      time: { type: "float", value: 0.0 }
    };

    const material = new RawShaderMaterial({
      uniforms: this.uniformObject,
      vertexShader: flatVertex,
      fragmentShader: monotoneNoiseFragment
    });
    this.plane = new Mesh(new PlaneGeometry(2.0, 2.0), material);
    this.activeScene.add(this.plane);
  }

  public setSize(w: number, h: number) {
    [
      this.activeCamera.left,
      this.activeCamera.right,
      this.activeCamera.top,
      this.activeCamera.bottom
    ] = calcCameraArea(w, h);
    this.uniformObject.resolution.value = new Vector2(w, h);
  }

  public update(time: number) {
    this.uniformObject.time.value = time;
  }

  public dispose() {
    this.activeScene.dispose();
  }
}
