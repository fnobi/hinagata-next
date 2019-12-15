precision highp float;

uniform vec2 resolution;
uniform float time;

const float INTERVAL = 200.0;
const float SPEED = 2.0;

void main() {
    vec2 pos = gl_FragCoord.xy - resolution * 0.5;
    vec2 val = 360.0 * pos / INTERVAL;
    float b = (
        sin(radians(val[0])) * 0.5 + sin(radians(val[1])) * 0.5
    ) + 0.5 + sin(radians(time * SPEED));
    gl_FragColor = vec4(b, b, b, 1.0);
}