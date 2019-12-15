precision highp float;

uniform vec2 resolution;
uniform float time;

const float INTERVAL = 200.0;
const float COLOR_SPEED = 2.0;
const float ROTATE_SPEED = 0.2;
const float PI = 3.141592653589793; // TODO: つかいたくない

void main() {
    float rotate = time * ROTATE_SPEED;
    vec2 pos = gl_FragCoord.xy - resolution * 0.5;
    float angle = (atan(pos[1], pos[0]) + PI) / PI / 2.0;
    float len = sqrt(pos[0] * pos[0] + pos[1] * pos[1]);
    vec2 val = vec2(
        cos(radians(angle * 360.0 + rotate)) * len,
        sin(radians(angle * 360.0 + rotate)) * len
    ) * 360.0 / INTERVAL;
    float b = (
        sin(radians(val[0])) * 0.5 + sin(radians(val[1])) * 0.5
    ) + 0.5 + sin(radians(time * COLOR_SPEED));
    gl_FragColor = vec4(b, b, b, 1.0);
}