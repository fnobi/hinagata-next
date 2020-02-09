precision highp float;

uniform float time;
varying vec3 vUv;

const float CORNER_SHIFT = 200.0;
const float COLOR_INTERVAL = 120.0;
const float CORNER_HIGHLIGHT = 1.2;
const float SPEED = 3.5;

void main() {
  float len = pow(
    pow(vUv.x, 2.0) + pow(vUv.y, 2.0) + pow(vUv.z, 2.0),
    1.0 / 3.0
  );
  float t = (time * SPEED) + len * CORNER_SHIFT;
  vec4 baseColor = vec4(
    sin(radians(COLOR_INTERVAL * 0.0 + t)) * 0.5 + 0.5,
    sin(radians(COLOR_INTERVAL * 1.0 + t)) * 0.5 + 0.5,
    sin(radians(COLOR_INTERVAL * 2.0 + t)) * 0.5 + 0.5,
    1.0
  );
  gl_FragColor = mix(vec4(0, 0, 0, 1), baseColor, len * CORNER_HIGHLIGHT);
}