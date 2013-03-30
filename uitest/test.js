jQuery(document).ready(function(){
    var locationDatabase = null;
    
    
    function deg2rad(deg) {
        return  deg * (Math.PI / 180);
    }    
    
    
    function locationVisible(lat1, lon1, radius, lat2, lon2) {
        lat1 = deg2rad(lat1); lat2 = deg2rad(lat2);
        lon1 = deg2rad(lon1); lon2 = deg2rad(lon2);
        dlon = lon2 - lon1;
        distance =
          6372.795 *
          Math.atan2(
                Math.sqrt(
                     Math.pow(Math.cos(lat2) * Math.sin(dlon), 2) +
                     Math.pow(Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dlon), 2)
                )
                ,
                Math.sin(lat1) * Math.sin(lat2) + 
                Math.cos(lat1) * Math.cos(lat2) * Math.cos(dlon)
          );

        if (distance < radius) {
            return distance;
        }
        return false;            
        
    }    
    
    var url = 'http://ag.local/index.php?controller=satellite&method=getLocationDatabase';
    jQuery.getJSON(url, function(data) {
        locationDatabase = data;

        var lat = 52.12;
        var lon = 0;
        
        var fp = 4000;
        
        for ( var i = 0; i < data.length; i++) {
            result = locationVisible(lat, lon, fp, data[i].lat, data[i].lon);
            if (result !== false) {
                console.log(data[i].name);
            }
        }
        
    });
            
});
                