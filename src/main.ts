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

const rayCaster = new Three.Raycaster();
const mouse = new Three.Vector2();
const raycaster = new Three.Raycaster();
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

const ambientLight = new Three.AmbientLight(0x333333, 2);
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
// const sun = new Three.Mesh(sunGeometry, sunMaterial);
// scene.add(sun);

const pointLigth = new Three.PointLight(0xffffff, 10, 300, 0.2);
scene.add(pointLigth);

const sun = createStar(16, sunTexture, 0);
const mercury = createPlanet(3.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(4, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const saturn = createPlanet(10, saturnTexture, 138, saturnRingTexture, 3);
const uranus = createPlanet(7, uranusTexture, 200);
const neptune = createPlanet(2.8, neptuneTexture, 200);
const pluto = createPlanet(2.6, plutoTexture, 216);

const planetArray = [
  sun,
  mercury,
  venus,
  earth,
  mars,
  jupiter,
  saturn,
  uranus,
  neptune,
  pluto,
];

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
  return { mesh: planet, Object3D: planetObj };
}

function createStar(size: number, texture: string, position: number) {
  const starGeometry = new Three.SphereGeometry(size, 30, 30);
  const startMaterial = new Three.MeshBasicMaterial({
    map: textureLoader.load(texture),
  });
  const star = new Three.Mesh(starGeometry, startMaterial);
  const starObj = new Three.Object3D();
  starObj.add(star);
  star.position.x = position;
  scene.add(starObj);
  return { mesh: star, Object3D: starObj };
}

//Animate code
function rotateOnSelfAxis() {
  sun.mesh.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);
}

function rotateAroundSun() {
  mercury.Object3D.rotateY(0.04);
  venus.Object3D.rotateY(0.015);
  earth.Object3D.rotateY(0.01);
  mars.Object3D.rotateY(0.008);
  jupiter.Object3D.rotateY(0.002);
  saturn.Object3D.rotateY(0.0009);
  uranus.Object3D.rotateY(0.0004);
  neptune.Object3D.rotateY(0.0001);
  pluto.Object3D.rotateY(0.00007);
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

window.addEventListener("click", onPlanetClick);

function onPlanetClick(event: MouseEvent) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  getSelectedPlanet();
}

function getSelectedPlanet() {
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);
  console.log("planet array", planetArray);

  for (let i = 0; i < intersects.length; i++) {
    console.log(intersects[i]);
  }

  renderer.render(scene, camera);
}
