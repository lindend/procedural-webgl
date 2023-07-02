uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

attribute vec4 vertexPos;

varying vec4 vPos;
varying vec4 vNormal;

void main() {
  vNormal = modelMatrix * vec4(vertexPos.xyz, 0.0);
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vertexPos;
}