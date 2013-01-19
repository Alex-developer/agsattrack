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
 
/* Options for JSHint http://www.jshint.com/
* 
* Last Checked: 19/01/2013
* 
*/
 
var AGVIEWS = (function(element) {
    "use strict" ;
    
    var _views = {
        '3d' : {
            classname : 'AG3DVIEW',
            active : false,
            index: 1
        },
        'passes' : {
            classname : 'AGPASSESVIEW',
            active : false,
            index: 2
        },
        'sky' : {
            classname : 'AGSKYVIEW',
            active : false,
            index: 4
        },
        'polar' : {
            classname : 'AGPOLARVIEW',
            active : false,
            index: 3
        },
        'list' : {
            classname : 'AGLISTVIEW',
            active : true,
            index: 0
        },
        'timeline' : {
            classname : 'AGTIMELINE',
            active : false,
            index: 5
        },
        'options' : {
            classname : 'AGOPTIONS',
            active : false,
            index: 6
        },
        'debug' : {
            classname : 'AGDEBUG',
            active : false,
            index: 7
        },
        'azel' : {
            classname : 'AGAZELVIEW',
            active : false,
            init: false
        }          
    };
    
    return {
    
        getViews : function() {
            return _views;
        },
        
        startView : function(name) {
            var view = null;
            jQuery.each(_views, function(_view, _options) {
                if (_options.active) {
                    view = _options;
                }
                if (typeof _options.instance !== 'undefined') {
                    _options.instance.stopRender();
                }                 
            });
            if (view !== null) {
                if (typeof view.instance !== 'undefined') {
                    jQuery('#viewtabs').tabs('select',view.index);
                    view.instance.startRender();
                }    
            }            
        },
        
        stopView : function(name) {
            var view = null;
            jQuery.each(_views, function(_view, _options) {
                if (_options.active) {
                    view = _options;
                }  
            });
            if (view !== null) {
                if (typeof view.instance !== 'undefined') {
                    view.instance.stopRender();
                }    
            }
        },
        
        getNewView : function(name, params) {
            var view = null;
            jQuery.each(_views, function(_view, _options) {
                if (_view === name) {
                    view = new window[_options.classname](params);
                }  
            });
            return view;  
        },
        
        getCurrentView : function() {
            var view = null;
            jQuery.each(_views, function(_view, _options) {
                if (_options.active) {
                    view = _options;
                }  
            });
            return view;             
        },
            
        getViewFromIndex : function(index) {
            var view = null;
            jQuery.each(_views, function(_view, _options) {
                if (_options.index === index) {
                    view = _options;
                }  
            });
            return view;    
        },
        
        sendViewReset : function() {
            jQuery.each(_views, function(_view, _options) {
                if (typeof _options.instance !== 'undefined' && typeof _options.instance.reset === 'function') {
                    _options.instance.reset();
                }  
            });            
        },
        
        tlesLoaded : function() {
            jQuery.each(_views, function(_view, _options) {
                if (typeof _options.instance !== 'undefined' && typeof _options.instance.tlesLoaded === 'function') {
                    _options.instance.tlesLoaded();
                }  
            });              
        },
        
        destroyView : function(view) {
            if (typeof view.destroy !== 'undefined' && typeof view.destroy === 'function') {
                view.destroy();    
            }
        }  
    };
})();

AGVIEWS.modes = {
    DEFAULT : 1,
    SINGLE : 2
};