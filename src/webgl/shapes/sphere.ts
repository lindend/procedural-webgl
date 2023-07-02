import { vec3 } from "gl-matrix";

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

export function sphere(numSubdivisions: number) {
  const numVertices = numSubdivisions * (numSubdivisions + 1);
  const vertexStride = 3;
  const verts = new Float32Array(numVertices * vertexStride);
  // 3 indices per triangle, 2 triangles per vertex
  const indices = new Uint32Array(numVertices * 3 * 2);

  for (let row = 0; row <= numSubdivisions; ++row) {
    const alpha = ((row / numSubdivisions) * 2.0 - 1) * Math.PI;
    const yPos = Math.sin(alpha);
    const rowRadius = Math.cos(alpha);
    for (let col = 0; col < numSubdivisions; ++col) {
      const theta = (col / numSubdivisions) * 2.0 * Math.PI;
      const xPos = Math.cos(theta) * rowRadius;
      const zPos = Math.sin(theta) * rowRadius;
      const vertexIndex = row * numSubdivisions + col;
      setVert(
        verts,
        vertexIndex,
        vertexStride,
        vec3.fromValues(xPos, yPos, zPos)
      );
      const indexIndex = ((row - 1) * numSubdivisions + col) * 6;
      if (row > 0) {
        const baseVertex = row * numSubdivisions;
        const nextColumn = (col + 1) % numSubdivisions;
        const previousRow = (row - 1) * numSubdivisions;
        indices[indexIndex + 0] = baseVertex + col;
        indices[indexIndex + 1] = baseVertex + nextColumn;
        indices[indexIndex + 2] = previousRow + nextColumn;
        indices[indexIndex + 3] = baseVertex + col;
        indices[indexIndex + 4] = previousRow + nextColumn;
        indices[indexIndex + 5] = previousRow + col;
      }
    }
  }

  return { verts, indices };
}
