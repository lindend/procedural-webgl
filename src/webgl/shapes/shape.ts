import { Geometry } from "../geometry";

export type ShapeData = {
  verts: Float32Array;
  indices: Uint32Array;
};

export function shapeGeometry(
  gl: WebGL2RenderingContext,
  shape: ShapeData
): Geometry {
  const { verts, indices } = shape;

  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) throw "Could not create position buffer";

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  if (!indexBuffer) throw "Could not create index buffer";

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  return {
    vertexBuffer: positionBuffer,
    indexBuffer,
    numIndices: indices.length,
    numVertices: verts.length,
    type: gl.FLOAT,
    vertexBufferStride: 0,
    channels: {
      vertexPos: {
        components: 3,
        offset: 0,
      },
    },
  };
}
