var AGDATAMANAGER = (function() {
    'use strict';
    
    var _dataStore = new Array();
    var _knownData = {
        'locations' : {
            'url' : '/locations'
        }    
    };

    function loadData(dataName, callback, force) {
        var _result = false;
        
        if (typeof _knownData[dataName] !== 'undefined') {
           _result = true;
           if (_dataStore[dataName] !== 'undefined') {
                var url = _knownData[dataName].url;
                jQuery.getJSON(url, function(data) {
                    _dataStore[dataName] = data;
                    callback(data);
                });
           } else {
            callback(_dataStore[dataName]);               
           }             
        }
        
        return _result;        
    }
        
    return {
    
        getData : function(dataName, callback, force) {
            return loadData(dataName, callback, force);
        }   
    }
    
})();