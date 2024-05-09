//Controls
var moveSpeed = 10;
keyboardControls = new THREE.PointerLockControls(camera);
controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0;
controls.dampingFactor = 1.5;
camera.position = Pos;
camera.lookAt(Dir);

keyboardControls.enabled = false;
scene.add(keyboardControls.getObject());

var raycaster = new THREE.Raycaster();
var selectedObject = new THREE.Mesh();
selected_building = selectedObject.name;
var selectedObjectColor = new THREE.Color();
var selectedObjectScale;
var isSelected = false;

var windowWidth = window.innerWidth;
blockedWidth = windowWidth - 245;


var onKeyDown = function (event) {
    switch (event.keyCode) {
        case 38: // forward
        case 87: // w
            moveForward = true;
            break;

        case 37: // left
        case 65: // a
            moveLeft = true;
            break;

        case 40: // backward
        case 83: // s
            moveBackward = true;
            break;

        case 39: // right
        case 68: // d
            moveRight = true;
            break;

            // down
        case 16: // shift
            moveDown = true;
            break;

            // up 
        case 32: // space
            moveUp = true;
            break;
    }
};

var onKeyUp = function (event) {
    switch (event.keyCode) {
        case 38: // forward
        case 87: // w
            moveForward = false;
            break;

        case 37: // left
        case 65: // a
            moveLeft = false;
            break;

        case 40: // backward
        case 83: // s
            moveBackward = false;
            break;

        case 39: // right
        case 68: // d
            moveRight = false;
            break;

            // down
        case 16: // shift
            moveDown = false;
            break;

            // up 
        case 32: // space
            moveUp = false;
            break;
    }
};

document.addEventListener('keydown', onKeyDown, false);
document.addEventListener('keyup', onKeyUp, false);