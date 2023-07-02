import { mat4, vec3 } from "gl-matrix";

export type Camera = {
  position: vec3;
  lookAt: vec3;
  up: vec3;
};

export function getViewMatrix(camera: Camera) {
  return mat4.lookAt(mat4.create(), camera.position, camera.lookAt, camera.up);
}
