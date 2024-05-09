//setup the scene
var scene = new THREE.Scene();
var ratio = window.innerWidth / window.innerHeight;

var camera = new THREE.PerspectiveCamera(80, ratio, 4, 50000);

var velocity = new THREE.Vector3();
var direction = new THREE.Vector3();
var prevTime = performance.now();

var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var moveUp = false;
var moveDown = false;
var firstPersonMode = false;

//set the camera position
var Pos = new THREE.Vector3(-360, 700, 360);
camera.position.set(Pos.x, Pos.y, Pos.z);

// and the direction
var Dir = new THREE.Vector3(0, 0, 0);
camera.lookAt(Dir.x, Dir.y, Dir.z);

//create the webgl renderer
var renderer = new THREE.WebGLRenderer();

//set the size of the rendering window
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//add the renderer to the current document
document.body.appendChild(renderer.domElement);

//Lighting Settings
var ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.3);
var light = new THREE.DirectionalLight(0xFFFFFF, 0.5);
light.position.y = 1000;
light.position.x = 500;
light.position.z = 500;
light.target.position.set(0, 0, 0);
light.castShadow = true;
light.shadow.camera.left = -2000;
light.shadow.camera.right = 2000;
light.shadow.camera.top = 2000;
light.shadow.camera.bottom = -2000;
light.shadow.camera.far = 4000;
var helper = new THREE.CameraHelper(light.shadow.camera);

//Skybox
var r1 = "./assets/skybox/1/";
var urls1 = [r1 + "graycloud_ft.jpg", r1 + "graycloud_bk.jpg", r1 + "graycloud_up.jpg", r1 + "graycloud_dn.jpg", r1 + "graycloud_rt.jpg", r1 + "graycloud_lf.jpg"];

var textureCube1 = new THREE.CubeTextureLoader().load(urls1);
scene.background = textureCube1;


var TextureL1 = new THREE.TextureLoader().load("./assets/img-ground/3.jpg");
TextureL1.wrapS = TextureL1.wrapT = THREE.RepeatWrapping;
TextureL1.repeat.set(350, 350);

var baseMaterial = new THREE.MeshPhongMaterial({
    map: TextureL1,
    side: THREE.DoubleSide
});

var baseGeometry = new THREE.PlaneGeometry(20000, 20000);
var baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
baseMesh.rotation.set(Math.PI / 2, 0, 0);
baseMesh.receiveShadow = true;
baseMesh.castShadow = false;
scene.add(baseMesh);

document.getElementById("info-panel").addEventListener("click", function () {
    var infoBtn = document.getElementById("info-btn");
    var infoContent = document.getElementById("info-content");
    if (infoContent.style.display === "none") {
        infoContent.style.display = "block";
        infoBtn.innerHTML = "[hide]";
    } else {
        infoContent.style.display = "none";
        infoBtn.innerHTML = "[show]";
    }
});