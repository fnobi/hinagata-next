precision highp float;

uniform vec2 resolution;

void main() {
    gl_FragColor = vec4(gl_FragCoord.xy / resolution, 0.0, 1.0);
}