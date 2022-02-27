precision highp float;

uniform vec2 resolution;
uniform float time;

const float INTERVAL = 30.0;
const float COLOR_SPEED = 2.0;
const float ROTATE_SPEED = 0.2;

vec2 rotateVector(vec2 v, float rotation) {
    float angle = atan(v[1], v[0]);
    float len = sqrt(v[0] * v[0] + v[1] * v[1]);
    return vec2(
        cos(angle + rotation) * len,
        sin(angle + rotation) * len
    );
}

void main() {
    float rotate = radians(time * ROTATE_SPEED);
    vec2 pos = gl_FragCoord.xy - resolution * 0.5;
    vec2 val = rotateVector(pos, rotate) / INTERVAL;
    float b = (
        sin(val[0]) * 0.5 + sin(val[1]) * 0.5
    ) + 0.5 + sin(radians(time * COLOR_SPEED));
    gl_FragColor = vec4(b, b, b, 1.0);
}