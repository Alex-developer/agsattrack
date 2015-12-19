jQuery(document).ready(function(){


    var viewer = new Cesium.Viewer('3d');
    
    var scene = viewer.scene;    
      

    var height = 0;
   var position = Cesium.Cartesian3.fromDegrees(0, 0, height);
    var heading = Cesium.Math.toRadians(135);
    var pitch = 0;
    var roll = 0.1;
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, heading, pitch, roll);
    var url = '/models/tiefighter/tie_fighter.gltf';
 
   var entity = viewer.entities.add({
        name : url,
        position : position,
//        orientation : orientation,
        model : {
            uri : url,
            minimumPixelSize : 128
        }
    });
    //viewer.trackedEntity = entity;
          
});
                