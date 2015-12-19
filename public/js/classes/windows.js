/*
Copyright 2013 Alex Greenland

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */
  
var AGWINDOWMANAGER = (function() {
    "use strict" ;
    
    var _windows = {
        'dx' : {
            classname : 'AGDXWINDOW',
            loaded: false,
            instance: null,
            element : null
        },
        'geocode' : {
            classname : 'AGGECODEWINDOW',
            loaded: false,
            instance: null,
            element : null
        }        
    };
    
    function showWindow(name, elementId, params) {
        if (_windows[name].instance === null) {
            if (typeof elementId === 'undefined' || typeof elementId === null) {
                var elementId = AGUTIL.getId();           
            }
            var element = jQuery('<div/>', {
                'id' : elementId
            }).appendTo(document.body);             
            _windows[name].element = element;
            _windows[name].instance = new window[_windows[name].classname](element, params);
        } else {
            _windows[name].instance.init(params);    
        }
    }
    
    return {

        openWindow : function(name) {
            if (typeof _windows[name] !== 'undefined') {
                if (_windows[name].instance !== null) {
                    jQuery(_windows[name].element).window('open', false);
                }
            }               
        },
            
        closeWindow : function(name) {
            if (typeof _windows[name] !== 'undefined') {
                if (_windows[name].instance !== null) {
                    jQuery(_windows[name].element).window('close', false);
                }
            }               
        },

        destroyWindow : function(name) {
            if (typeof _windows[name] !== 'undefined') {
                if (_windows[name].instance !== null) {
                    jQuery(_windows[name].element).window('destroy', false);
                    jQuery(_windows[name].element).remove();
                    _windows[name].instance = null;
                }
            }            
        },
                
        showWindow : function(name, params, elementId) {
            if (typeof _windows[name] !== 'undefined') {
                if (_windows[name].loaded === false) {
                    Modernizr.load({
                        test: true,
                        yep : 'js/classes/windows/' + name + '.js?cache=' + (new Date()).getTime(),
                        complete : function() {
                            _windows[name].loaded = true;
                            showWindow(name, elementId, params);
                        }
                    });                    
                } else {
                    showWindow(name, elementId, params);
                }   
            }
        }
    };
    
})();