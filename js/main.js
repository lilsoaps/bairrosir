import * as THREE from 'three';
import * as TAPERED from './tapered.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Create a scene
var scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb); // Set daytime background color

// Create a camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(20, 20, 40); // Adjust camera position
camera.lookAt(scene.position);

// Create a renderer with shadows enabled
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadow mapping
document.body.appendChild(renderer.domElement);

// Add ambient light
var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4); // Cooler ambient light
scene.add(ambientLight);

// Add directional lights for sunlight
var directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight1.position.set(30, 25, 25); // Sunlight from the side
directionalLight1.castShadow = true; // Enable shadow casting
scene.add(directionalLight1);

var directionalLight2 = new THREE.DirectionalLight(0xccccff, 0.3); // Soft blue light
directionalLight2.position.set(-5, 5, 10);
scene.add(directionalLight2);

// Configure shadow properties for directional lights
directionalLight1.shadow.mapSize.width = 1024; // Shadow map width
directionalLight1.shadow.mapSize.height = 1024; // Shadow map height
directionalLight1.shadow.camera.near = 0.5; // Shadow camera near plane
directionalLight1.shadow.camera.far = 500; // Shadow camera far plane
directionalLight1.shadow.camera.left = -50; // Shadow camera left boundary
directionalLight1.shadow.camera.right = 50; // Shadow camera right boundary
directionalLight1.shadow.camera.top = 50; // Shadow camera top boundary
directionalLight1.shadow.camera.bottom = -50; // Shadow camera bottom boundary

directionalLight2.shadow.mapSize.width = 1024; // Shadow map width
directionalLight2.shadow.mapSize.height = 1024; // Shadow map height
directionalLight2.shadow.camera.near = 0.5; // Shadow camera near plane
directionalLight2.shadow.camera.far = 500; // Shadow camera far plane
directionalLight2.shadow.camera.left = -50; // Shadow camera left boundary
directionalLight2.shadow.camera.right = 50; // Shadow camera right boundary
directionalLight2.shadow.camera.top = 50; // Shadow camera top boundary
directionalLight2.shadow.camera.bottom = -50; // Shadow camera bottom boundary

// Add event listeners for day and night buttons
document.getElementById('dayButton').addEventListener("click", function () {
    scene.background = new THREE.Color(0x87ceeb); // Set daytime background color
    directionalLight1.intensity = 0.8; // Reset directional light intensity
    directionalLight2.intensity = 0.3; // Reset directional light intensity
    directionalLight2.color.setHex(0xccccff); // Reset directional light color
    renderer.render(scene, camera);
});

document.getElementById('nightButton').addEventListener("click", function () {
    scene.background = new THREE.Color(0x000000); // Set nighttime background color
    directionalLight1.intensity = 0.2; // Decrease directional light intensity for night
    directionalLight2.intensity = 0.1; // Decrease directional light intensity for night
    directionalLight2.color.setHex(0x0000ff); // Set directional light color to blue for night
    for (var i = 0; i < lamps.length; i++) {
        if (lamps[i].type === 'PointLight') {
            lamps[i].intensity = 0.5; // Decrease lamp intensity for night
        }
    }
    renderer.render(scene, camera);
});

// create a bigger ground plane with shadows
var planeGeometry = new THREE.PlaneGeometry(200, 200);
var planeMaterial = new THREE.ShadowMaterial({ opacity: 0.5 }); // Material for receiving shadows
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, 0, 0);
plane.receiveShadow = true; // Enable shadow receiving
scene.add(plane);


// create a bigger ground plane
var planeGeometry = new THREE.PlaneGeometry(200, 200); // Larger plane size
var planeMaterial = new THREE.MeshLambertMaterial({ color: 0x999999 });
var plane = new THREE.Mesh(planeGeometry, planeMaterial);

plane.rotation.x = -0.5 * Math.PI;
plane.position.set(0, 0, 0);
scene.add(plane);




// Define parameters for the skyscraper
const position = new THREE.Vector3(75, 5, -75);
const baseWidth = 50;
const topWidth = 10;
const height = 100;
const numFloors = 10;
const numWindowsPerFloor = 5;

// Create the skyscraper
const skyscraper = TAPERED.createTaperedSkyscraper(position, baseWidth, topWidth, height, numFloors, numWindowsPerFloor);

// Add the skyscraper to the scene
scene.add(skyscraper);

function createSupermarket(x, y, z, width, height, depth) {
    // Main building geometry
    var buildingGeometry = new THREE.BoxGeometry(width, height, depth);

    // Main building material
    var buildingMaterial = new THREE.MeshLambertMaterial({ color: 0xf9f9f9 }); // Light gray color

    // Main building mesh
    var building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(x, y + height / 2, z);
    scene.add(building);

    // Roof geometry
    var roofGeometry = new THREE.BoxGeometry(width + 1, 2, depth + 1);
    // Roof material
    var roofMaterial = new THREE.MeshLambertMaterial({ color: 0x9e9e9e }); // Dark gray color
    // Roof mesh
    var roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(x, y + height + 1, z);
    scene.add(roof);

    // Windows
    var windowWidth = width / 5;
    var windowHeight = height / 3;
    var windowDepth = 0.1;
    var windowColor = 0xadd8e6; // Light blue color
    var numWindows = 4;
    for (var i = 0; i < numWindows; i++) {
        var windowGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth);
        var windowMaterial = new THREE.MeshLambertMaterial({ color: windowColor });
        var windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set(
            x + (i - numWindows / 2 + 0.5) * (width / (numWindows + 1)),
            y + height / 2,
            z + depth / 2 + windowDepth / 2
        );
        scene.add(windowMesh);
    }

    // Door
    var doorWidth = width / 4;
    var doorHeight = height / 2;
    var doorDepth = 0.2;
    var doorColor = 0x8b4513; // Brown color
    var doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, doorDepth);
    var doorMaterial = new THREE.MeshLambertMaterial({ color: doorColor });
    var doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
    doorMesh.position.set(x, y + doorHeight / 2, z + depth / 2 + doorDepth / 2);
    scene.add(doorMesh);



}

// Call the function to create a supermarket with a parking lot
createSupermarket(0, 0, -90, 40, 10, 20);

function createParkingLot(x, y, z, width, depth, numSpaces) {
    // Define materials
    var groundTexture = new THREE.TextureLoader().load('textures/parking_ground.jpg'); // Texture for ground
    var groundMaterial = new THREE.MeshLambertMaterial({ map: groundTexture });

    var spaceMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }); // White for parking spaces
    var markingMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff }); // White for markings

    // Create ground plane
    var groundGeometry = new THREE.PlaneGeometry(width, depth);
    var ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(x, y, z);
    scene.add(ground);

    // Calculate parking space dimensions and spacing
    var spaceWidth = width / numSpaces;
    var spaceDepth = depth / 10;
    var spaceHeight = 0.1;
    var spaceSpacing = spaceWidth / 10;

    // Create parking spaces
    for (var i = 0; i < numSpaces; i++) {
        var spaceX = x + (i - numSpaces / 2 + 0.5) * spaceWidth + spaceSpacing;
        var spaceZ = z + depth / 2 - spaceDepth / 2;

        var spaceGeometry = new THREE.BoxGeometry(spaceWidth - spaceSpacing * 2, spaceHeight, spaceDepth);
        var spaceMesh = new THREE.Mesh(spaceGeometry, spaceMaterial);
        spaceMesh.position.set(spaceX, y + spaceHeight / 2, spaceZ);
        scene.add(spaceMesh);
    }

    // Add parking space markings
    // Define marking dimensions
    var markingWidth = spaceWidth / 10;
    var markingHeight = spaceHeight;
    var markingDepth = 10;

    // Create markings between spaces
    for (var i = 1; i < numSpaces; i++) {
        var markingX = x + (i - numSpaces / 2) * spaceWidth;
        var markingZ = z + depth / 2 - markingDepth / 2;

        var markingGeometry = new THREE.BoxGeometry(markingWidth, markingHeight, markingDepth);
        var markingMesh = new THREE.Mesh(markingGeometry, markingMaterial);
        markingMesh.position.set(markingX, y + markingHeight / 2, markingZ);
        scene.add(markingMesh);
    }



}

// Call the function to create a better parking lot
createParkingLot(0, 0.1, -60, 50, 30, 10);

//function for a clock tower
function createClockTower(x, y, z, width, height, depth) {
    // Create the main building
    var buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    var buildingMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Gray building
    var building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(x, y + height / 2, z);
    scene.add(building);

    // Create a roof for the building
    var roofGeometry = new THREE.BoxGeometry(width, 2, depth);
    var roofMaterial = new THREE.MeshLambertMaterial({ color: 0x9e9e9e }); // Dark gray roof
    var roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(x, y + height + 1, z);
    scene.add(roof);

    //quadrangular pyramid

    var pyramidGeometry = new THREE.CylinderGeometry(0, 8, 15, 4, 1);
    var pyramidMaterial = new THREE.MeshLambertMaterial({ color: 0x9e9e9e }); // Dark gray roof
    var pyramid = new THREE.Mesh(pyramidGeometry, pyramidMaterial);
    pyramid.position.set(x, y + height + 9, z);
    pyramid.rotation.y = Math.PI / 4; // Rotate to face forward
    scene.add(pyramid);


    // Create a clock face
    var clockGeometry = new THREE.CylinderGeometry(5, 5, 0.5, 16);
    var clockMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 }); // Yellow clock face
    var clock = new THREE.Mesh(clockGeometry, clockMaterial);
    clock.position.set(x, y + height / 1.5, z + depth / 2 + 0.5);
    clock.rotation.x = Math.PI / 2; // Rotate to face forward
    scene.add(clock);


    // Create clock hands
    var hourHandGeometry = new THREE.BoxGeometry(0.5, 5, 0.7);
    var minuteHandGeometry = new THREE.BoxGeometry(0.3, 7, 0.6);
    var handMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 }); // Black hands

    var hourHand = new THREE.Mesh(hourHandGeometry, handMaterial);
    hourHand.position.set(x, y + height / 1.5, z + depth / 2 + 1);

    var minuteHand = new THREE.Mesh(minuteHandGeometry, handMaterial);
    minuteHand.rotation.z = Math.PI / 4; // Rotate to face forward
    minuteHand.position.set(x, y + height / 1.5, z + depth / 2 + 1);


    scene.add(hourHand);
    scene.add(minuteHand);


}

// Call the function to create a clock tower

createClockTower(-75, 0.1, -75, 12, 50, 12);

// Function to add cars to the parking lot
function addCarsToParkingLot() {
    // Example: Add cars to the first few parking spaces
    for (var i = 0; i < 3; i++) {
        var car = createCar(-22 + i * 5, 0.5, -50);
        scene.add(car);
    }

}

// Call the function to add cars to the parking lot
addCarsToParkingLot();

// function for a retangular skyscraper
function createRectangularSkyscraper(x, y, z, width, height, depth) {
    // Create the main building
    var buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    var buildingMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Gray building
    var building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(x, y + height / 2, z);
    scene.add(building);


    // Create a roof for the building
    var roofGeometry = new THREE.BoxGeometry(width + 1, 2, depth + 1);
    var roofMaterial = new THREE.MeshLambertMaterial({ color: 0x9e9e9e }); // Dark gray roof
    var roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(x, y + height + 1, z);
    scene.add(roof);

    // Create  a grid for the windows
    var numWindowsWidth = 5;
    var numWindowsHeight = 5;
    var windowWidth = width / (numWindowsWidth + 1);
    var windowHeight = height / (numWindowsHeight + 1);
    var windowDepth = 0.1;
    var windowColor = 0xadd8e6; // Light blue windows

    // Create windows for the building more above 

    for (var i = 0; i < numWindowsWidth; i++) {
        for (var j = 0; j < numWindowsHeight; j++) {
            var windowGeometry = new THREE.BoxGeometry(windowWidth - 0.1, windowHeight - 0.1, windowDepth);
            var windowMaterial = new THREE.MeshLambertMaterial({ color: windowColor });
            var windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
            windowMesh.position.set(
                x + (i - numWindowsWidth / 2 + 0.5) * windowWidth,
                y + (j - numWindowsHeight / 2 + 0.5) * windowHeight + height / 2,
                z + depth / 2 + windowDepth / 2
            );
            scene.add(windowMesh);
        }
    }
    for (var i = 0; i < numWindowsWidth; i++) {
        for (var j = 0; j < numWindowsHeight; j++) {
            var windowGeometry = new THREE.BoxGeometry(windowWidth - 0.1, windowHeight - 0.1, windowDepth);
            var windowMaterial = new THREE.MeshLambertMaterial({ color: windowColor });
            var windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
            windowMesh.position.set(
                x + (i - numWindowsWidth / 2 + 0.5) * windowWidth,
                y + (j - numWindowsHeight / 2 + 0.5) * windowHeight + height / 2,
                z - depth / 2 - windowDepth / 2
            );
            scene.add(windowMesh);
        }
    }
    for (var i = 0; i < numWindowsWidth; i++) {
        for (var j = 0; j < numWindowsHeight; j++) {
            var windowGeometry = new THREE.BoxGeometry(windowWidth - 0.1, windowHeight - 0.1, windowDepth);
            var windowMaterial = new THREE.MeshLambertMaterial({ color: windowColor });
            var windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
            windowMesh.position.set(
                x + width / 2 + windowDepth / 2,
                y + (j - numWindowsHeight / 2 + 0.5) * windowHeight + height / 2,
                z + (i - numWindowsWidth / 2 + 0.5) * windowWidth
            );
            windowMesh.rotation.y = Math.PI / 2;
            scene.add(windowMesh);
        }
    }
    for (var i = 0; i < numWindowsWidth; i++) {
        for (var j = 0; j < numWindowsHeight; j++) {
            var windowGeometry = new THREE.BoxGeometry(windowWidth - 0.1, windowHeight - 0.1, windowDepth);
            var windowMaterial = new THREE.MeshLambertMaterial({ color: windowColor });
            var windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
            windowMesh.position.set(
                x - width / 2 - windowDepth / 2,
                y + (j - numWindowsHeight / 2 + 0.5) * windowHeight + height / 2,
                z + (i - numWindowsWidth / 2 + 0.5) * windowWidth
            );
            windowMesh.rotation.y = Math.PI / 2;
            scene.add(windowMesh);
        }
    }



}

// Call the function to create a rectangular skyscraper
createRectangularSkyscraper(-70, 0.1, 70, 40, 100, 40, 4);
createRectangularSkyscraper(-75, 0.1, 0, 40, 100, 40, 4);

//function for a house with garage
function createHouse(x, y, z, width, height, depth) {
    // Create the main building
    var buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    var buildingMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // Brown building
    var building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(x, y + height / 2, z);
    scene.add(building);

    // Create a roof for the building
    var roofGeometry = new THREE.ConeGeometry(width / 2, 10, 4);
    var roofMaterial = new THREE.MeshLambertMaterial({ color: 0x9e9e9e }); // Dark gray roof
    var roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(x, y + height + 5, z);
    scene.add(roof);

    // Create a garage
    var garageWidth = width / 2;
    var garageHeight = height / 2;
    var garageDepth = depth / 2;
    var garageGeometry = new THREE.BoxGeometry(garageWidth, garageHeight, garageDepth);
    var garageMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // Brown garage
    var garage = new THREE.Mesh(garageGeometry, garageMaterial);
    garage.position.set(x + width / 4, y + garageHeight / 2, z + depth / 2 + garageDepth / 2);
    scene.add(garage);

    // Create a door for the garage
    var doorWidth = garageWidth / 2;
    var doorHeight = garageHeight / 2;
    var doorDepth = 0.2;
    var doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, doorDepth);
    var doorMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 }); // Black door
    var door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(x + width / 4, y + doorHeight / 2, z + depth / 2 + garageDepth + doorDepth / 2);
    scene.add(door);

    // Create windows for the building
    var windowWidth = width / 5;
    var windowHeight = height / 3
    var windowDepth = 0.1;
    var windowColor = 0xadd8e6; // Light blue windows
    var numWindows = 4;
    for (var i = 0; i < numWindows; i++) {
        var windowGeometry = new THREE.BoxGeometry(windowWidth - 0.1, windowHeight - 0.1, windowDepth);
        var windowMaterial = new THREE.MeshLambertMaterial({ color: windowColor });
        var windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set(
            x + (i - numWindows / 2 + 0.5) * (width / (numWindows + 1)),
            y + height / 2,
            z + depth / 2 + windowDepth / 2
        );
        scene.add(windowMesh);
    }


}

// Call the function to create a house with a garage
createHouse(62, 0.1, 8, 20, 20, 20);
createHouse(88, 0.1, 8, 20, 20, 20);

function createHouseWithGarageRotated(x, y, z, width, height, depth) {
    // Create the main building
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
    const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // Brown building
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(x, y + height / 2, z);
    building.rotation.y = Math.PI; // Rotate 180 degrees
    scene.add(building);

    // Create a roof for the building
    const roofGeometry = new THREE.ConeGeometry(width / 2, 10, 4);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x9e9e9e }); // Dark gray roof
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(x, y + height + 5, z);
    roof.rotation.y = Math.PI; // Rotate 180 degrees
    scene.add(roof);

    // Create a garage
    const garageWidth = width / 2;
    const garageHeight = height / 2;
    const garageDepth = depth / 2;
    const garageGeometry = new THREE.BoxGeometry(garageWidth, garageHeight, garageDepth);
    const garageMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // Brown garage
    const garage = new THREE.Mesh(garageGeometry, garageMaterial);
    garage.position.set(x - width / 4, y + garageHeight / 2, z - depth / 2 - garageDepth / 2); // Adjust position for rotation
    garage.rotation.y = Math.PI; // Rotate 180 degrees
    scene.add(garage);

    // Create a door for the garage
    const doorWidth = garageWidth / 2;
    const doorHeight = garageHeight / 2;
    const doorDepth = 0.2;
    const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, doorDepth);
    const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 }); // Black door
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(x - width / 4, y + doorHeight / 2, z - depth / 2 - garageDepth - doorDepth / 2); // Adjust position for rotation
    door.rotation.y = Math.PI; // Rotate 180 degrees
    scene.add(door);

    // Create windows for the building
    const windowWidth = width / 5;
    const windowHeight = height / 3;
    const windowDepth = 0.1;
    const windowColor = 0xadd8e6; // Light blue windows
    const numWindows = 4;
    for (let i = 0; i < numWindows; i++) {
        const windowGeometry = new THREE.BoxGeometry(windowWidth - 0.1, windowHeight - 0.1, windowDepth);
        const windowMaterial = new THREE.MeshLambertMaterial({ color: windowColor });
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set(
            x - (i - numWindows / 2 + 0.5) * (width / (numWindows + 1)), // Adjust position for rotation
            y + height / 2,
            z - depth / 2 - windowDepth / 2 // Adjust position for rotation
        );
        windowMesh.rotation.y = Math.PI; // Rotate 180 degrees
        scene.add(windowMesh);
    }

}

// Call the function to create houses with garages rotated
createHouseWithGarageRotated(62, 0.1, -8, 20, 20, 20);
createHouseWithGarageRotated(88, 0.1, -8, 20, 20, 20);


// Create a function to generate a road 
function createRoad(x, y, z, width, height, depth, color) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshLambertMaterial({ color: color });
    var road = new THREE.Mesh(geometry, material);
    road.position.set(x, y, z);
    scene.add(road);

}

// Create a function to generate a road 
function createRoad1(x, y, z, width, height, depth, color) {
    var geometry = new THREE.BoxGeometry(width, height, depth);
    var material = new THREE.MeshLambertMaterial({ color: color });
    var road = new THREE.Mesh(geometry, material);
    road.position.set(x, y, z);
    scene.add(road);



}

// Define road parameters
var roadParams = [
    { x: 0, y: 0, z: 33, width: 200, height: 0.11, depth: 10, color: 0x333333 },
    { x: 0, y: 0, z: -33, width: 200, height: 0.11, depth: 10, color: 0x333333 },
];

var road1Params = [
    { x: 33, y: 0, z: 0, width: 10, height: 0.12, depth: 200, color: 0x333333 },
    { x: -33, y: 0, z: 0, width: 10, height: 0.12, depth: 200, color: 0x333333 },
];

// Create the road 
for (var i = 0; i < roadParams.length; i++) {
    var params = roadParams[i];
    createRoad(params.x, params.y, params.z, params.width, params.height, params.depth, params.color);
}

for (var i = 0; i < road1Params.length; i++) {
    var params = road1Params[i];
    createRoad1(params.x, params.y, params.z, params.width, params.height, params.depth, params.color);
}

function createParkScene(x, y, z, width, depth) {
    // Ground for the park
    var parkGroundGeometry = new THREE.PlaneGeometry(width, depth);
    var parkGroundMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 }); // Green grass
    var parkGround = new THREE.Mesh(parkGroundGeometry, parkGroundMaterial);
    parkGround.rotation.x = -Math.PI / 2;
    parkGround.position.set(x, y, z); // Place the park in the center
    //shadow
    scene.add(parkGround);

    // Trees
    function createTree(x, y, z, scale) {
        var trunkGeometry = new THREE.CylinderGeometry(1, 1, scale, 8);
        var trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x886600 }); // Brown trunk
        var trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, y + scale / 2, z);

        var sphereGeometry = new THREE.SphereGeometry(scale * 1, 16, 16);
        var sphereMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 }); // Green leaves
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(x, y + scale + scale * 1.5 / 2, z);



        var tree = new THREE.Object3D();
        tree.add(trunk);
        tree.add(sphere);
        scene.add(tree);
    }

    createTree(x - width / 4, 0, z + depth / 4, 5);
    createTree(x - width / 4, 0, z - depth / 4, 5);
    createTree(x + width / 4, 0, z + depth / 4, 5);
    createTree(x + width / 4, 0, z - depth / 4, 5);

    // Park benches close to the fountain
    function createParkBench(x, y, z) {
        var benchGeometry = new THREE.BoxGeometry(2, 0.5, 0.5);
        var benchMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // Brown bench
        var bench = new THREE.Mesh(benchGeometry, benchMaterial);
        bench.position.set(x, y, z);
        bench.rotation.y = Math.PI / 4; // Rotate the bench
        scene.add(bench);

        var benchLegGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8);
        var benchLegMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 }); // Brown bench legs
    }

    createParkBench(x - 5, 0.25, z - 5);
    createParkBench(x + 5, 0.25, z + 5);


    // Stone ground for the fountain
    var stoneGroundGeometry = new THREE.CircleGeometry(5, 32);
    var stoneGroundMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 }); // Dark gray
    var stoneGround = new THREE.Mesh(stoneGroundGeometry, stoneGroundMaterial);
    stoneGround.rotation.x = -Math.PI / 2;
    stoneGround.position.set(x, 0.2, z); // Place the park in the center at a slight height
    scene.add(stoneGround);

    // Fountain base
    var fountainBaseGeometry = new THREE.CylinderGeometry(3, 3, 1, 16);
    var fountainBaseMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 }); // Dark gray
    var fountainBase = new THREE.Mesh(fountainBaseGeometry, fountainBaseMaterial);
    fountainBase.position.set(x, 0.5, z);
    scene.add(fountainBase);

    // Fountain water
    var fountainWaterGeometry = new THREE.CylinderGeometry(2.5, 2.5, 0.5, 16);
    var fountainWaterMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff }); // Blue water
    var fountainWater = new THREE.Mesh(fountainWaterGeometry, fountainWaterMaterial);
    fountainWater.position.set(x, 1, z);
    scene.add(fountainWater);

    // Fountain top
    var fountainTopGeometry = new THREE.CylinderGeometry(2, 2, 1, 16);
    var fountainTopMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 }); // Dark gray
    var fountainTop = new THREE.Mesh(fountainTopGeometry, fountainTopMaterial);
    fountainTop.position.set(x, 1.5, z);
    scene.add(fountainTop);

    // Fountain water spout
    var fountainSpoutGeometry = new THREE.CylinderGeometry(0.5, 0.5, 3, 16);
    var fountainSpoutMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff }); // Blue water
    var fountainSpout = new THREE.Mesh(fountainSpoutGeometry, fountainSpoutMaterial);
    fountainSpout.position.set(x, 3.5, z);
    scene.add(fountainSpout);

    // Fountain water spout top
    var fountainSpoutTopGeometry = new THREE.CylinderGeometry(0.5, 0, 1, 16);
    var fountainSpoutTopMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff }); // Blue water
    var fountainSpoutTop = new THREE.Mesh(fountainSpoutTopGeometry, fountainSpoutTopMaterial);
    fountainSpoutTop.position.set(x, 5, z);
    scene.add(fountainSpoutTop);

}

// Call the function to create the park scene
createParkScene(0, 0.1, 0, 50, 50);

var lamps = [];

// Function to create lamp posts
function createLampPost(x, y, z) {
    // Lamp post
    var postGeometry = new THREE.CylinderGeometry(0.3, 0.3, 10, 16);
    var postMaterial = new THREE.MeshLambertMaterial({ color: 0xaaaaaa }); // Gray lamp post
    var lampPost = new THREE.Mesh(postGeometry, postMaterial);
    lampPost.position.set(x, y + 5, z);
    scene.add(lampPost);
    lamps.push(lampPost); // Add lamp post to the array

    // Lamp head (lampshade)
    var shadeGeometry = new THREE.SphereGeometry(1.15, 16, 16);
    var shadeMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 }); // Yellow lampshade
    var lampShade = new THREE.Mesh(shadeGeometry, shadeMaterial);
    lampShade.position.set(x, y + 10, z);
    scene.add(lampShade);
    lamps.push(lampShade); // Add lampshade to the array

    // Lamp glass
    var glassGeometry = new THREE.CylinderGeometry(1.6, 1.6, 2.5, 16);
    var glassMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }); // Semi-transparent white glass
    var lampGlass = new THREE
        .Mesh(glassGeometry, glassMaterial);
    lampGlass.position.set(x, y + 10, z);
    scene.add(lampGlass);
    lamps.push(lampGlass); // Add lamp glass to the array

    //add lighting
    var light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(x, y + 10, z);
    scene.add(light);
    lamps.push(light); // Add light to the array
    

}

// create lamps along the road spaced 25 units apart
for (var i = -100; i <= 100; i += 25) {
    createLampPost(i, 0, 27);
    createLampPost(i, 0, -27);
}

for (var i = -100; i <= 100; i += 25) {
    createLampPost(40, 0, i);
    createLampPost(-40, 0, i);
}

// function to create a car and animate it
function createCar(x, y, z) {
    var carGroup = new THREE.Group();

    // Car body
    var carBodyGeometry = new THREE.BoxGeometry(2, 1, 5);
    var carBodyMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 }); // Red car body
    var carBody = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
    carBody.position.set(0, 0.5, 0);
    carGroup.add(carBody);

    // Car wheels
    var wheelGeometry = new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16);
    var wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 }); // Black wheels
    var frontLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontLeftWheel.position.set(-1, 0.25, -2.5);
    carGroup.add(frontLeftWheel);

    var frontRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    frontRightWheel.position.set(-1, 0.25, 2.5);
    carGroup.add(frontRightWheel);

    var backLeftWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    backLeftWheel.position.set(1, 0.25, -2.5);
    carGroup.add(backLeftWheel);

    var backRightWheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
    backRightWheel.position.set(1, 0.25, 2.5);
    carGroup.add(backRightWheel);

    // Position the car
    carGroup.position.set(x, y, z);




    return carGroup;
}

// Create a car and add it to the scene
var car = createCar(-30, 0.5, 0);
scene.add(car);

// Create a function to animate the car going in a square path

// Create a function to animate the car going in a square path
function animateCar() {
    // Define the speed of the car
    var speed = 0.1;

    // Define the boundaries of the square
    var squareSize = 60;
    var minX = -squareSize / 2;
    var maxX = squareSize / 2;
    var minZ = -squareSize / 2;
    var maxZ = squareSize / 2;

    // Move the car forward along the current side of the square
    if (car.position.x <= maxX && car.position.z === minZ) {
        car.position.x += speed;
        car.rotation.y = Math.PI / 2; // Rotate the car to face the next direction
    } else if (car.position.x >= maxX && car.position.z <= maxZ) {
        car.position.z += speed;
        car.rotation.y = 0; // Rotate the car to face the next direction
    } else if (car.position.x >= minX && car.position.z >= maxZ) {
        car.position.x -= speed;
        car.rotation.y = -Math.PI / 2; // Rotate the car to face the next direction
    } else if (car.position.x <= minX && car.position.z >= minZ) {
        car.position.z -= speed;
        car.rotation.y = Math.PI; // Rotate the car to face the next direction
    }

    // Rotate the car wheels
    var wheelRotation = speed * 10; // Adjust the rotation speed as needed
    car.children[1].rotation.z += wheelRotation; // Front left wheel
    car.children[2].rotation.z += wheelRotation; // Front right wheel
    car.children[3].rotation.z += wheelRotation; // Back left wheel
    car.children[4].rotation.z += wheelRotation; // Back right wheel

    // Check if the car has completed a full loop and reset its position
    if (car.position.x <= minX && car.position.z <= minZ) {
        car.position.set(minX, 0, minZ); // Reset the position to the start of the path
        car.rotation.y = 0; // Reset the car's rotation
    }
}






// Initialize the OrbitControls
var controls = new OrbitControls(camera, renderer.domElement);

// Animation loop
function animate() {
    // Call the animateCar function to move the car
    animateCar();
    requestAnimationFrame(animate);
    controls.update(); // Update OrbitControls
    renderer.render(scene, camera);
}

animate();
