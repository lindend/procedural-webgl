import vsSource from "./sun.vs?raw";
import fsSource from "./sun.fs?raw";
import { loadShader } from "../../shader";

export function loadSunShader(gl: WebGL2RenderingContext) {
  return loadShader(gl, vsSource, fsSource);
}
