import * as THREE from 'three';

export function createSupermarket(x,y,z, width, height, depth) {
    // Validate input
    if (!position || !width || !height || !depth ) {
        console.error("Invalid supermarket parameters.");
        return null;
    }

    // Create the supermarket mesh
    const supermarket = new THREE.Object3D();
    const numWindows = 4;

    // Main building geometry
    const buildingGeometry = new THREE.BoxGeometry(width, height, depth);

    // Main building material
    const buildingMaterial = new THREE.MeshLambertMaterial({ color: 0xf9f9f9 }); // Light gray color

    // Main building mesh
    const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
    building.position.set(x, y + height / 2, z);
    supermarket.add(building);

    // Windows
    const windowWidth = width / (numWindows + 1);
    const windowHeight = height / 3;
    const windowDepth = 0.1;
    const windowColor = 0xadd8e6; // Light blue color

    for (let i = 0; i < numWindows; i++) {
        const windowGeometry = new THREE.BoxGeometry(windowWidth, windowHeight, windowDepth);
        const windowMaterial = new THREE.MeshLambertMaterial({ color: windowColor });
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set((i + 1) * windowWidth - width / 2, height / 2, depth / 2 + windowDepth / 2);
        building.add(windowMesh);
    }

    // Door
    const doorWidth = width / 4;
    const doorHeight = height / 2;
    const doorDepth = 0.2;
    const doorColor = 0x8b4513; // Brown color
    const doorGeometry = new THREE.BoxGeometry(doorWidth, doorHeight, doorDepth);
    const doorMaterial = new THREE.MeshLambertMaterial({ color: doorColor });
    const doorMesh = new THREE.Mesh(doorGeometry, doorMaterial);
    doorMesh.position.set(0, doorHeight / 2, depth / 2 + doorDepth / 2);
    building.add(doorMesh);

    // Position the supermarket
    supermarket.position.copy(position);

    return supermarket;
}
