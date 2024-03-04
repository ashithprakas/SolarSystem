import * as Three from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {
  earthTexture,
  marsTexture,
  mercuryTexture,
  saturnRingTexture,
  saturnTexture,
  starBackground,
  sunTexture,
  venusTexture,
  jupiterTexture,
  uranusTexture,
  neptuneTexture,
  plutoTexture,
} from "./textureImports";

import "./style.css";

const renderer = new Three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new Three.Scene();

const camera = new Three.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(-90, 140, 140);
orbit.update();

const ambientLight = new Three.AmbientLight(0x333333);
scene.add(ambientLight);

const cubeTextureLoader = new Three.CubeTextureLoader();
scene.background = cubeTextureLoader.load([
  starBackground,
  starBackground,
  starBackground,
  starBackground,
  starBackground,
  starBackground,
]);

const textureLoader = new Three.TextureLoader();

const sunGeometry = new Three.SphereGeometry(16, 30, 30);
const sunMaterial = new Three.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new Three.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

const pointLigth = new Three.PointLight(0xffffff, 2, 300, 0.2);
scene.add(pointLigth);

const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const saturn = createPlanet(10, saturnTexture, 138, saturnRingTexture, 3);
const uranus = createPlanet(7, uranusTexture, 200);
const neptune = createPlanet(2.8, neptuneTexture, 200);
const pluto = createPlanet(2.6, plutoTexture, 216);

//create planet funciton
function createPlanet(
  size: number,
  texture: string,
  position: number,
  ringTexture?: string,
  innerRadius?: number,
  outerRadius?: number
) {
  const planetGeometry = new Three.SphereGeometry(size, 30, 30);
  const planetMaterial = new Three.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const planet = new Three.Mesh(planetGeometry, planetMaterial);
  if (ringTexture) {
    const ringGeometry = new Three.RingGeometry(innerRadius, outerRadius, 32);
    var pos = ringGeometry.attributes.position;
    var v3 = new Three.Vector3();
    for (let i = 0; i < pos.count; i = i + 1) {
      v3.fromBufferAttribute(pos, i);
      ringGeometry.attributes.uv.setXY(i, v3.length() < 4 ? 0 : 1, 1);
    }
    const ringMaterial = new Three.MeshStandardMaterial({
      map: textureLoader.load(saturnRingTexture),
      side: Three.DoubleSide,
      transparent: true,
    });
    const ring = new Three.Mesh(ringGeometry, ringMaterial);
    planet.add(ring);
    ring.rotation.x = Math.PI / 2;
  }
  const planetObj = new Three.Object3D();
  planetObj.add(planet);
  planet.position.x = position;
  scene.add(planetObj);
  return { planet, planetObj };
}

//Animate code
function rotateOnSelfAxis() {
  sun.rotateY(0.004);
  mercury.planet.rotateY(0.004);
  venus.planet.rotateY(0.002);
  earth.planet.rotateY(0.02);
  mars.planet.rotateY(0.018);
  jupiter.planet.rotateY(0.04);
  saturn.planet.rotateY(0.038);
  uranus.planet.rotateY(0.03);
  neptune.planet.rotateY(0.032);
  pluto.planet.rotateY(0.008);
}

function rotateAroundSun() {
  mercury.planetObj.rotateY(0.04);
  venus.planetObj.rotateY(0.015);
  earth.planetObj.rotateY(0.01);
  mars.planetObj.rotateY(0.008);
  jupiter.planetObj.rotateY(0.002);
  saturn.planetObj.rotateY(0.0009);
  uranus.planetObj.rotateY(0.0004);
  neptune.planetObj.rotateY(0.0001);
  pluto.planetObj.rotateY(0.00007);
}
function animate() {
  renderer.render(scene, camera);
  rotateOnSelfAxis();
  rotateAroundSun();
}
renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
