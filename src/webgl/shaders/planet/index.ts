import vsSource from "./planet.vs?raw";
import fsSource from "./planet.fs?raw";
import { loadShader } from "../../shader";

export function loadPlanetShader(gl: WebGL2RenderingContext) {
  return loadShader(gl, vsSource, fsSource);
}
