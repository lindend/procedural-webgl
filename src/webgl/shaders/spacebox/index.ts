import vsSource from "./spacebox.vs?raw";
import fsSource from "./spacebox.fs?raw";
import { loadShader } from "../../shader";

export function loadSpaceboxShader(gl: WebGL2RenderingContext) {
  return loadShader(gl, vsSource, fsSource);
}
