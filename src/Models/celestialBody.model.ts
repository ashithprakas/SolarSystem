import * as Three from "three";
import { PlanetModel, StarModel } from "../Helpers/PlanetCreate.helper";

export interface Celestial3DBody {
  meshData: Three.Mesh;
  Object3DData: Three.Object3D;
}

export type Celestial3DObjects = StarModel | PlanetModel;

export type SolarSytem3DObjects = Array<Celestial3DObjects>;
