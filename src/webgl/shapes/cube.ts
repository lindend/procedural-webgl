import { vec3 } from "gl-matrix";
import { Geometry } from "../geometry";

function setVert(
  verts: Float32Array,
  i: number,
  vertexStride: number,
  p: vec3
) {
  verts[i * vertexStride + 0] = p[0];
  verts[i * vertexStride + 1] = p[1];
  verts[i * vertexStride + 2] = p[2];
}

function triangle(indices: number[], i0: number, i1: number, i2: number) {
  indices.push(i0);
  indices.push(i1);
  indices.push(i2);
}

export function cube() {
  const numVertices = 8;
  const vertexStride = 3;
  const verts = new Float32Array(numVertices * vertexStride);
  // 3 indices per triangle, 2 triangles per side, 6 sides
  let indices: number[] = [];
  setVert(verts, 0, vertexStride, vec3.fromValues(-1.0, -1.0, -1.0));
  setVert(verts, 1, vertexStride, vec3.fromValues(-1.0, 1.0, -1.0));
  setVert(verts, 2, vertexStride, vec3.fromValues(1.0, 1.0, -1.0));
  setVert(verts, 3, vertexStride, vec3.fromValues(1.0, -1.0, -1.0));
  setVert(verts, 4, vertexStride, vec3.fromValues(-1.0, -1.0, 1.0));
  setVert(verts, 5, vertexStride, vec3.fromValues(-1.0, 1.0, 1.0));
  setVert(verts, 6, vertexStride, vec3.fromValues(1.0, 1.0, 1.0));
  setVert(verts, 7, vertexStride, vec3.fromValues(1.0, -1.0, 1.0));

  // back
  triangle(indices, 0, 1, 2);
  triangle(indices, 0, 2, 3);

  //front
  triangle(indices, 4, 5, 6);
  triangle(indices, 4, 6, 7);

  //left
  triangle(indices, 0, 1, 5);
  triangle(indices, 0, 5, 4);

  //right
  triangle(indices, 3, 2, 6);
  triangle(indices, 3, 6, 7);

  //top
  triangle(indices, 1, 2, 6);
  triangle(indices, 1, 6, 5);

  //bottom
  triangle(indices, 0, 3, 7);
  triangle(indices, 0, 7, 4);

  return { verts, indices: new Uint32Array(indices) };
}
