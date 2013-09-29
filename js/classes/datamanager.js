var AGDATAMANAGER = (function() {
    'use strict';
    
    var _dataStore = new Array();;
    
    return {
    
        loadLocationDataBase : function(callback) {
            var url = '/index.php?controller=satellite&method=getLocationDatabase';
            jQuery.getJSON(url, function(data) {
                callback();
            });            
        }    
    }
    
})();