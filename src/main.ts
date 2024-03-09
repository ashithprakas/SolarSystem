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
import { Celestial3DObjects } from "./Models/celestialBody.model";
import { SolarSystemModel } from "./Helpers/PlanetCreate.helper";

const mouse = new Three.Vector2();
const raycaster = new Three.Raycaster();
const renderer = new Three.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const rotationSpeed = 0.3;

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

let solarSytemModel: SolarSystemModel = new SolarSystemModel(null);

function initializeSolarSytem() {
  const pointLigth = new Three.PointLight(0xffffff, 10, 300, 0.2);
  scene.add(pointLigth);
  solarSytemModel.createSun(16, sunTexture, 0, "sun", 0.004);
  solarSytemModel.createPlanet(3.2, mercuryTexture, 28, "mercury", 0.004, 0.04);
  solarSytemModel.createPlanet(5.8, venusTexture, 44, "venus", 0.002, 0.015);
  solarSytemModel.createPlanet(6, earthTexture, 62, "earth", 0.02, 0.01);
  solarSytemModel.createPlanet(4, marsTexture, 78, "mars", 0.018, 0.008);
  solarSytemModel.createPlanet(12, jupiterTexture, 100, "jupiter", 0.04, 0.002);
  solarSytemModel.createPlanetWithRing(
    10,
    saturnTexture,
    138,
    "saturn",
    0.038,
    0.0009,
    saturnRingTexture,
    3,
    20
  );
  solarSytemModel.createPlanet(7, uranusTexture, 180, "uranus", 0.03, 0.0004);
  solarSytemModel.createPlanet(
    2.8,
    neptuneTexture,
    208,
    "neptune",
    0.032,
    0.0001
  );
  solarSytemModel.createPlanet(2.6, plutoTexture, 216, "pluto", 0.008, 0.00007);

  scene.add(solarSytemModel.getSolarSystem());
}

function animate() {
  renderer.render(scene, camera);
  solarSytemModel.animateAllPlanets();
  // rotateOnSelfAxis();
  // rotateAroundSun();
}

function onPlanetClick(event: MouseEvent) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  let selectedPlanet = getSelectedPlanet();
  //TODO: Show data of the selected planet
}

function getSelectedPlanet() {
  let selectedPlanet: Celestial3DObjects | undefined;
  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children);
  intersects.forEach((intersect) => {
    // if (intersect.object) {
    //   selectedPlanet = solarSystem.find(
    //     (planet) => planet.getData().meshData.uuid == intersect.object.uuid
    //   );
    // }
  });
  return selectedPlanet?.getData();
}

initializeSolarSytem();

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("click", onPlanetClick);
