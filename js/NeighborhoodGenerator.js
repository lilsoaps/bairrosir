// Setup for roads
var roadSize = 20; // the width of each road
var roadGeometry = new THREE.PlaneGeometry(roadSize, roadSize); // create a new PlaneGeometry that is square from the road size 
var roadMaterial = new THREE.MeshPhongMaterial({ // create a new material from an asphalt texture
    map: new THREE.TextureLoader().load("./assets/road/ee.jpeg"),
    side: THREE.DoubleSide // make it double sided to avoid any rendering issues
});

// Setup for buildings
var buildingBaseSize = 80; // the size of each building base
var buildingBaseGeometry = new THREE.PlaneGeometry(buildingBaseSize, buildingBaseSize); // create a square PlaneGeometry to use as a base under each building
var buildingBaseMaterial = new THREE.MeshPhongMaterial({ // create a new material from a base texture
    map: new THREE.TextureLoader().load("./assets/road/bae.jpg"),
    side: THREE.DoubleSide // make it double sided to avoid any rendering issues
});

// Setup for building and road locations
var buildingLocations = []; // an array of every x,y location where there is a building
var roadLocations = []; // an array of every x,y location where there is a road

// The amount of buildings to generate
var genSteps = 20; // the number of times we recursively call our walking algorithm

// Add a square road to the scene, using specified coordinates
function AddSquareRoad(x, y, z) {
    const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
    roadMesh.receiveShadow = true;
    roadMesh.castShadow = false;
    
    // Set position
    roadMesh.position.set(x, y, z);
    // Rotate 90 degrees
    roadMesh.rotation.set(Math.PI / 2, 0, 0);
    
    scene.add(roadMesh);
}

// Add a base that will go under each building, using specified coordinates
function AddBuildingBase(x, y, z) {
    const buildingBaseMesh = new THREE.Mesh(buildingBaseGeometry, buildingBaseMaterial);
    buildingBaseMesh.receiveShadow = true;
    buildingBaseMesh.castShadow = false;

    // Set position
    buildingBaseMesh.position.set(x, y, z);
    // Rotate 90 degrees
    buildingBaseMesh.rotation.set(Math.PI / 2, 0, 0);

    scene.add(buildingBaseMesh);
}

function AddRoads(x, y, z, width) {
    // Check if the location is already occupied by a road
    if (roadLocations.some(location => location.x === x && location.z === z)) {
        return; // Exit function if the space is not free
    }

    // Add the current location to the roadLocations array
    roadLocations.push({ x, z });

    // Add roads along the x-axis
    for (let w = 0; w < width; w++) {
        AddSquareRoad((w + x) * roadSize, y, z * roadSize);
    }

    // Add roads along the z-axis
    for (let q = 0; q < width; q++) {
        AddSquareRoad(x * roadSize, y, (q + z) * roadSize);
    }
}


function AddBuilding(startingX, startingZ, randomX, randomZ, stepsLeft) {
    var buildingWidth = 1.5 + (Math.random() * 1);
    var buildingHeight = 1 + (Math.random() * (stepsLeft / 6));

    var buildingX = (startingX + randomX) * 20 * 5;
    var buildingZ = (startingZ + randomZ) * 20 * 5;

    var freeSpace = true;

    for (var b = 0; b < buildingLocations.length; b++) {
        if (buildingLocations[b].buildingX == buildingX && buildingLocations[b].buildingZ == buildingZ) {
            freeSpace = false;
            break;
        }
    }

    if (freeSpace) {
        buildingLocations.push({
            buildingX: buildingX,
            buildingZ: buildingZ
        });

        var randBuilding = Math.floor((Math.random() * 100) + 1);

        if (randBuilding < 75) {
            var isWideRand = Math.floor(Math.random() * 30) + 1;

            if (isWideRand < 5) {
                var freeSpaceAdj = true;

                for (var b = 0; b < buildingLocations.length; b++) {
                    if (buildingLocations[b].buildingX == buildingX + 100 && buildingLocations[b].buildingZ == buildingZ) {
                        freeSpaceAdj = false;
                        break;
                    }
                }

                if (freeSpaceAdj) {
                    buildingX += 100;
                    buildingLocations.push({
                        buildingX: buildingX,
                        buildingZ: buildingZ
                    });
                    buildingX -= 50;
                }

                AddBuildingBase(buildingX + 50, 1.0084, buildingZ);
                AddBuildingBase(buildingX, 1.0084, buildingZ);
                AddBuildingBase(buildingX - 50, 1.0084, buildingZ);
            } else if (isWideRand > 25) {
                var freeSpaceAdj = true;

                for (var b = 0; b < buildingLocations.length; b++) {
                    if (buildingLocations[b].buildingZ == buildingZ + 100 && buildingLocations[b].buildingX == buildingX) {
                        freeSpaceAdj = false;
                        break;
                    }
                }

                if (freeSpaceAdj) {
                    buildingZ += 100;
                    buildingLocations.push({
                        buildingX: buildingX,
                        buildingZ: buildingZ
                    });
                    buildingZ -= 50;
                }

                AddBuildingBase(buildingX, 1.0084, buildingZ - 50);
                AddBuildingBase(buildingX, 1.0084, buildingZ);
                AddBuildingBase(buildingX, 1.0084, buildingZ + 50);
            } else {
                AddBuildingBase(buildingX, 1.0084, buildingZ);
            }

            var wideBuildingWidth = (isWideRand < 5) ? buildingWidth : 0;
            var wideBuildingDepth = (isWideRand > 25) ? buildingWidth : 0;

            AddBuild(
                Math.floor((Math.random() * 8) + 1),
                buildingWidth + wideBuildingWidth,
                buildingHeight,
                buildingWidth + wideBuildingDepth,
                buildingX,
                buildingHeight / 2,
                buildingZ
            );
        } else {
            AddBuildingBase(buildingX, 1.0084, buildingZ);
            AddBuild(
                Math.floor((Math.random() * 5) + 9),
                buildingWidth,
                buildingHeight,
                buildingWidth,
                buildingX,
                buildingHeight / 2,
                buildingZ
            );
        }
    }
}


function AddBuild(model, width, height, depth, xTra, yTra, zTra) {
    const loader = new THREE.PLYLoader();
    let mesh = null;
    loader.load(`assets/building_models/b${model}.ply`, function (geometry) {
        const material = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load(`assets/bulding_textures/t${model}.png`),
            shading: THREE.SmoothShading,
            shininess: 50
        });

        geometry.computeVertexNormals();
        mesh = new THREE.Mesh(geometry, material);
        mesh.name = "building";

        geometry.computeBoundingBox();
        const size = geometry.boundingBox.getSize();

        const sca = new THREE.Matrix4();
        const combined = new THREE.Matrix4();

        const scaleFactor = (model > 8) ? 4 : 2;
        sca.makeScale(scaleFactor * size.length() * width, scaleFactor * size.length() * height, scaleFactor * size.length() * depth);

        combined.multiply(sca);
        mesh.applyMatrix(combined);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        mesh.position.set(xTra, yTra, zTra);

        scene.add(mesh);
    });
}


// A recursive Random Walk algorithm, with a specified starting X and Z coordinate, and the remaining number of times to recursively call
// This adds all of the buildings and roads to our city
function RandomWalk(startingX, startingZ, stepsLeft) {
    const randomDirectionIndex = Math.floor(Math.random() * 4);
    const randomRoadCoords = [
        [0, 1],
        [0, -1],
        [-1, 0],
        [1, 0]
    ][randomDirectionIndex]; // randomly choose one of the 4 coordinates for road placement

    const newX = startingX + randomRoadCoords[0]; // get the x coordinate of the randomly chosen direction
    const newZ = startingZ + randomRoadCoords[1]; // get the z coordinate of the randomly chosen direction

    AddRoads(newX * 5, 1, newZ * 5, 5); // Add a section of road at the randomly chosen offset

    const randomBuildingIndex = Math.floor(Math.random() * 4);
    const randomBuildingCoords = [
        [0.5, 0.5],
        [0.5, -0.5],
        [-0.5, 0.5],
        [-0.5, -0.5]
    ][randomBuildingIndex]; // randomly choose one of the 4 coordinates for building placement

    AddBuilding(startingX, startingZ, randomBuildingCoords[0], randomBuildingCoords[1], stepsLeft); // Add a building at the randomly chosen offset

    const newStepsLeft = stepsLeft - 1; // decrement the amount of steps left
    if (newStepsLeft > 0) { // if there are still steps left to go
        RandomWalk(newX, newZ, newStepsLeft); // call this method again with the new coordinates
    }
}


// Generate the city, running the Random Walk algorithm a specified amount of times 
function GenerateCity(steps) {
    for (var x = 0; x < steps; x++) { // call RandomWalk with the current number of steps
        RandomWalk(0, 0, x);
    }
}