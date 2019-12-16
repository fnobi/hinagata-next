precision highp float;

uniform float time;

const float EASEING_POWER = 3.0;
const float BPM = 100.0;
const float MIN_SIZE = 1.0;
const float MAX_SIZE = 3.0;

void main() {
  float phase = pow(sin(radians(360.0 * time * BPM / 60.0 * 0.02)) * 0.5 + 0.5, EASEING_POWER);
  vec3 threePos = position * (MIN_SIZE + (MAX_SIZE - MIN_SIZE) * phase);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(threePos, 1.0);
}
