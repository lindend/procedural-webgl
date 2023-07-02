precision mediump float;

varying vec4 vPos;
varying vec4 vNormal;

void main() {
  vec3 normal = normalize(vNormal.xyz);
  vec3 att = dot(normal, vec3(0.0, 0.0, 1.0)) * vec3(1.0, 0.5, 0.3) * 5.0;
  gl_FragColor = vec4(att, 1.0);
}