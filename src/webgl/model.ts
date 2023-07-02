import { quat, vec3 } from "gl-matrix";
import { Geometry } from "./geometry";
import { Shader } from "./shader";

type DepthMode = true | false;

export type Model = {
  position: vec3;
  rotation: quat;
  scale: vec3;
  geometry: Geometry;
  shader: Shader;
  depth: DepthMode;
};
