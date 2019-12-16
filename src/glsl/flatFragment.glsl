precision highp float;

uniform vec2 resolution;
uniform float time;

void main() {
  float val = (gl_FragCoord.x + gl_FragCoord.y) / (resolution.x + resolution.y);
  gl_FragColor = vec4(
    val,
    0,
    1.0 - val,
    1
  );
}