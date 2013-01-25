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
* Last Checked: 25/01/2013
* 
*/
/*global AGSETTINGS */ 
 
var AGVIEWS = (function(element) {
    "use strict" ;
    
    var _views = {
        'home' : {
            classname : 'AGHOMEVIEW',
            active : true,
            index: 8
        },
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
            active : false,
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
    
    /**
    * If a view is specified in the settings then set it as the default
    */
    var view = AGSETTINGS.getDefaultView();
    if (typeof _views[view] !== 'undefined') {
        if (_views[view].active === false) {
            jQuery.each(_views, function(_view, _viewOptions) {
                _viewOptions.active = false;
            });            
        }
        _views[view].active = true;
    }

    return {
    
        getViews : function() {
            return _views;
        },
        
        switchView : function(name) {
            var newView = null;
            jQuery.each(_views, function(viewName, view) {
                if (viewName === name) {
                    newView = view;
                }
                if (typeof view.instance !== 'undefined') {
                    view.instance.stopRender();
                }                 
            });
            if (newView !== null) {
                if (typeof newView.instance === 'undefined') {
                    if (typeof newView.init === 'undefined') {
                        newView.init = true;    
                    }
                    if (newView.init) {
                        newView.instance = new window[newView.classname]();
                        newView.instance.init();
                    } 
                    if (typeof newView.instance !== 'undefined' && typeof newView.instance.postInit === 'function') {
                        newView.instance.postInit();
                    }                                                           
                }
                if (typeof newView.instance !== 'undefined') {
                    jQuery('#viewtabs').tabs('select',newView.index);
                    newView.instance.startRender();
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
        
        getCurrentViewName : function() {
            var view = null;
            jQuery.each(_views, function(_view, _options) {
                if (_options.active) {
                    view = _view;
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
        },
        
        optionsUpdated : function(view) {
            var event = 'agsattrack.'+view+'optionsupdated'; 
            jQuery(document).trigger(event, AGSETTINGS.getViewSettings(view));    
        },
        
        resizeLayout : function() {
            jQuery('body').layout('resize');
        }  
    };
})();

AGVIEWS.modes = {
    DEFAULT : 1,
    SINGLE : 2,
    PREVIEW : 3
};