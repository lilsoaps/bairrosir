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

var selectedObjectScale;
var isSelected = false;

var windowWidth = window.innerWidth;
blockedWidth = windowWidth - 245;

function onDocumentMouseDown(event) {
    switch (event.button) {
        case 0: //left
            var mouse = new THREE.Vector2();
            mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
            if (event.clientX < blockedWidth) {
                raycaster.setFromCamera(mouse, camera);

                var intersects = raycaster.intersectObjects(scene.children, false);

                if (intersects.length > 0) {
                    if ((intersects[0].object.name == "building") && (!isSelected)) {
                        selectedObject = intersects[0].object;

                        if (selectedObject.material.color[0] === NaN) {
                            selectedObjectColor = [255, 0, 255];
                        } else {
                            selectedObjectColor = [selectedObject.material.color.r * 255, selectedObject.material.color.g * 255, selectedObject.material.color.b * 255];
                        }

                        selectedObjectScale = selectedObject.scale.y;
                        isSelected = true;
                        selectCheck();
                    }
                    if ((intersects[0].object.name != "building") && (isSelected)) {

                        isSelected = false;

                        if (buildingFolder !== null) {
                            buildingFolder.remove(scalePicker);
                        }
                    }
                }
            }
            break;
        case 1: //middle
            break;
        case 2: //right
            var mouse = new THREE.Vector2();
            mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
            mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

            if (isSelected) {
                isSelected = false;

                if (buildingFolder !== null) {
                    buildingFolder.remove(scalePicker);
                }
            }
            break;
    }
}

document.addEventListener('mousedown', onDocumentMouseDown, false);


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