import { Octokit } from '@octokit/rest';

const userAgent = 'jsGist v0.0.1';
const emptyValue = '/*bug-in-github-api-content-can-not-be-empty*/';

function getEmptyFileHack(file) {
  return file.content.startsWith(emptyValue)
                ? file.content.substr(emptyValue.length)
                : file.content;
}

// there are 3 forms current
//
// 1. files are stored by filename (legacy)
// 2. files are stored as JSON (this happens if there are any duplicate names)
// 3. files are stored by filename and filenames references them in order

export function getGistContent(gist) {
  const data = JSON.parse(gist.files['jsGist.json'].content);
  // github stores files by filename but we need them in the same order in the array
  // they started with so they go to the correct pane.
  if (data.filenames) {
    data.files = data.filenames.map(name => {
      return {
        name: name,
        content: getEmptyFileHack(gist.files[name]),
      };
    });
  } else {
    // legacy path if there are no filenames
    data.files = Object.entries(gist.files)
      .filter(([name]) => name !== 'jsGist.json')
      .map(([name, file]) => {
        return {
          name,
          content: getEmptyFileHack(file),
        }
      }).concat(data.files || []);
  }
  return data;
} 

/*
  "url": "https://api.github.com/gists/bad0a8491bd6614e729ff01cc14089c9",
  "forks_url": "https://api.github.com/gists/bad0a8491bd6614e729ff01cc14089c9/forks",
  "commits_url": "https://api.github.com/gists/bad0a8491bd6614e729ff01cc14089c9/commits",
  "id": "bad0a8491bd6614e729ff01cc14089c9",
  "node_id": "MDQ6R2lzdGJhZDBhODQ5MWJkNjYxNGU3MjlmZjAxY2MxNDA4OWM5",
  "git_pull_url": "https://gist.github.com/bad0a8491bd6614e729ff01cc14089c9.git",
  "git_push_url": "https://gist.github.com/bad0a8491bd6614e729ff01cc14089c9.git",
  "html_url": "https://gist.github.com/bad0a8491bd6614e729ff01cc14089c9",
  "files": {
    "index.css": {
      "filename": "index.css",
      "type": "text/css",
      "language": "CSS",
      "raw_url": "https://gist.githubusercontent.com/greggman/bad0a8491bd6614e729ff01cc14089c9/raw/1847e2c75f6b76223402f69bada71e72db880605/index.css",
      "size": 243,
      "truncated": false,
      "content": "body {\n  margin: 0;\n}\n#c {\n  width: 100vw;\n  height: 100vh;\n  display: block;\n}\n#info { \n  position: absolute; \n  left: 1em; \n  top: 1em; \n  background: rgba(0,0,0,.8); \n  padding: .5em;\n        color: white;\n        font-family: monospace;\n}\n"
    },
    "index.html": {
      "filename": "index.html",
      "type": "text/html",
      "language": "HTML",
      "raw_url": "https://gist.githubusercontent.com/greggman/bad0a8491bd6614e729ff01cc14089c9/raw/c9e9e838f601e2d98d448b035ce3052629969c11/index.html",
      "size": 46,
      "truncated": false,
      "content": "<canvas id=\"c\"></canvas>\n<div id=\"info\"></div>"
    },
    "index.js": {
      "filename": "index.js",
      "type": "application/javascript",
      "language": "JavaScript",
      "raw_url": "https://gist.githubusercontent.com/greggman/bad0a8491bd6614e729ff01cc14089c9/raw/77a7fca481ff157da44f4196ce253ea282f0abdc/index.js",
      "size": 8413,
      "truncated": false,
      "content": "import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/build/three.module.js';\n\nfunction main() {\n  const canvas = document.querySelector('#c');\n  const renderer = new THREE.WebGLRenderer({canvas: canvas});\n  renderer.setClearColor(0x88AACC);\n  renderer.shadowMap.enabled = true;\n\n  function makeCamera(fov = 40) {\n    const aspect = 2;  // the canvas default\n    const zNear = 0.1;\n    const zFar = 1000;\n    return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);\n  }\n  const camera = makeCamera();\n  camera.position.set(8, 4, 10).multiplyScalar(3);\n  camera.lookAt(0, 0, 0);\n\n  const scene = new THREE.Scene();\n\n  {\n    const light = new THREE.DirectionalLight(0xffffff, 1);\n    light.position.set(0, 20, 0);\n    scene.add(light);\n    light.castShadow = true;\n    light.shadow.mapSize.width = 2048;\n    light.shadow.mapSize.height = 2048;\n\n    const d = 50;\n    light.shadow.camera.left = -d;\n    light.shadow.camera.right = d;\n    light.shadow.camera.top = d;\n    light.shadow.camera.bottom = -d;\n    light.shadow.camera.near = 1;\n    light.shadow.camera.far = 50;\n    light.shadow.bias = 0.001;\n  }\n\n  {\n    const light = new THREE.DirectionalLight(0xffffff, 1);\n    light.position.set(1, 2, 4);\n    scene.add(light);\n  }\n\n  const groundGeometry = new THREE.PlaneBufferGeometry(50, 50);\n  const groundMaterial = new THREE.MeshPhongMaterial({color: 0xCC8866});\n  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);\n  groundMesh.rotation.x = Math.PI * -.5;\n  groundMesh.receiveShadow = true;\n  scene.add(groundMesh);\n\n  const carWidth = 4;\n  const carHeight = 1;\n  const carLength = 8;\n\n  const tank = new THREE.Object3D();\n  scene.add(tank);\n\n  const bodyGeometry = new THREE.BoxBufferGeometry(carWidth, carHeight, carLength);\n  const bodyMaterial = new THREE.MeshPhongMaterial({color: 0x66AA88});\n  const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);\n  bodyMesh.position.y = 1.4;\n  bodyMesh.castShadow = true;\n  tank.add(bodyMesh);\n\n  const tankCameraFov = 75;\n  const tankCamera = makeCamera(tankCameraFov);\n  tankCamera.position.y = 3;\n  tankCamera.position.z = -6;\n  tankCamera.rotation.y = Math.PI;\n  bodyMesh.add(tankCamera);\n\n  const wheelRadius = 1;\n  const wheelThickness = .5;\n  const wheelSegments = 6;\n  const wheelGeometry = new THREE.CylinderBufferGeometry(\n      wheelRadius,     // top radius\n      wheelRadius,     // bottom radius\n      wheelThickness,  // height of cylinder\n      wheelSegments);\n  const wheelMaterial = new THREE.MeshPhongMaterial({color: 0x888888});\n  const wheelPositions = [\n    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2,  carLength / 3],\n    [ carWidth / 2 + wheelThickness / 2, -carHeight / 2,  carLength / 3],\n    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],\n    [ carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],\n    [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],\n    [ carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],\n  ];\n  const wheelMeshes = wheelPositions.map((position) => {\n    const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);\n    mesh.position.set(...position);\n    mesh.rotation.z = Math.PI * .5;\n    mesh.castShadow = true;\n    bodyMesh.add(mesh);\n    return mesh;\n  });\n\n  const domeRadius = 2;\n  const domeWidthSubdivisions = 12;\n  const domeHeightSubdivisions = 12;\n  const domePhiStart = 0;\n  const domePhiEnd = Math.PI * 2;\n  const domeThetaStart = 0;\n  const domeThetaEnd = Math.PI * .5;\n  const domeGeometry = new THREE.SphereBufferGeometry(\n    domeRadius, domeWidthSubdivisions, domeHeightSubdivisions,\n    domePhiStart, domePhiEnd, domeThetaStart, domeThetaEnd);\n  const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial);\n  domeMesh.castShadow = true;\n  bodyMesh.add(domeMesh);\n  domeMesh.position.y = .5;\n\n  const turretWidth = .1;\n  const turretHeight = .1;\n  const turretLength = carLength * .75 * .2;\n  const turretGeometry = new THREE.BoxBufferGeometry(\n      turretWidth, turretHeight, turretLength);\n  const turretMesh = new THREE.Mesh(turretGeometry, bodyMaterial);\n  const turretPivot = new THREE.Object3D();\n  turretMesh.castShadow = true;\n  turretPivot.scale.set(5, 5, 5);\n  turretPivot.position.y = .5;\n  turretMesh.position.z = turretLength * .5;\n  turretPivot.add(turretMesh);\n  bodyMesh.add(turretPivot);\n\n  const turretCamera = makeCamera();\n  turretCamera.position.y = .75 * .2;\n  turretMesh.add(turretCamera);\n\n  const targetGeometry = new THREE.SphereBufferGeometry(.5, 6, 3);\n  const targetMaterial = new THREE.MeshPhongMaterial({color: 0x00FF00, flatShading: true});\n  const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);\n  const targetOrbit = new THREE.Object3D();\n  const targetElevation = new THREE.Object3D();\n  const targetBob = new THREE.Object3D();\n  targetMesh.castShadow = true;\n  scene.add(targetOrbit);\n  targetOrbit.add(targetElevation);\n  targetElevation.position.z = carLength * 2;\n  targetElevation.position.y = 8;\n  targetElevation.add(targetBob);\n  targetBob.add(targetMesh);\n\n  const targetCamera = makeCamera();\n  const targetCameraPivot = new THREE.Object3D();\n  targetCamera.position.y = 1;\n  targetCamera.position.z = -2;\n  targetCamera.rotation.y = Math.PI;\n  targetBob.add(targetCameraPivot);\n  targetCameraPivot.add(targetCamera);\n\n  // Create a sine-like wave\n  const curve = new THREE.SplineCurve( [\n    new THREE.Vector2( -10, 0 ),\n    new THREE.Vector2( -5, 5 ),\n    new THREE.Vector2( 0, 0 ),\n    new THREE.Vector2( 5, -5 ),\n    new THREE.Vector2( 10, 0 ),\n    new THREE.Vector2( 5, 10 ),\n    new THREE.Vector2( -5, 10 ),\n    new THREE.Vector2( -10, -10 ),\n    new THREE.Vector2( -15, -8 ),\n    new THREE.Vector2( -10, 0 ),\n  ] );\n\n  const points = curve.getPoints( 50 );\n  const geometry = new THREE.BufferGeometry().setFromPoints( points );\n  const material = new THREE.LineBasicMaterial( { color : 0xff0000 } );\n  const splineObject = new THREE.Line( geometry, material );\n  splineObject.rotation.x = Math.PI * .5;\n  splineObject.position.y = 0.05;\n  scene.add(splineObject);\n\n  function resizeRendererToDisplaySize(renderer) {\n    const canvas = renderer.domElement;\n    const width = canvas.clientWidth;\n    const height = canvas.clientHeight;\n    const needResize = canvas.width !== width || canvas.height !== height;\n    if (needResize) {\n      renderer.setSize(width, height, false);\n    }\n    return needResize;\n  }\n\n  const targetPosition = new THREE.Vector3();\n  const tankPosition = new THREE.Vector2();\n  const tankTarget = new THREE.Vector2();\n\n  const cameras = [\n    { cam: camera, desc: 'detached camera', },\n    { cam: turretCamera, desc: 'on turret looking at target', },\n    { cam: targetCamera, desc: 'near target looking at tank', },\n    { cam: tankCamera, desc: 'above back of tank', },\n  ];\n\n  const infoElem = document.querySelector('#info');\n\n  function render(time) {\n    time *= 0.001;\n\n    if (resizeRendererToDisplaySize(renderer)) {\n      const canvas = renderer.domElement;\n      cameras.forEach((cameraInfo) => {\n        const camera = cameraInfo.cam;\n        camera.aspect = canvas.clientWidth / canvas.clientHeight;\n        camera.updateProjectionMatrix();\n      });\n    }\n\n    // move target\n    targetOrbit.rotation.y = time * .27;\n    targetBob.position.y = Math.sin(time * 2) * 4;\n    targetMesh.rotation.x = time * 7;\n    targetMesh.rotation.y = time * 13;\n    targetMaterial.emissive.setHSL(time * 10 % 1, 1, .25);\n    targetMaterial.color.setHSL(time * 10 % 1, 1, .25);\n\n    // move tank\n    const tankTime = time * .05;\n    curve.getPointAt(tankTime % 1, tankPosition);\n    curve.getPointAt((tankTime + 0.01) % 1, tankTarget);\n    tank.position.set(tankPosition.x, 0, tankPosition.y);\n    tank.lookAt(tankTarget.x, 0, tankTarget.y);\n\n    // face turret at target\n    targetMesh.getWorldPosition(targetPosition);\n    turretPivot.lookAt(targetPosition);\n\n    // make the turretCamera look at target\n    turretCamera.lookAt(targetPosition);\n\n    // make the targetCameraPivot look at the at the tank\n    tank.getWorldPosition(targetPosition);\n    targetCameraPivot.lookAt(targetPosition);\n\n    wheelMeshes.forEach((obj) => {\n      obj.rotation.x = time * 3;\n    });\n\n    const camera = cameras[time * .25 % cameras.length | 0];\n    infoElem.textContent = camera.desc;\n\n    renderer.render(scene, camera.cam);\n\n    requestAnimationFrame(render);\n  }\n\n  requestAnimationFrame(render);\n}\n\nmain();\n"
    },
    "jsGist.json": {
      "filename": "jsGist.json",
      "type": "application/json",
      "language": "JSON",
      "raw_url": "https://gist.githubusercontent.com/greggman/bad0a8491bd6614e729ff01cc14089c9/raw/ac014ca1eb788c3c05b1612902b142f59fca3f7c/jsGist.json",
      "size": 60,
      "truncated": false,
      "content": "{\"name\":\"ThreeJSFundamentals Scenegraph Tank\",\"settings\":{}}"
    }
  },
  "public": true,
  "created_at": "2020-10-11T08:16:53Z",
  "updated_at": "2020-11-04T17:41:21Z",
  "description": "ThreeJSFundamentals Scenegraph Tank",
  "comments": 9,
  "user": null,
  "comments_url": "https://api.github.com/gists/bad0a8491bd6614e729ff01cc14089c9/comments",
  "owner": {
    "login": "greggman",
    "id": 234804,
    "node_id": "MDQ6VXNlcjIzNDgwNA==",
    "avatar_url": "https://avatars2.githubusercontent.com/u/234804?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/greggman",
    "html_url": "https://github.com/greggman",
    "followers_url": "https://api.github.com/users/greggman/followers",
    "following_url": "https://api.github.com/users/greggman/following{/other_user}",
    "gists_url": "https://api.github.com/users/greggman/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/greggman/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/greggman/subscriptions",
    "organizations_url": "https://api.github.com/users/greggman/orgs",
    "repos_url": "https://api.github.com/users/greggman/repos",
    "events_url": "https://api.github.com/users/greggman/events{/privacy}",
    "received_events_url": "https://api.github.com/users/greggman/received_events",
    "type": "User",
    "site_admin": false
  },
  "forks": [

  ],
  "history": [
    {
      "user": {
        "login": "greggman",
        "id": 234804,
        "node_id": "MDQ6VXNlcjIzNDgwNA==",
        "avatar_url": "https://avatars2.githubusercontent.com/u/234804?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/greggman",
        "html_url": "https://github.com/greggman",
        "followers_url": "https://api.github.com/users/greggman/followers",
        "following_url": "https://api.github.com/users/greggman/following{/other_user}",
        "gists_url": "https://api.github.com/users/greggman/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/greggman/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/greggman/subscriptions",
        "organizations_url": "https://api.github.com/users/greggman/orgs",
        "repos_url": "https://api.github.com/users/greggman/repos",
        "events_url": "https://api.github.com/users/greggman/events{/privacy}",
        "received_events_url": "https://api.github.com/users/greggman/received_events",
        "type": "User",
        "site_admin": false
      },
      "version": "fcbedffeccec982c99bc3963ed77f41762a8dd5a",
      "committed_at": "2020-10-17T02:08:28Z",
      "change_status": {
        "total": 4,
        "additions": 2,
        "deletions": 2
      },
      "url": "https://api.github.com/gists/bad0a8491bd6614e729ff01cc14089c9/fcbedffeccec982c99bc3963ed77f41762a8dd5a"
    },
    {
      "user": {
        "login": "greggman",
        "id": 234804,
        "node_id": "MDQ6VXNlcjIzNDgwNA==",
        "avatar_url": "https://avatars2.githubusercontent.com/u/234804?v=4",
        "gravatar_id": "",
        "url": "https://api.github.com/users/greggman",
        "html_url": "https://github.com/greggman",
        "followers_url": "https://api.github.com/users/greggman/followers",
        "following_url": "https://api.github.com/users/greggman/following{/other_user}",
        "gists_url": "https://api.github.com/users/greggman/gists{/gist_id}",
        "starred_url": "https://api.github.com/users/greggman/starred{/owner}{/repo}",
        "subscriptions_url": "https://api.github.com/users/greggman/subscriptions",
        "organizations_url": "https://api.github.com/users/greggman/orgs",
        "repos_url": "https://api.github.com/users/greggman/repos",
        "events_url": "https://api.github.com/users/greggman/events{/privacy}",
        "received_events_url": "https://api.github.com/users/greggman/received_events",
        "type": "User",
        "site_admin": false
      },
      "version": "16bda36d8000991414a7240edaf7f5aa709183af",
      "committed_at": "2020-10-11T08:16:53Z",
      "change_status": {
        "total": 273,
        "additions": 273,
        "deletions": 0
      },
      "url": "https://api.github.com/gists/bad0a8491bd6614e729ff01cc14089c9/16bda36d8000991414a7240edaf7f5aa709183af"
    }
  ],
  "truncated": false
}
*/
export async function getAnonGist(gist_id) {
  const req = await fetch(`https://api.github.com/gists/${gist_id}`);
  const gist = await req.json();
  return {
    data: getGistContent(gist),
    rawData: gist,
  };
}

export function getUserData(data) {
  return (data && data.owner)
      ? {
          name: data.owner.login,
          avatarURL: data.owner.avatar_url,
      }
      : undefined;
}

function createGistData(data, secret, gist_id) {
  let files = data.files.reduce((files, file) => {
    files[file.name] = {
      content: file.content.trim() ? file.content : `${emptyValue}${file.content}`,
    };
    return files;
  }, {});
  const saveData = {
    ...data,
  };
  /*
  // we can't add a readme because we don't know the gist_id. I guess we would double
  // save? create then update?

  const lowerCaseFiles = Object.keys(files).map(n => n.toLowerCase());
  const hadReadme = 
      lowerCaseFiles.includes('readme.md') ||
      lowerCaseFiles.includes('readme.txt') ||
      lowerCaseFiles.includes('readme');
  if (!hadReadme) {
    files['README.md'] = `# ${data.name}\n\n[jsGist Link](${window.location.origin}?src=${})`
  }
  */
  const jsGistData = {}
  files['jsGist.json'] = jsGistData;
  const noDuplicateNames = Object.keys(files).length === data.files.length + 1;
  if (noDuplicateNames) {
    delete saveData.files;
    saveData.filenames = data.files.map(({name}) => name);
  } else {
    // save the files in the json
    files = {
      'jsGist.json': jsGistData,
    };
  }
  jsGistData.content = JSON.stringify(saveData);
  if (gist_id) {
    // if we have a gist_id this is an update
    // updates need filenames (which allows renaming)
    for (const [filename, file] of Object.entries(files)) {
      file.filename = filename;
    }
  }
  return {
    files,
    description: data.name,
    ...(!gist_id && {public: !secret}),
    ...(gist_id && {gist_id}),
  };
}

export default class GitHub extends EventTarget {
  constructor() {
    super();
    this.pat = '';
    this.user = {};
    this.unAuthorizedOctokit = new Octokit({
      userAgent,
    });
  }
  get octokit() {
    return this.authorizedOctokit || this.unAuthorizedOctokit;
  }
  // TODO: this does not belong here!
  _updateUserData(data) {
    const userData = getUserData(data);
    if (userData) {
      Object.assign(this.user, userData);
      const event = new Event('userdata');
      event.data = {...this.user};
      this.dispatchEvent(event);
    }
  }
  setPat(pat) {
    if (pat !== this.pat) {
      this.pat = pat;
      if (pat) {
        this.authorizedOctokit = new Octokit({
          auth: pat,
          userAgent,
        });
      } else {
        this.authorizedOctokit = undefined;
      }
    }
  }
  /*
  "{
    "login": "greggman",
    "id": 234804,
    "node_id": "MDQ6VXNlcjIzNDgwNA==",
    "avatar_url": "https://avatars2.githubusercontent.com/u/234804?v=4",
    "gravatar_id": "",
    "url": "https://api.github.com/users/greggman",
    "html_url": "https://github.com/greggman",
    "followers_url": "https://api.github.com/users/greggman/followers",
    "following_url": "https://api.github.com/users/greggman/following{/other_user}",
    "gists_url": "https://api.github.com/users/greggman/gists{/gist_id}",
    "starred_url": "https://api.github.com/users/greggman/starred{/owner}{/repo}",
    "subscriptions_url": "https://api.github.com/users/greggman/subscriptions",
    "organizations_url": "https://api.github.com/users/greggman/orgs",
    "repos_url": "https://api.github.com/users/greggman/repos",
    "events_url": "https://api.github.com/users/greggman/events{/privacy}",
    "received_events_url": "https://api.github.com/users/greggman/received_events",
    "type": "User",
    "site_admin": false,
    "name": "Greggman",
    "company": null,
    "blog": "http://games.greggman.com",
    "location": "Earth",
    "email": "github@greggman.com",
    "hireable": null,
    "bio": "30 years of games\r\n5 years of Chrome",
    "twitter_username": null,
    "public_repos": 283,
    "public_gists": 79,
    "followers": 1037,
    "following": 3,
    "created_at": "2010-04-01T08:48:05Z",
    "updated_at": "2020-10-24T06:05:24Z"
  }"
  */
  async getAuthenticatedUser() {
    const response = await this.authorizedOctokit.users.getAuthenticated();
    if (response.status !== 200) {
      throw new Error(response.message);
    }
    return response.data;
  }

  async getUserGists() {
    const gists = await this.authorizedOctokit.paginate(this.authorizedOctokit.gists.list);
    return gists.filter(gist => !!gist.files['jsGist.json']);
    // return await this.authorizedOctokit.gists.list();
  }

  async getGist(gist_id) {
    const octokit = this.authorizedOctokit || this.octokit;
    const gist = await octokit.gists.get({gist_id});
    return {
      data: getGistContent(gist.data),
      rawData: gist.data,
    };
  }

  async createGist(data, secret = false) {
    const gistData = createGistData(data, secret);
    const gist = await this.authorizedOctokit.gists.create(gistData);
    this._updateUserData(gist.data);
    return {
      id: gist.data.id,
      name: gist.data.description,
      date: gist.data.updated_at,
      public: gist.data.public,
    };
  }
  async updateGist(gist_id, data) {
    const gistData = createGistData(data, false, gist_id);
    const gist = await this.authorizedOctokit.gists.update(gistData);
    return {
      id: gist.data.id,
      name: gist.data.description,
      date: gist.data.updated_at,
      public: gist.data.public,
    };
  }
  async forkGist(gist_id) {
    const gist = await this.authorizedOctokit.gists.fork({gist_id});
    return {
      id: gist.data.id
    };
  }

  async createGistComment(gist_id, body) {
    const result = await this.authorizedOctokit.gists.createComment({
      gist_id,
      body,
    });
    if (result.status < 200 || result.status >= 300) {
      throw new Error(result.message);
    }
    return result.data;
  }
}

