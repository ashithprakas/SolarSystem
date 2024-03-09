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
import {
  Celestial3DObjects,
  SolarSytem3DObjects,
} from "./Models/celestialBody.model";
import { PlanetModel, StarModel } from "./Helpers/PlanetCreate.helper";

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

const pointLigth = new Three.PointLight(0xffffff, 10, 300, 0.2);
scene.add(pointLigth);

let sunModel: StarModel,
  mercuryModel: PlanetModel,
  venusModel: PlanetModel,
  earthModel: PlanetModel,
  marsModel: PlanetModel,
  jupiterModel: PlanetModel,
  saturnModel: PlanetModel,
  uranusModel: PlanetModel,
  neptuneModel: PlanetModel,
  plutoModel: PlanetModel;
let solarSystem: SolarSytem3DObjects = [];

function initializeSolarSystem() {
  sunModel = new StarModel(16, sunTexture, 0, "sun");
  mercuryModel = new PlanetModel(3.2, mercuryTexture, 28, "mercury");
  venusModel = new PlanetModel(5.8, venusTexture, 44, "venus");
  earthModel = new PlanetModel(6, earthTexture, 62, "earth");
  marsModel = new PlanetModel(4, marsTexture, 78, "mars");
  jupiterModel = new PlanetModel(12, jupiterTexture, 100, "jupiter");
  saturnModel = new PlanetModel(10, saturnTexture, 138, "saturn");
  uranusModel = new PlanetModel(7, uranusTexture, 200, "uranus");
  neptuneModel = new PlanetModel(2.8, neptuneTexture, 208, "neptune");
  plutoModel = new PlanetModel(2.6, plutoTexture, 216, "pluto");

  solarSystem = [
    sunModel,
    mercuryModel,
    venusModel,
    earthModel,
    marsModel,
    jupiterModel,
    saturnModel,
    uranusModel,
    neptuneModel,
    plutoModel,
  ];
}

function addToScene() {
  solarSystem.forEach((value) => {
    let object = value.getData();
    scene.add(object.Object3DData);
  });
}

//Animate code
function rotateOnSelfAxis() {
  sunModel.getData().meshData.rotateY(0.004 * rotationSpeed);
  mercuryModel.getData().meshData.rotateY(0.004 * rotationSpeed);
  venusModel.getData().meshData.rotateY(0.002 * rotationSpeed);
  earthModel.getData().meshData.rotateY(0.02 * rotationSpeed);
  marsModel.getData().meshData.rotateY(0.018 * rotationSpeed);
  jupiterModel.getData().meshData.rotateY(0.04 * rotationSpeed);
  saturnModel.getData().meshData.rotateY(0.038 * rotationSpeed);
  uranusModel.getData().meshData.rotateY(0.03 * rotationSpeed);
  neptuneModel.getData().meshData.rotateY(0.032 * rotationSpeed);
  plutoModel.getData().meshData.rotateY(0.008 * rotationSpeed);
}

function rotateAroundSun() {
  mercuryModel.getData().Object3DData.rotateY(0.04 * rotationSpeed);
  venusModel.getData().Object3DData.rotateY(0.015 * rotationSpeed);
  earthModel.getData().Object3DData.rotateY(0.01 * rotationSpeed);
  marsModel.getData().Object3DData.rotateY(0.008 * rotationSpeed);
  jupiterModel.getData().Object3DData.rotateY(0.002 * rotationSpeed);
  saturnModel.getData().Object3DData.rotateY(0.0009 * rotationSpeed);
  uranusModel.getData().Object3DData.rotateY(0.0004 * rotationSpeed);
  neptuneModel.getData().Object3DData.rotateY(0.0001 * rotationSpeed);
  plutoModel.getData().Object3DData.rotateY(0.00007 * rotationSpeed);
}

function animate() {
  renderer.render(scene, camera);
  rotateOnSelfAxis();
  rotateAroundSun();
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
    if (intersect.object) {
      selectedPlanet = solarSystem.find(
        (planet) => planet.getData().meshData.uuid == intersect.object.uuid
      );
    }
  });
  return selectedPlanet?.getData();
}

initializeSolarSystem();
addToScene();

renderer.setAnimationLoop(animate);

window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener("click", onPlanetClick);
