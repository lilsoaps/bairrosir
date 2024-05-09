import * as THREE from 'three';


// Function to create a tapered skyscraper with windows
export function createTaperedSkyscraper(position, baseWidth, topWidth, height, numFloors, numWindowsPerFloor) {
    // Validate input
    if (!position || !baseWidth || !topWidth || !height || !numFloors || !numWindowsPerFloor) {
        console.error("Invalid skyscraper parameters.");
        return null;
    }


    // Create the skyscraper mesh
    const skyscraper = new THREE.Object3D();
    let currentHeight = 0;

    // Generate dimensions for each floor and add windows
    for (let i = 0; i < numFloors; i++) {
        const floorHeight = height / numFloors;
        const floorWidth = baseWidth - ((baseWidth - topWidth) * i / numFloors); // Tapering width
        const floorDepth = baseWidth - ((baseWidth - topWidth) * i / numFloors); // Tapering depth

        const floorMesh = createFloorWithWindows(floorWidth, floorHeight, floorDepth, numWindowsPerFloor);
        floorMesh.position.set(0, currentHeight, 0);
        skyscraper.add(floorMesh);

        currentHeight += floorHeight;
    }

    // Create a pointy roof
    const roofGeometry = new THREE.ConeGeometry(topWidth / 2, topWidth / 2, 4);
    const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Gray roof
    const roofMesh = new THREE.Mesh(roofGeometry, roofMaterial);
    roofMesh.position.set(0, 97, 0);
    skyscraper.add(roofMesh);



    // Position the skyscraper
    skyscraper.position.copy(position);


    return skyscraper;
}

// Function to create a floor with windows
function createFloorWithWindows(width, height, depth, numWindows) {
    // Create a box geometry for the floor
    const geometry = new THREE.BoxGeometry(width, height, depth);

    // Create a material for the floor (optional)
    const material = new THREE.MeshLambertMaterial({ color: 0x808080 });

    // Create the floor mesh
    const floorMesh = new THREE.Mesh(geometry, material);

    // Calculate window dimensions and gap
    const windowWidth = width / numWindows;
    const windowHeight = height / 2;
    const windowGap = 0.5;

    // Create windows on the floor
    for (let i = 0; i < numWindows; i++) {
        const windowGeometry = new THREE.BoxGeometry(windowWidth - windowGap, windowHeight - windowGap, 0.1);
        const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff }); // Blue windows
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set((i + 0.5) * windowWidth - width / 2, 0, depth / 2 + 0.1); // Adjust height as needed
        floorMesh.add(windowMesh);
    }

    //more windows
    for (let i = 0; i < numWindows; i++) {
        const windowGeometry = new THREE.BoxGeometry(windowWidth - windowGap, windowHeight - windowGap, 0.1);
        const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff }); // Blue windows
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set((i + 0.5) * windowWidth - width / 2, 0, -depth / 2 - 0.1); // Adjust height as needed
        floorMesh.add(windowMesh);
    }

    // more windows
    for (let i = 0; i < numWindows; i++) {
        const windowGeometry = new THREE.BoxGeometry(windowWidth - windowGap, windowHeight - windowGap, 0.1);
        const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff }); // Blue windows
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set(width / 2 + 0.1, 0, (i + 0.5) * windowWidth - depth / 2); // Adjust height as needed
        //rotate the windows
        windowMesh.rotation.y = Math.PI / 2;
        floorMesh.add(windowMesh);
    }
    // more windows
    for (let i = 0; i < numWindows; i++) {
        const windowGeometry = new THREE.BoxGeometry(windowWidth - windowGap, windowHeight - windowGap, 0.1);
        const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff }); // Blue windows
        const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
        windowMesh.position.set(-width / 2 - 0.1, 0, (i + 0.5) * windowWidth - depth / 2); // Adjust height as needed
        //rotate the windows
        windowMesh.rotation.y = Math.PI / 2;
        floorMesh.add(windowMesh);
    }



    return floorMesh;
}