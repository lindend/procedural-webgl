import { Camera } from "./camera";
import { Light } from "./light";
import { Model } from "./model";

export type Scene = {
  camera: Camera;
  models: Model[];
  lightSource: Light;
};
