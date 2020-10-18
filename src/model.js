import Ajv from 'ajv';

import {isDevelopment} from './flags.js';
import schema from './schema.json';

const ajv = new Ajv() // options can be passed, e.g. {allErrors: true}
const validator = ajv.compile(schema);

const trackedValues = {};

function getValueOrMakeNew(name) {
  const trackedValue = trackedValues[name] || {
    subscriptions: new Set(),
  };
  trackedValues[name] = trackedValue;
  return trackedValue;
}

export function add(name, initialValue) {
  const trackedValue = getValueOrMakeNew(name);
  if (initialValue !== undefined) {
    trackedValue.value = initialValue;
  }
  return trackedValue;
}

export function get(name) {
  return trackedValues[name].value;
}

export function set(name, newValue) {
  const trackedValue = trackedValues[name];
  if (!trackedValue) {
    throw new Error(`no such track value: ${name}`);
  }
  trackedValue.value = newValue;
  const fns = [...trackedValue.subscriptions.keys()];
  for (const fn of fns) {
    fn(newValue, name);
  }
}

export function subscribe(name, fn) {
  const trackedValue = getValueOrMakeNew(name);
  trackedValue.subscriptions.add(fn);
}

export function unsubscribe(name, fn) {
  const trackedValue = getValueOrMakeNew(name);
  trackedValue.subscriptions.delete(fn);
}

const newTestData = {
  "name": "My jsGist",
  "settings": {},
  "files": [
    {
      name: "index.html",
      content: "",
    },
    {
      name: "index.css",
      content: "",
    },
    {
      name: "index.js",
      content: "",
    },
  ],
};
export function getNewData() {
  return JSON.parse(JSON.stringify(newTestData));
}
export function getBlankData() {
  const url = `${window.location.origin}/resources/images/logo.svg`;
  return JSON.parse(JSON.stringify({
    "name": "jsGist",
    "settings": {},
    "files": [
      {
        "name": "index.html",
        "content": ``,
      },
      {
        "name": "index.css",
        "content": `
          html, body {
            margin: 0;
            width: 100%;
            height: 100%;
            background-image: url(${url});
            background-size: contain contain;
            background-position: center center;
            background-repeat: no-repeat no-repeat;
          }
          @media (prefers-color-scheme: dark) {
            html {
              background: #222;
            }
          }
        `,
      },
      {
        "name": "index.js",
        "content": "",
      }
    ]
  }));
}

export let data = isDevelopment ? {
  "name": "ThreeJSFundamentals Scenegraph Tank",
  "settings": {},
  "files": [
    {
      "name": "index.html",
      "content": "<canvas id=\"c\"></canvas>\n<div id=\"info\"></div>",
    },
    {
      "name": "index.css",
      "content": "body {\n  margin: 0;\n}\n#c {\n  width: 100vw;\n  height: 100vh;\n  display: block;\n}\n#info { \n  position: absolute; \n  left: 1em; \n  top: 1em; \n  background: rgba(0,0,0,.8); \n  padding: .5em;\n  color: white;\n  font-family: monospace;\n}",
    },
    {
      "name": "index.js",
      "content": "import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/build/three.module.js';\n\nfunction main() {\n  const canvas = document.querySelector('#c');\n  const renderer = new THREE.WebGLRenderer({canvas: canvas});\n  renderer.setClearColor(0xAAAAAA);\n  renderer.shadowMap.enabled = true;\n\n  function makeCamera(fov = 40) {\n    const aspect = 2;  // the canvas default\n    const zNear = 0.1;\n    const zFar = 1000;\n    return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);\n  }\n  const camera = makeCamera();\n  camera.position.set(8, 4, 10).multiplyScalar(3);\n  camera.lookAt(0, 0, 0);\n\n  const scene = new THREE.Scene();\n\n  {\n    const light = new THREE.DirectionalLight(0xffffff, 1);\n    light.position.set(0, 20, 0);\n    scene.add(light);\n    light.castShadow = true;\n    light.shadow.mapSize.width = 2048;\n    light.shadow.mapSize.height = 2048;\n\n    const d = 50;\n    light.shadow.camera.left = -d;\n    light.shadow.camera.right = d;\n    light.shadow.camera.top = d;\n    light.shadow.camera.bottom = -d;\n    light.shadow.camera.near = 1;\n    light.shadow.camera.far = 50;\n    light.shadow.bias = 0.001;\n  }\n\n  {\n    const light = new THREE.DirectionalLight(0xffffff, 1);\n    light.position.set(1, 2, 4);\n    scene.add(light);\n  }\n\n  const groundGeometry = new THREE.PlaneBufferGeometry(50, 50);\n  const groundMaterial = new THREE.MeshPhongMaterial({color: 0xCC8866});\n  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);\n  groundMesh.rotation.x = Math.PI * -.5;\n  groundMesh.receiveShadow = true;\n  scene.add(groundMesh);\n\n  const carWidth = 4;\n  const carHeight = 1;\n  const carLength = 8;\n\n  const tank = new THREE.Object3D();\n  scene.add(tank);\n\n  const bodyGeometry = new THREE.BoxBufferGeometry(carWidth, carHeight, carLength);\n  const bodyMaterial = new THREE.MeshPhongMaterial({color: 0x6688AA});\n  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);\n  bodyMesh.position.y = 1.4;\n  bodyMesh.castShadow = true;\n  tank.add(bodyMesh);\n\n  const tankCameraFov = 75;\n  const tankCamera = makeCamera(tankCameraFov);\n  tankCamera.position.y = 3;\n  tankCamera.position.z = -6;\n  tankCamera.rotation.y = Math.PI;\n  bodyMesh.add(tankCamera);\n\n  const wheelRadius = 1;\n  const wheelThickness = .5;\n  const wheelSegments = 6;\n  const wheelGeometry = new THREE.CylinderBufferGeometry(\n      wheelRadius,     // top radius\n      wheelRadius,     // bottom radius\n      wheelThickness,  // height of cylinder\n      wheelSegments);\n  const wheelMaterial = new THREE.MeshPhongMaterial({color: 0x888888});\n  const wheelPositions = [\n    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2,  carLength / 3],\n    [ carWidth / 2 + wheelThickness / 2, -carHeight / 2,  carLength / 3],\n    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],\n    [ carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],\n    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],\n    [ carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],\n  ];\n  const wheelMeshes = wheelPositions.map((position) => {\n    const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);\n    mesh.position.set(...position);\n    mesh.rotation.z = Math.PI * .5;\n    mesh.castShadow = true;\n    bodyMesh.add(mesh);\n    return mesh;\n  });\n\n  const domeRadius = 2;\n  const domeWidthSubdivisions = 12;\n  const domeHeightSubdivisions = 12;\n  const domePhiStart = 0;\n  const domePhiEnd = Math.PI * 2;\n  const domeThetaStart = 0;\n  const domeThetaEnd = Math.PI * .5;\n  const domeGeometry = new THREE.SphereBufferGeometry(\n    domeRadius, domeWidthSubdivisions, domeHeightSubdivisions,\n    domePhiStart, domePhiEnd, domeThetaStart, domeThetaEnd);\n  const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial);\n  domeMesh.castShadow = true;\n  bodyMesh.add(domeMesh);\n  domeMesh.position.y = .5;\n\n  const turretWidth = .1;\n  const turretHeight = .1;\n  const turretLength = carLength * .75 * .2;\n  const turretGeometry = new THREE.BoxBufferGeometry(\n      turretWidth, turretHeight, turretLength);\n  const turretMesh = new THREE.Mesh(turretGeometry, bodyMaterial);\n  const turretPivot = new THREE.Object3D();\n  turretMesh.castShadow = true;\n  turretPivot.scale.set(5, 5, 5);\n  turretPivot.position.y = .5;\n  turretMesh.position.z = turretLength * .5;\n  turretPivot.add(turretMesh);\n  bodyMesh.add(turretPivot);\n\n  const turretCamera = makeCamera();\n  turretCamera.position.y = .75 * .2;\n  turretMesh.add(turretCamera);\n\n  const targetGeometry = new THREE.SphereBufferGeometry(.5, 6, 3);\n  const targetMaterial = new THREE.MeshPhongMaterial({color: 0x00FF00, flatShading: true});\n  const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);\n  const targetOrbit = new THREE.Object3D();\n  const targetElevation = new THREE.Object3D();\n  const targetBob = new THREE.Object3D();\n  targetMesh.castShadow = true;\n  scene.add(targetOrbit);\n  targetOrbit.add(targetElevation);\n  targetElevation.position.z = carLength * 2;\n  targetElevation.position.y = 8;\n  targetElevation.add(targetBob);\n  targetBob.add(targetMesh);\n\n  const targetCamera = makeCamera();\n  const targetCameraPivot = new THREE.Object3D();\n  targetCamera.position.y = 1;\n  targetCamera.position.z = -2;\n  targetCamera.rotation.y = Math.PI;\n  targetBob.add(targetCameraPivot);\n  targetCameraPivot.add(targetCamera);\n\n  // Create a sine-like wave\n  const curve = new THREE.SplineCurve( [\n    new THREE.Vector2( -10, 0 ),\n    new THREE.Vector2( -5, 5 ),\n    new THREE.Vector2( 0, 0 ),\n    new THREE.Vector2( 5, -5 ),\n    new THREE.Vector2( 10, 0 ),\n    new THREE.Vector2( 5, 10 ),\n    new THREE.Vector2( -5, 10 ),\n    new THREE.Vector2( -10, -10 ),\n    new THREE.Vector2( -15, -8 ),\n    new THREE.Vector2( -10, 0 ),\n  ] );\n\n  const points = curve.getPoints( 50 );\n  const geometry = new THREE.BufferGeometry().setFromPoints( points );\n  const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );\n  const splineObject = new THREE.Line( geometry, material );\n  splineObject.rotation.x = Math.PI * .5;\n  splineObject.position.y = 0.05;\n  scene.add(splineObject);\n\n  function resizeRendererToDisplaySize(renderer) {\n    const canvas = renderer.domElement;\n    const width = canvas.clientWidth;\n    const height = canvas.clientHeight;\n    const needResize = canvas.width !== width || canvas.height !== height;\n    if (needResize) {\n      renderer.setSize(width, height, false);\n    }\n    return needResize;\n  }\n\n  const targetPosition = new THREE.Vector3();\n  const tankPosition = new THREE.Vector2();\n  const tankTarget = new THREE.Vector2();\n\n  const cameras = [\n    { cam: camera, desc: 'detached camera', },\n    { cam: turretCamera, desc: 'on turret looking at target', },\n    { cam: targetCamera, desc: 'near target looking at tank', },\n    { cam: tankCamera, desc: 'above back of tank', },\n  ];\n\n  const infoElem = document.querySelector('#info');\n\n  function render(time) {\n    time *= 0.001;\n\n    if (resizeRendererToDisplaySize(renderer)) {\n      const canvas = renderer.domElement;\n      cameras.forEach((cameraInfo) => {\n        const camera = cameraInfo.cam;\n        camera.aspect = canvas.clientWidth / canvas.clientHeight;\n        camera.updateProjectionMatrix();\n      });\n    }\n\n    // move target\n    targetOrbit.rotation.y = time * .27;\n    targetBob.position.y = Math.sin(time * 2) * 4;\n    targetMesh.rotation.x = time * 7;\n    targetMesh.rotation.y = time * 13;\n    targetMaterial.emissive.setHSL(time * 10 % 1, 1, .25);\n    targetMaterial.color.setHSL(time * 10 % 1, 1, .25);\n\n    // move tank\n    const tankTime = time * .05;\n    curve.getPointAt(tankTime % 1, tankPosition);\n    curve.getPointAt((tankTime + 0.01) % 1, tankTarget);\n    tank.position.set(tankPosition.x, 0, tankPosition.y);\n    tank.lookAt(tankTarget.x, 0, tankTarget.y);\n\n    // face turret at target\n    targetMesh.getWorldPosition(targetPosition);\n    turretPivot.lookAt(targetPosition);\n\n    // make the turretCamera look at target\n    turretCamera.lookAt(targetPosition);\n\n    // make the targetCameraPivot look at the at the tank\n    tank.getWorldPosition(targetPosition);\n    targetCameraPivot.lookAt(targetPosition);\n\n    wheelMeshes.forEach((obj) => {\n      obj.rotation.x = time * 3;\n    });\n\n    const camera = cameras[time * .25 % cameras.length | 0];\n    infoElem.textContent = camera.desc;\n\n    renderer.render(scene, camera.cam);\n\n    requestAnimationFrame(render);\n  }\n\n  requestAnimationFrame(render);\n}\n\nmain();\n",
    }
  ]
} : getNewData();

if (!validator(data)) {
  console.log(validator.errors);
}

const dataVersionKey = 'dataVersion';
const updateVersionKey = 'updateVersion';

add(dataVersionKey, 0);   // any data changes
add(updateVersionKey, 0);  // all data changes

function notify(version = 'dataVersion') {
  set(version, get(version) + 1);
}

function getUniqueName(basename) {
  const filenames = new Set(data.files.map(f => f.name));
  for (let count = data.files.length + 1; ; ++count) {
    const name = `${basename}${count}`;
    if (!filenames.has(name)) {
      return name;
    }
  }
}

export function addFile(name = "", content = "") {
  name = name || getUniqueName('unnamed');
  data.files.push({
    name,
    content,
  });
  notify();
}

export function setName(name) {
  data.name = name;
  notify();
}

export function setFileName(ndx, newName) {
  data.files[ndx].name = newName;
  notify();
}

export function setFileContent(ndx, content) {
  data.files[ndx].content = content;
  notify();
}

export function setFileType(ndx, type) {
  data.files[ndx].type = type;
  notify();
}

export function deleteFile(ndx) {
  data.files.splice(ndx, 1);
  notify();
}

export function validate(data) {
  if (!validator(data)) {
    debugger;
    throw new Error(`data not valid:\n${validator.errors.map(e => `${e.message}: ${e.dataPath}`)}`);
  }
}

export function setData(newData) {
  validate(newData);
  data = newData;
  notify();
  set('updateVersion', get('updateVersion') + 1);
}
