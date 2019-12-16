precision highp float;

uniform float time;

void main() {
  gl_FragColor = vec4(
    sin(time * 0.05)  * 0.5 + 0.5,
    sin(time * 0.08)  * 0.5 + 0.5,
    sin(time * 0.1)  * 0.5 + 0.5,
    1
  );
}