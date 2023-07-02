import { mat4 } from "gl-matrix";
import { Shader } from "./shader";
import { Geometry } from "./geometry";
import { Light } from "./light";
import { Model } from "./model";
import { Scene } from "./scene";
import { getViewMatrix } from "./camera";

export type Renderer = {
  gl: WebGL2RenderingContext;
  activeShader: Shader | null;
  projectionMatrix: mat4;
  viewMatrix: mat4;
  lightSource: Light;
  time: number;
};

export function useShader(renderer: Renderer, shader: Shader) {
  const { gl, projectionMatrix, viewMatrix } = renderer;
  gl.useProgram(shader.program);
  gl.uniformMatrix4fv(
    shader.uniforms.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(shader.uniforms.viewMatrix, false, viewMatrix);
  gl.uniform3fv(shader.uniforms.lightSource, renderer.lightSource.position);
  gl.uniform3fv(shader.uniforms.lightColor, renderer.lightSource.color);
  gl.uniform1f(shader.uniforms.time, renderer.time);
  renderer.activeShader = shader;
}

export function drawGeometry(renderer: Renderer, geometry: Geometry) {
  if (!renderer.activeShader) {
    return;
  }

  const { gl, activeShader } = renderer;
  gl.bindBuffer(gl.ARRAY_BUFFER, geometry.vertexBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, geometry.indexBuffer);

  if (activeShader.attribs.vertexPos !== null) {
    gl.vertexAttribPointer(
      activeShader.attribs.vertexPos,
      geometry.channels.vertexPos.components,
      geometry.type,
      false,
      geometry.vertexBufferStride,
      geometry.channels.vertexPos.offset
    );
    gl.enableVertexAttribArray(activeShader.attribs.vertexPos);
  }
  gl.drawElements(gl.TRIANGLES, geometry.numIndices, gl.UNSIGNED_INT, 0);
}

export function clear({ gl }: Renderer) {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

let transform = mat4.create();

export function drawModel(renderer: Renderer, model: Model) {
  const { gl } = renderer;
  useShader(renderer, model.shader);
  gl.uniformMatrix4fv(
    model.shader.uniforms.modelMatrix,
    false,
    mat4.fromRotationTranslationScale(
      transform,
      model.rotation,
      model.position,
      model.scale
    )
  );
  switch (model.depth) {
    case true:
      gl.depthFunc(gl.LEQUAL);
      gl.depthMask(true);
      break;
    case false:
      gl.depthFunc(gl.ALWAYS);
      gl.depthMask(false);
      break;
  }
  drawGeometry(renderer, model.geometry);
}

export function drawScene(renderer: Renderer, scene: Scene) {
  clear(renderer);
  renderer.viewMatrix = getViewMatrix(scene.camera);
  renderer.lightSource = scene.lightSource;
  for (let model of scene.models) {
    drawModel(renderer, model);
  }
}
