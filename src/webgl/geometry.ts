export type GeometryChannel = {
  offset: number;
  components: number;
};

export type Channels = "vertexPos";
export type GeometryChannels = { [C in Channels]: GeometryChannel };

export type Geometry = {
  indexBuffer: WebGLBuffer;
  vertexBuffer: WebGLBuffer;
  vertexBufferStride: number;
  numIndices: number;
  numVertices: number;
  channels: GeometryChannels;
  type: number;
};
