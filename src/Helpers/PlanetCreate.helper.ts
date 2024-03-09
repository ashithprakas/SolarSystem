import {
  Celestial3DBody,
  SolarSytem3DObjects,
} from "./../Models/celestialBody.model";
import * as Three from "three";

export class BaseModel {
  constructor() {}
  protected mesh: Three.Mesh = new Three.Mesh();
  protected object3D: Three.Object3D = new Three.Object3D();
  protected textureLoader = new Three.TextureLoader();
  protected rotationYSpeed: number = 0;
  protected revolutionYSpeed: number = 0;

  getData(): Celestial3DBody {
    return { meshData: this.mesh, Object3DData: this.object3D };
  }

  rotate() {
    this.mesh.rotateY(this.rotationYSpeed);
  }

  revolve() {
    this.object3D.rotateY(this.revolutionYSpeed);
  }
}
export class PlanetModel extends BaseModel {
  constructor(
    size: number,
    texture: string,
    position: number,
    name: string,
    rotationYSpeed: number,
    revolutionYSpeed: number
  ) {
    super();
    this.createPlanet(size, texture, position, name);
    this.rotationYSpeed = rotationYSpeed;
    this.revolutionYSpeed = revolutionYSpeed;
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
    name: string,
    rotationYSpeed: number,
    revolutionYSpeed: number
  ) {
    super();
    this.createStarData(size, texture, position, name);
    this.rotationYSpeed = rotationYSpeed;
    this.revolutionYSpeed = revolutionYSpeed;
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

export class SolarSystemModel {
  private solarSytemGroup: Three.Group = new Three.Group();
  private solarSystemChildClasses: SolarSytem3DObjects = [];

  constructor(solarSystemModel: SolarSystemModel | null) {
    if (solarSystemModel) {
      this.solarSytemGroup = solarSystemModel.solarSytemGroup;
      this.solarSystemChildClasses = solarSystemModel.solarSystemChildClasses;
    }
  }
  createSun(
    size: number,
    texture: string,
    position: number,
    name: string = "",
    rotationXSpeed: number
  ) {
    let sunModel = new StarModel(
      size,
      texture,
      position,
      name,
      rotationXSpeed,
      0
    );
    this.solarSytemGroup.add(sunModel.getData().Object3DData);
    this.solarSystemChildClasses.push(sunModel);
  }
  createPlanetWithRing(
    size: number,
    texture: string,
    position: number,
    name: string = "",
    rotationXSpeed: number,
    revolutionYSpeed: number,
    ringTexture: string,
    innerRadius: number,
    outerRadius?: number
  ) {
    let planetModel = new PlanetModel(
      size,
      texture,
      position,
      name,
      rotationXSpeed,
      revolutionYSpeed
    );
    planetModel.addRingToPlanet(ringTexture, innerRadius, outerRadius);
    this.solarSytemGroup.add(planetModel.getData().Object3DData);
    this.solarSystemChildClasses.push(planetModel);
  }
  createPlanet(
    size: number,
    texture: string,
    position: number,
    name: string = "",
    rotationXSpeed: number,
    revolutionYSpeed: number
  ) {
    let planetModel = new PlanetModel(
      size,
      texture,
      position,
      name,
      rotationXSpeed,
      revolutionYSpeed
    );
    this.solarSytemGroup.add(planetModel.getData().Object3DData);
    this.solarSystemChildClasses.push(planetModel);
  }

  getSolarSystem() {
    return this.solarSytemGroup;
  }

  animateAllPlanets() {
    this.solarSystemChildClasses.forEach((object) => {
      object.rotate();
      object.revolve();
    });
  }

  updateSolarSystemPosition(
    position: { x: number; y: number } = { x: 0, y: 0 }
  ) {
    this.solarSytemGroup.position.x = position.x;
    this.solarSytemGroup.position.y = position.y;
  }
}
