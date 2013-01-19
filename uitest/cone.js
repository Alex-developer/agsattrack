jQuery(document).ready(function() {
    
    "use strict";

    var canvas = document.createElement('canvas');
    canvas.className = "fullSize";
    document.getElementById('cesiumContainer').appendChild(canvas);
    var ellipsoid = Cesium.Ellipsoid.WGS84;
    var scene = new Cesium.Scene(canvas);
    var primitives = scene.getPrimitives();

    var imageryUrl = '/images/';
    var imageryProvider = new Cesium.SingleTileImageryProvider({
        url : imageryUrl + 'NE2_50M_SR_W_4096.jpg'
    });

    var cb = new Cesium.CentralBody(ellipsoid);
    cb.getImageryLayers().addImageryProvider(imageryProvider);
    primitives.setCentralBody(cb);
    scene.skyAtmosphere = new Cesium.SkyAtmosphere();
    scene.skyBox = new Cesium.SkyBox({
        positiveX: imageryUrl + 'SkyBox/tycho8_px_80.jpg',
        negativeX: imageryUrl + 'SkyBox/tycho8_mx_80.jpg',
        positiveY: imageryUrl + 'SkyBox/tycho8_py_80.jpg',
        negativeY: imageryUrl + 'SkyBox/tycho8_my_80.jpg',
        positiveZ: imageryUrl + 'SkyBox/tycho8_pz_80.jpg',
        negativeZ: imageryUrl + 'SkyBox/tycho8_mz_80.jpg'
    });

    function animate() {
        // INSERT CODE HERE to update primitives based on changes to animation time, camera parameters, etc.
    }

    function tick() {
        scene.initializeFrame();
        animate();
        scene.render();
        Cesium.requestAnimationFrame(tick);
    }
    tick();

    // Prevent right-click from opening a context menu.
    canvas.oncontextmenu = function () {
        return false;
    };

    
  function addRectangularSensor(sensors, ellipsoid, scene) {
//        var rectangularPyramidSensor = sensors.addRectangularPyramid();
        var rectangularPyramidSensor = sensors.addComplexConic();

        
        var modelMatrix = Cesium.Transforms.northEastDownToFixedFrame(ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(0.0, 90.0)));
        modelMatrix = modelMatrix.multiply(Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(3000000.0, 0.0, -3000000.0)));
    
        rectangularPyramidSensor.modelMatrix = modelMatrix;
        rectangularPyramidSensor.radius = 20000000.0;
        rectangularPyramidSensor.xHalfAngle = Cesium.Math.toRadians(40.0);
        rectangularPyramidSensor.yHalfAngle = Cesium.Math.toRadians(20.0);
        
        rectangularPyramidSensor.material = Cesium.Material.fromType(scene.getContext(), 'Color');
        rectangularPyramidSensor.material.uniforms.color = {
            red : 0.0,
            green : 1.0,
            blue : 1.0,
            alpha : 0.5
        };
        
        scene.getPrimitives().add(rectangularPyramidSensor);
    }
        
    var sensors = new Cesium.SensorVolumeCollection();
    addRectangularSensor(sensors, ellipsoid, scene);
        
    ///////////////////////////////////////////////////////////////////////////
    // Example resize handler

    var onResize = function () {
        var width = canvas.clientWidth;
        var height = canvas.clientHeight;

        if (canvas.width === width && canvas.height === height) {
            return;
        }

        canvas.width = width;
        canvas.height = height;
        scene.getCamera().frustum.aspectRatio = width / height;
    };
    window.addEventListener('resize', onResize, false);
    onResize();
    
    document.getElementById('toolbar').innerHTML = '';
});
