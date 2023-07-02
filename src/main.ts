import { mat4, quat, vec3 } from "gl-matrix";
import { sphere } from "./webgl/shapes/sphere";
import { Scene } from "./webgl/scene";
import { Model } from "./webgl/model";
import { Renderer, drawScene } from "./webgl/renderer";
import { loadSunShader } from "./webgl/shaders/sun";
import { loadPlanetShader } from "./webgl/shaders/planet";
import { shapeGeometry } from "./webgl/shapes/shape";
import { cube } from "./webgl/shapes/cube";
import { loadSpaceboxShader } from "./webgl/shaders/spacebox";

function getGlContext() {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const glContext = canvas.getContext("webgl2");
  if (!glContext) {
    console.error("Could not gl context plz help");
    throw "well, shit...";
  }
  return glContext;
}

function initCanvas() {
  const gl = getGlContext();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  return gl;
}

function getSunModel(gl: WebGL2RenderingContext): Model {
  return {
    geometry: shapeGeometry(gl, sphere(128)),
    shader: loadSunShader(gl),
    position: vec3.fromValues(0, 0, -150000000),
    scale: vec3.fromValues(7000000, 7000000, 7000000),
    rotation: quat.create(),
    depth: true,
  };
}

function getPlanetModel(gl: WebGL2RenderingContext): Model {
  return {
    geometry: shapeGeometry(gl, sphere(128)),
    shader: loadPlanetShader(gl),
    position: vec3.fromValues(30000, 0, -200000),
    scale: vec3.fromValues(6300, 6300, 6300),
    rotation: quat.create(),
    depth: true,
  };
}

function getSpaceboxModel(gl: WebGL2RenderingContext): Model {
  return {
    geometry: shapeGeometry(gl, cube()),
    shader: loadSpaceboxShader(gl),
    position: vec3.create(),
    scale: vec3.fromValues(1000000, 1000000, 1000000),
    rotation: quat.create(),
    depth: false,
  };
}

function startRenderer() {
  const gl = initCanvas();

  const fov = 0.25 * Math.PI;
  const aspect = gl.canvas.width / gl.canvas.height;
  const near = 1000.0;
  const far = 200000000.0;

  const projectionMatrix = mat4.perspective(
    mat4.create(),
    fov,
    aspect,
    near,
    far
  );

  const viewMatrix = mat4.identity(mat4.create());
  let renderer: Renderer = {
    gl,
    projectionMatrix,
    viewMatrix,
    activeShader: null,
    lightSource: {
      position: vec3.create(),
      color: vec3.create(),
    },
    time: 0.0,
  };
  let planet = getPlanetModel(gl);
  let sun = getSunModel(gl);
  let spacebox = getSpaceboxModel(gl);
  const scene: Scene = {
    camera: {
      position: vec3.create(),
      lookAt: planet.position,
      up: vec3.fromValues(0.0, 1.0, 0.0),
    },
    models: [spacebox, sun, planet],
    lightSource: {
      color: vec3.fromValues(1.0, 1.0, 1.0),
      position: sun.position,
    },
  };
  let cameraAngle = Math.PI + 1;
  let cameraDistance = 20000;
  const renderFrame = () => {
    requestAnimationFrame(renderFrame);
    drawScene(renderer, scene);
    // quat.rotateY(planet.rotation, planet.rotation, -0.01);
    // quat.rotateY(spacebox.rotation, spacebox.rotation, -0.003);
    vec3.add(
      scene.camera.position,
      planet.position,
      vec3.fromValues(
        Math.sin(cameraAngle) * cameraDistance,
        0.0,
        Math.cos(cameraAngle) * cameraDistance
      )
    );
    // renderer.time += 0.001;
    // cameraAngle += 0.003;
  };
  requestAnimationFrame(renderFrame);
}

startRenderer();
