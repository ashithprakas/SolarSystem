import * as Three from "three";
import { Celestial3DBody } from "../Models/celestialBody.model";

export class BaseModel {
  constructor() {}
  protected mesh: Three.Mesh = new Three.Mesh();
  protected object3D: Three.Object3D = new Three.Object3D();
  protected textureLoader = new Three.TextureLoader();

  getData(): Celestial3DBody {
    return { meshData: this.mesh, Object3DData: this.object3D };
  }
}
export class PlanetModel extends BaseModel {
  constructor(
    size: number,
    texture: string,
    position: number,
    name: string = ""
  ) {
    super();
    this.createPlanet(size, texture, position, name);
  }

  createPlanet(
    size: number,
    texture: string,
    position: number,
    name: string = ""
  ) {
    const planetGeometry = new Three.SphereGeometry(size, 30, 30);
    const planetMaterial = new Three.MeshStandardMaterial({
      map: this.textureLoader.load(texture),
    });
    this.mesh = new Three.Mesh(planetGeometry, planetMaterial);

    this.object3D = new Three.Object3D();
    this.object3D.name = name;
    this.object3D.add(this.mesh);
    this.mesh.position.x = position;
  }

  addRingToPlanet(
    ringTexture: string,
    innerRadius: number,
    outerRadius?: number
  ) {
    if (ringTexture) {
      const ringGeometry = new Three.RingGeometry(innerRadius, outerRadius, 32);
      var pos = ringGeometry.attributes.position;
      var v3 = new Three.Vector3();
      for (let i = 0; i < pos.count; i = i + 1) {
        v3.fromBufferAttribute(pos, i);
        ringGeometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
      }
      const ringMaterial = new Three.MeshStandardMaterial({
        map: this.textureLoader.load(ringTexture),
        side: Three.DoubleSide,
        transparent: true,
      });
      const ring = new Three.Mesh(ringGeometry, ringMaterial);
      this.mesh.add(ring);
      ring.rotation.x = Math.PI / 2;
    }
  }

  getPlaneData(): Celestial3DBody {
    return { meshData: this.mesh, Object3DData: this.object3D };
  }
}

export class StarModel extends BaseModel {
  constructor(
    size: number,
    texture: string,
    position: number,
    name: string = ""
  ) {
    super();
    this.createStarData(size, texture, position, name);
  }

  createStarData(
    size: number,
    texture: string,
    position: number,
    name: string = ""
  ) {
    const starGeometry = new Three.SphereGeometry(size, 30, 30);
    const startMaterial = new Three.MeshBasicMaterial({
      map: this.textureLoader.load(texture),
    });
    this.mesh = new Three.Mesh(starGeometry, startMaterial);
    this.object3D = new Three.Object3D();
    this.object3D.name = name;
    this.object3D.add(this.mesh);
    this.mesh.position.x = position;
  }

  getStarData(): Celestial3DBody {
    return { meshData: this.mesh, Object3DData: this.object3D };
  }
}
