import { Channels } from "./geometry";

export type Uniforms =
  | "modelMatrix"
  | "viewMatrix"
  | "projectionMatrix"
  | "lightSource"
  | "lightColor"
  | "time";

export type UniformLocations = {
  [U in Uniforms]: WebGLUniformLocation | null;
};

export type AttribLocations = {
  [U in Channels]: number | null;
};

export type Shader = {
  vertexShader: WebGLShader;
  fragmentShader: WebGLShader;
  program: WebGLProgram;
  uniforms: UniformLocations;
  attribs: AttribLocations;
};

export function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  code: string
) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw "Could not create shader";
  }
  gl.shaderSource(shader, code);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw "Error compiling shader " + gl.getShaderInfoLog(shader);
  }
  return shader;
}

export function loadShader(
  gl: WebGL2RenderingContext,
  vsCode: string,
  fsCode: string
): Shader {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsCode);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsCode);
  const shaderProgram = gl.createProgram();
  if (!shaderProgram) {
    throw "Could not create shader program";
  }

  gl.attachShader(shaderProgram, vs);
  gl.attachShader(shaderProgram, fs);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw "Error linking shader: " + gl.getProgramInfoLog(shaderProgram);
  }

  return {
    vertexShader: vs,
    fragmentShader: fs,
    program: shaderProgram,
    uniforms: {
      modelMatrix: gl.getUniformLocation(shaderProgram, "modelMatrix"),
      viewMatrix: gl.getUniformLocation(shaderProgram, "viewMatrix"),
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        "projectionMatrix"
      ),
      lightSource: gl.getUniformLocation(shaderProgram, "lightSource"),
      lightColor: gl.getUniformLocation(shaderProgram, "lightColor"),
      time: gl.getUniformLocation(shaderProgram, "time"),
    },
    attribs: {
      vertexPos: gl.getAttribLocation(shaderProgram, "vertexPos"),
    },
  };
}
