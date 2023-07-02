#version 300 es

uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

in vec4 vertexPos;

out vec4 vPos;
out vec4 oNormal;
out vec3 wNormal;

void main() {
  oNormal = abs(vec4(vertexPos.xyz, 0.0));
  wNormal = (modelMatrix * vec4(vertexPos.xyz, 0.0)).xyz;
  vPos = vertexPos;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vertexPos;
}