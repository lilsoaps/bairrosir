
var gui = new dat.GUI({
    name: "City Options"
});

var params = {

    light_angle: (Math.PI / 2) + 0.2,
    light_increase_speed: 0,
    day: function () {
        params.light_angle = 1.8;
    },
    night: function () {
        params.light_angle = 4.4;
    },

    camera_rotate_speed: 0,

    walk_path_steps: genSteps,
    generate: function () {
        GenerateCity(genSteps);
    },

    firstPerson: function () {
        controls.reset();

        firstPersonMode = !firstPersonMode;
        keyboardControls.enabled = !keyboardControls.enabled;

        if (!firstPersonMode) {
            var Pos = new THREE.Vector3(-360, 700, 360);
            camera.position.set(Pos.x, Pos.y, Pos.z);
        } else {
            var Pos = new THREE.Vector3(0, 4, 13);
            camera.position.set(Pos.x, Pos.y, Pos.z);
            camera.rotation.y = 90 * Math.PI / 180;
            keyboardControls.getObject().position.set(0, 4, 13);
        }

        controls.update();
        camera.updateProjectionMatrix();
    },

    generate1: function () { //match the skybox
        scene.background = textureCube1;
    },


    generate99: function () {
        textureT(9);
    },
}


var lightFolder = gui.addFolder('Light Options');
lightFolder.open();

var lightController = lightFolder.add(params, 'light_angle', 0, Math.PI * 2).listen();;
lightController.name("Angle");
lightController.onChange(function (val) {
    updateLight(val);
});

// Update the position, intensity, and colour of the light sources based on the angle given
function updateLight(val) {
    if (val >= Math.PI * 2) {
        val = 0;
    }

    params.light_angle = val;
    light.position.y = Math.sin(val) * 1000;
    light.position.x = Math.cos(val) * 1000;
    var lightVal = Math.abs(Math.sin(val));
    light.color = new THREE.Color(1, lightVal, lightVal);

    if (val >= Math.PI) {
        light.intensity = 0;
        ambientLight.intensity = 0.1;
    } else {
        light.intensity = 0.25 + 0.25 * lightVal;
        ambientLight.intensity = 0.1 + 0.2 * lightVal;
    }
}

var lightIncreaseSpeedController = lightFolder.add(params, 'light_increase_speed', 0, 10, 0.1).listen();;
lightIncreaseSpeedController.name("Light Increase Speed");
lightIncreaseSpeedController.onChange(function (val) {
    params.light_increase_speed = val;
});

window.setInterval(function () {
    updateLight(params.light_angle + (params.light_increase_speed / 100));
}, 30);

var ctrlBtnDay = lightFolder.add(params, 'day');
ctrlBtnDay.name("Set Time to Day");

var ctrlBtnNight = lightFolder.add(params, 'night');
ctrlBtnNight.name("Set Time to Night");


var generationFolder = gui.addFolder('Generation Options');
generationFolder.open();

var genStepsController = generationFolder.add(params, 'walk_path_steps', 1, 50, 1);
genStepsController.name("Generation Steps");
genStepsController.onChange(function (val) {
    genSteps = val;
});

var genBtn = generationFolder.add(params, 'generate');
genBtn.name("Generate New City");


//Controller settings, for example whether or not to use first person controls
var controlsFolder = gui.addFolder('Control Options');
controlsFolder.open();

var ctrlBtnFP = controlsFolder.add(params, 'firstPerson');
ctrlBtnFP.name("First Person Mode");



