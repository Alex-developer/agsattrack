
var agsattrack = function() {
    'use strict';
    
    var ui 				= null;
    var canvas          = null;
    var ellipsoid       = Cesium.Ellipsoid.WGS84;
    var scene           = null;
    var satBillboards   = new Cesium.BillboardCollection();
    var cb              = new Cesium.CentralBody(ellipsoid);
    var clock           = new Cesium.Clock();
    var transitioner 	= null;
    var satrecs         = [];   // populated from onclick file load
    var satdesigs       = [];   // populated from onclick file load
    var satnames        = [];   // populated from onclick file load
    var satids          = [];   // populated from onclick file load
    var satPositions    = [];   // calculated by updateSatrecsPosVel()
    var WHICHCONST      = 84;   //
    var TYPERUN         = 'm';  // 'm'anual, 'c'atalog, 'v'erification
    var TYPEINPUT       = 'n';  // HACK: 'now'
    var SAT_POSITIONS_MAX = 55; // Limit numer of positions displayed to save CPU
    var orbit = [];
    var selected = null;
    var updateCounter = 0;
    var satDiv = document.getElementById('satellite_popup');
    var sats = [];
    
    var observer = null;
    
    var orbitLines = new Cesium.PolylineCollection();
    var groundLines = new Cesium.PolylineCollection();
    var footprint = new Cesium.PolylineCollection();
//    var footprintCircle = new Cesium.Polygon();
    var footprintCircle = new Cesium.PolylineCollection();
    
    var infoSource;
    
	jQuery('<canvas/>', {
		'id': 'glCanvas',
		'class': 'fullsize'
	}).appendTo('#cesiumContainer');
	
	canvas = jQuery('#glCanvas')[0];
	scene = new Cesium.Scene(canvas);
	transitioner = new Cesium.SceneTransitioner(scene, ellipsoid);
	
    var TILE_PROVIDERS = {
            'bing' : new Cesium.BingMapsImageryProvider(// fails to detect 404 due to no net :-(
                {server : 'dev.virtualearth.net',
                    mapStyle : Cesium.BingMapsStyle.AERIAL,
                    // Some versions of Safari support WebGL, but don't correctly implement
                    // cross-origin image loading, so we need to load Bing imagery using a proxy.
                    proxy : Cesium.FeatureDetection.supportsCrossOriginImagery() ? undefined : new Cesium.DefaultProxy('/proxy/')

                }),
            'osm'  : new Cesium.OpenStreetMapImageryProvider(
                {url    : 'http://otile1.mqcdn.com/tiles/1.0.0/osm'
                }),
            'static' : new Cesium.SingleTileImageryProvider(
                {url: 'images/NE2_50M_SR_W_4096.jpg'
                })
        };
    
    
	    function fnacs(x) {
	    	return Math.PI / 2 - Math.atan(x / Math.sqrt(1 - x ^ 2));
	    }
	    function fnrad(x) {
	    	return x * Math.PI / 180;
	    }
	    
	    function drawFootprint() {
        //	return;
            var pos0 = sats.positions[selected];                
            var carte = new Cesium.Cartesian3(pos0[0]*1000, pos0[1]*1000, pos0[2]*1000);
            var carto = ellipsoid.cartesianToCartographic(carte);
            var sLat = Cesium.Math.toDegrees(carto.latitude);
            var sLon = Cesium.Math.toDegrees(carto.longitude);
            
            var height = carto.height 
            
	        var dir = (sLon>0?'E':'W');
	        var long = convertDecDeg(sLon,dir);
	        dir = (sLat>0?'N':'S');
	        var lat = convertDecDeg(sLat,dir);
	        
            

        /*	var now = new Cesium.JulianDate();
        	footprintCircle.modelMatrix =
                Cesium.Matrix4.fromRotationTranslation(
                    Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
                    Cesium.Cartesian3.ZERO);
  */
        	var RE = 6378.137;
        	var srad = 12756.33*Math.acos(RE/(RE+(height/1000)));
        	srad = srad * 500;

//   	        jQuery('#camera').html('lg ='+ long + ' lt =' + lat + ' h= ' + (height / 1000).toFixed(3) + ' fp= ' + srad);	                
  	        jQuery('#camera').html(' h= ' + (height / 1000).toFixed(3) + ' fp= ' + srad.toFixed(3));	                

   	      
  	      footprintCircle.removeAll();
  	      var t = footprintCircle.add();
  	    
  	    var now = new Cesium.JulianDate();  
      	t.modelMatrix =
            Cesium.Matrix4.fromRotationTranslation(
                Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
                Cesium.Cartesian3.ZERO);
      	
  	      t.setPositions(Cesium.Shapes.computeCircleBoundary(
  	            ellipsoid, ellipsoid.cartographicToCartesian(
  	                new Cesium.Cartographic.fromDegrees(sLon, sLat)), srad));
  	        
/*  	        
 
	        footprintCircle.setPositions(Cesium.Shapes.computeCircleBoundary(
	                ellipsoid, ellipsoid.cartographicToCartesian(
	                    new Cesium.Cartographic.fromDegrees(sLon, sLat)), srad));
*/
	    }
	    
	    
	    function showGeolocation(scene) {   	
	    	jQuery(document).bind('agsattrack.locationAvailable', function(e, status){
	    		var target = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(observer.getLon(), observer.getLat()));
	            var eye    = ellipsoid.cartographicToCartesian(Cesium.Cartographic.fromDegrees(observer.getLon(), observer.getLat(), 1e7));
	            var up     = new Cesium.Cartesian3(0, 0, 1);
	            var image = new Image();
	            image.src = 'images/cross_yellow_16.png';
	            image.onload = function () {
	                var billboards = new Cesium.BillboardCollection(); // how to make single?
	                var textureAtlas = scene.getContext().createTextureAtlas({image: image});
	                billboards.setTextureAtlas(textureAtlas);
	                billboards.modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(target);
	                billboards.add({imageIndex: 0,position: new Cesium.Cartesian3(0.0, 0.0, 0.0)});
	                scene.getPrimitives().add(billboards);
	            };
	            // Point the camera at us and position it directly above us
	            scene.getCamera().lookAt(eye, target, up);

	    	});	    	

	    }
	    
	    
	    function populateSatelliteSelector() {
	    	var satnum, max;
	    	
	    	jQuery('#jqxsatellite').jqxComboBox('clear');
	        for (satnum = 0, max = satnames.length; satnum < max; satnum += 1) {
	        	jQuery('#jqxsatellite').jqxComboBox('addItem',satnames[satnum]);
	        }
	    }
	    
	    function render() {
    	    (function tick() {
    	    	//scene.setSunPosition(Cesium.computeSunPosition(new Cesium.JulianDate()));
    	        scene.render();
    	        Cesium.requestAnimationFrame(tick);
    	    }());
	    }

	    function getSatrecsFromTLEFile(fileName) {
	        var tles = tle.parseFile(fileName);
	        var satnum, max, rets, satrec, startmfe, stopmfe, deltamin;

	        // Reset the globals
	        satrecs = [];
	        satnames = [];
	        satdesigs = [];
	        satids = [];

	        for (satnum = 0, max = tles.length; satnum < max; satnum += 1) {
	            satnames[satnum] = tles[satnum][0].trim();        // Name: (ISS (ZARYA))
	            satdesigs[satnum] = tles[satnum][1].slice(9, 17); // Intl Designator YYNNNPPP (98067A)
	            satids[satnum]   = tles[satnum][2].split(' ')[1]; // NORAD ID (25544)
	            rets = twoline2rv(WHICHCONST, tles[satnum][1], tles[satnum][2], TYPERUN, TYPEINPUT);
	            satrec   = rets.shift();
	            startmfe = rets.shift();
	            stopmfe  = rets.shift();
	            deltamin = rets.shift();
	            satrecs.push(satrec); // Don't need to sgp4(satrec, 0.0) to initialize state vector
	        }
	        // Returns nothing, sets globals: satrecs, satnames, satids
	    }
	    
	    function updateSatrecsPosVel(satrecs, julianDate) {

	        var satrecsOut = [];
	        var positions = [];
	        var velocities = [];
	        var satnum, max, jdSat, minutesSinceEpoch, rets, satrec, r, v;

	        for (satnum = 0, max = satrecs.length; satnum < max; satnum += 1) {
	            jdSat = new Cesium.JulianDate.fromTotalDays(satrecs[satnum].jdsatepoch);
	            minutesSinceEpoch = jdSat.getMinutesDifference(julianDate);
	            rets = sgp4(satrecs[satnum], minutesSinceEpoch);
	            satrec = rets.shift();
	            r = rets.shift();      // [1802,    3835,    5287] Km, not meters
	            v = rets.shift();
	            satrecsOut.push(satrec);
	            positions.push(r);
	            velocities.push(v);
	            
	            if (satnum > SAT_POSITIONS_MAX) {
	            	break;
	            }
	        }
	        // UPDATE GLOBAL SO OTHERS CAN USE IT (TODO: make this sane w.r.t. globals)
	        satPositions = positions;
	        return {'satrecs': satrecsOut,
	                'positions': positions,
	                'velocities': positions};
	    }	
	    
	    function calculateOrbit() {
	    	var julianDate = new Cesium.JulianDate();
	    	var jdSat,i, satrec, r, v, minutesSinceEpoch, rets;
	    	
	    	var period = ((1440 / satrecs[selected].mm) + 0.5) * 60;
	    	var step = period / 200;
	    	orbit = [];
	    	for (i=0; i< 200; i++) {
	            jdSat = new Cesium.JulianDate.fromTotalDays(satrecs[selected].jdsatepoch);
	            jdSat = jdSat.addSeconds(i*step);
	            minutesSinceEpoch = jdSat.getMinutesDifference(julianDate);
	            rets = sgp4(satrecs[selected], minutesSinceEpoch);
	            satrec = rets.shift();
	            r = rets.shift();
	            v = rets.shift();
	            orbit.push(r);
	    	}
            console.log('calc');
	    }
	    
	    function populateSatelliteBillboard() {
	        var satnum, max, billboard;
	        var image = new Image();

	        satBillboards.removeAll(); // clear out the old ones
	        for (satnum = 0, max = satnames.length; satnum < max; satnum += 1) {
	            billboard = satBillboards.add({imageIndex: 0,
	                                           position:  new Cesium.Cartesian3(0, 0, 0)}); // BOGUS position
	            // attach names for mouse interaction
	            billboard.satelliteName       = satnames[satnum];
	            billboard.satelliteNoradId    = satids[satnum];
	            billboard.satelliteDesignator = satdesigs[satnum];
	            billboard.index = satnum;
	            
	            if (satnum > SAT_POSITIONS_MAX) {
	            	break;
	            }	            
	        }
	        scene.getPrimitives().add(satBillboards);

	        image.src = 'images/Satellite.png';
	        image.onload = function () {
	            var textureAtlas = scene.getContext().createTextureAtlas({image: image}); // seems needed in onload()
	            satBillboards.setTextureAtlas(textureAtlas);
	        };
	    }
	    
	    function updateSatelliteBillboards(satPositions) {
	        var now = new Cesium.JulianDate();
	        var posnum, max, pos, newpos, bb;

	        satBillboards.modelMatrix =
	            Cesium.Matrix4.fromRotationTranslation(
	                Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
	                Cesium.Cartesian3.ZERO);
	        for (posnum = 0, max = satPositions.length; posnum < max; posnum += 1) {
	            bb = satBillboards.get(posnum);
	            pos = satPositions[posnum];
	            newpos =  new Cesium.Cartesian3(pos[0] * 1000, pos[1] * 1000, pos[2] * 1000); // TODO multiplyByScalar(1000)
	            bb.setPosition(newpos);
	            
	            if (posnum > SAT_POSITIONS_MAX) {
	            	break;
	            }	            
	        }
	    }	    
	    
	    function satelliteClickDetails(scene) {
	        var handler = new Cesium.EventHandler(scene.getCanvas());

	        handler.setMouseAction( // actionFunction, mouseEventType, eventModifierKey
	            function (click) {
	                var pickedObject = scene.pick(click.position);
	                if (pickedObject) {
	                    if (selected !== pickedObject.index) {
	                    	selected = pickedObject.index;
	    	            	calculateOrbit();
	                    	setOrbit();
	                    	console.log(selected);
	                    	infoSource.url = "ajax.php?id=" + satids[selected];
	                    	jQuery('#jqxinfogrid').jqxGrid('updatebounddata');
	                    }
	                    
	                }
	            },
	            Cesium.MouseEventType.LEFT_CLICK // MOVE, WHEEL, {LEFT|MIDDLE|RIGHT}_{CLICK|DOUBLE_CLICK|DOWN|UP}
	        );
	    }
	    
	    function satelliteHoverDisplay(scene) {

	        var handler = new Cesium.EventHandler(scene.getCanvas());

	        handler.setMouseAction(
	            function (movement) {
	                var pickedObject = scene.pick(movement.endPosition);
	                //var pickedObject = null;
	            	var canvasTop = canvas.offsetTop;
	                if (pickedObject && pickedObject.satelliteName) { // Only show satellite, not Geo marker
	                    satDiv.textContent = pickedObject.satelliteName;
	                    satDiv.style.left = movement.endPosition.x + 'px';
	                    satDiv.style.top  = movement.endPosition.y + canvasTop - 24 + 'px'; // seems a bit high from mouse
	                    satDiv.style.display = ''; // remove any 'none'
	                    // The following used to work in <style> section, but stopped; why?
	                    satDiv.style.position = 'absolute'; // vital to positioning near cursor
	                    satDiv.style.padding = '2px';
	                    satDiv.style.backgroundColor = '#909090';
	                    satDiv.style.color = 'black';
 
	                }
	                else {
	                    satDiv.style.display = 'none';
	                }
	                /*
        	        var position = scene.getCamera().position;
        	        
        	        var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
        	        var long = Cesium.Math.toDegrees(cartographicPosition.longitude);
        	        var lat = Cesium.Math.toDegrees(cartographicPosition.latitude);
        	        
        	        var dir = (long>0?'E':'W');
        	        long = convertDecDeg(long,dir);
        	        dir = (lat>0?'N':'S');
        	        lat = convertDecDeg(lat,dir);
        	        
        	        jQuery('#camera').html('long ='+ long + ' lat =' + lat + ' alt =' + cartographicPosition.height);	                
	                */
	            },
	            Cesium.MouseEventType.MOVE // MOVE, WHEEL, {LEFT|MIDDLE|RIGHT}_{CLICK|DOUBLE_CLICK|DOWN|UP}
	        );
	    }
	    
	    function setOrbit() {
	        if (typeof(orbit[0]) !== 'undefined') {    
    	    	
	        	var now = new Cesium.JulianDate();
	        	orbitLines.modelMatrix =
	                Cesium.Matrix4.fromRotationTranslation(
	                    Cesium.Transforms.computeTemeToPseudoFixedMatrix(now),
	                    Cesium.Cartesian3.ZERO);

	        	
    	    	//populateSatelliteBillboard();
	            var i;
	            orbitLines.removeAll();
	            groundLines.removeAll();
	            var points = [];
	            var pointsGround = [];
	            for (i=0; i < 200; i++) {
	            	points.push(new Cesium.Cartesian3(orbit[i][0] * 1000, orbit[i][1] * 1000, orbit[i][2] * 1000));
	            }
	            orbitLines.add({positions:points,width:1, color:Cesium.Color.RED});

	         }	    	
	    }
	    
	    function convertDecDeg(v,tipo) {
	    	if (!tipo) tipo='N';
	    	var deg;
	    	deg = v;
	    	if (!deg){
	    		return "";
	    	} else if (deg > 180 || deg < 0){
	    		// convert coordinate from north to south or east to west if wrong tipo
	    		return convertDecDeg(-v,(tipo=='N'?'S': (tipo=='E'?'W':tipo) ));
	    	} else {
	    		var gpsdeg = parseInt(deg);
	    		var remainder = deg - (gpsdeg * 1.0);
	    		var gpsmin = remainder * 60.0;
	    		var D = gpsdeg;
	    		var M = parseInt(gpsmin);
	    		var remainder2 = gpsmin - (parseInt(gpsmin)*1.0);
	    		var S = parseInt(remainder2*60.0);
	    		return D+"&deg; "+M+"' "+S+"'' "+tipo;
	    	}
	    }
	    
    return {
    
    	init: function() {

    	    observer = new AGOBSERVER();
    	    ui = new AGUI(canvas, scene);
    	    

    	    
    	    cb.getImageryLayers().addImageryProvider(TILE_PROVIDERS.static);
    	 //   cb.nightImageSource     = 'images/land_ocean_ice_lights_2048.jpg';
    	    cb.showSkyAtmosphere    = true;
    	 //   cb.bumpMapSource        = 'images/earthbump1k.jpg'; // need/want this? if tile server unavailable?

    	    scene.getPrimitives().setCentralBody(cb);

    	    scene.skyAtmosphere = new Cesium.SkyAtmosphere();
    	    var imageryUrl = 'images/';
    	    scene.skyBox = new Cesium.SkyBox({
    	        positiveX: imageryUrl + 'skybox/tycho8_px_80.jpg',
    	        negativeX: imageryUrl + 'skybox/tycho8_mx_80.jpg',
    	        positiveY: imageryUrl + 'skybox/tycho8_py_80.jpg',
    	        negativeY: imageryUrl + 'skybox/tycho8_my_80.jpg',
    	        positiveZ: imageryUrl + 'skybox/tycho8_pz_80.jpg',
    	        negativeZ: imageryUrl + 'skybox/tycho8_mz_80.jpg'
    	    }); 
    	    

    	    scene.getCamera().getControllers().addCentralBody();
    	    scene.getCamera().getControllers().get(0).spindleController.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
    	    scene.getCamera().lookAt(new Cesium.Cartesian3(4000000.0, -15000000.0,  10000000.0), // eye
    	                             Cesium.Cartesian3.ZERO, // target
    	                             new Cesium.Cartesian3(-0.1642824655609347, 0.5596076102188919, 0.8123118822806428)); // up    	    
    	    
    	    showGeolocation(scene);
    	    scene.getPrimitives().add(orbitLines);
    	    scene.getPrimitives().add(groundLines);
    	    scene.getPrimitives().add(footprint);
    	    
    	    scene.getPrimitives().add(footprintCircle);
    	    
    	   // scene.getPrimitives().add(new Cesium.PerformanceDisplay());
    	    
    	    getSatrecsFromTLEFile('tle/amateur.txt');
            populateSatelliteSelector();
            
    	    populateSatelliteBillboard();
    	    satelliteHoverDisplay(scene);
    	    satelliteClickDetails(scene);    	    
	        
    	    scene.setAnimation(function () {
    	    	
    	    	updateCounter++;
    	    	
    	    	if (updateCounter > 10) {
    	    		updateCounter = 0;
	    	        var currentTime = clock.tick();
	    	        var now = new Cesium.JulianDate(); // TODO: we'll want to base on tick and time-speedup
	
	
	    	        if (satrecs.length > 0) {
	    		    	if (scene.morphTime >= 0 && scene.morphTime <= 1) {
	    		    		sats = updateSatrecsPosVel(satrecs, now); // TODO: sgp4 needs minutesSinceEpoch from timeclock
	    		    		satrecs = sats.satrecs;                       // propagate [GLOBAL]
	    		    		updateSatelliteBillboards(sats.positions);
	    		    		
	    		    		if (selected !== null) {
	    		    			drawFootprint();
	    		    		}
	    	            }
	    	        }
    	    	}
    	    
    	    })    	    
    	    
    	    render();


    	}
    
    }
}
