#version 300 es

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

in vec4 vertexPos;

out vec3 modelPos;

void main() {
  modelPos = vertexPos.xyz;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(vertexPos.xyz, 1.0);
}