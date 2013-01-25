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
/*global AGSatTrack, AGQUERYSTRING */ 

var AGSETTINGS = (function() {
    'use strict';
    
	var _haveCanvas = true;
    var _haveWebGl = false;
//    var _spm = 'isana'; /* broken DO NOT USE */
//    var _spm = 'jspredict'; /* broken DO NOT USE */
    var _spm = 'predictlib';
    var _debugLevel = 1;
    var _calculateEvents = true;
    var _requireEUCookieLaw = true;
    var _defaultView = 'home';
    var _defaultSats = '';
    
    var _settings = {
        aosEl: 5,
        refreshTimerInterval : 5000,
        showPopupHelp : false,
        switchViewOnTabClick : true,
        autoAddSats: true,
        defaultTleGroup: 'amateur',
        debugView: false,
        passesbl: 'polar',
        passesbr: 'sky',
        views: {
            polar: {
                colours: {
                    background: '001224',
                    border: '38554d',
                    grid: 'cccccc',
                    text: 'ffffff',
                    degcolour: '999999',
                    gradientstart: '374553',
                    gradientend: '001224'
                },
                defaultColours: {
                    background: '001224',
                    border: '38554d',
                    grid: 'cccccc',
                    text: 'ffffff',
                    degcolour: '999999',
                    gradientstart: '374553',
                    gradientend: '001224'
                }              
            }
        }
    };
    var COOKIENAME = 'agsattrack';
    var COOKIEEXPIRES = 30;
    
    /**
    * Save all of our settings to a cookie
    */
    function saveSettings() {
        if (AGSETTINGS.cookiesOk()) {
            var observersSettings = [];
            var observers = AGSatTrack.getObservers();
            jQuery.each(observers, function(index, observer) {
                observersSettings[index] = {
                    name: observer.getName(),
                    lat: observer.getLat(),
                    lon: observer.getLon(),
                    alt: observer.getAlt(),
                    auto: observer.getAutoGeo()
                };
            });              
            _settings.observers = observersSettings;
            var cookieData = JSON.stringify(_settings);
            
            jQuery.cookie(COOKIENAME, cookieData, { expires: COOKIEEXPIRES });
        } 
    }
    
    /**
    * Determine if its ok for us to use cookies.
    */
    function cookiesOK() {
        var result = true;
        
        if (_requireEUCookieLaw) {
            if(jQuery.cookie('cc_cookie_accept') === null && jQuery.cookie('cc_cookie_decline') === null) { 
                var dummy = false;
            } else {
                if (jQuery.cookie('cc_cookie_decline') === "cc_cookie_decline") {
                    result = false;
                }    
            }    
        } 
        return result;         
    }
    
    /**
    * Load settings from a cookie if one is found
    */
    if (jQuery.cookie(COOKIENAME) !== null) {
        var cookieData = jQuery.cookie(COOKIENAME);
        var savedSettings = JSON.parse(cookieData);
        _settings = $.extend({}, _settings, savedSettings);
    }
    
    /**
    * Look for any paramateres on the quesrystring and override
    * the defaults.
    * 
    * NOTE: This will also override any settings saved in the cookie
    * 
    */
    var qsView = AGQUERYSTRING.value('view');
    var qsGroup = AGQUERYSTRING.value('group');
    var qsSats = AGQUERYSTRING.value('sats');
    
    if (typeof qsGroup !== 'undefined') {
        _settings.defaultTleGroup = qsGroup;
    }
    if (typeof qsView !== 'undefined') {
        _defaultView = qsView;
    }    
    if (typeof qsSats !== 'undefined') {
        _defaultSats = qsSats;
    }      

	return {
		init: function() {
		},

        getDefaultSats : function() {
            return _defaultSats;    
        },
        setDefaultSats : function(value) {
            _defaultSats = value;
        },
                
        getDefaultView : function() {
            return _defaultView;    
        },
        setDefaultView : function(value) {
            _defaultView = value;
        },        
        
        getViewSettings : function(view) {
            return _settings.views[view];    
        },
        
        setViewColours: function(view, colours) {
            _settings.views[view].colours = colours;    
        },
        
        getObserver: function(index) {
            var result = null;
            
            if (typeof _settings.observers !== 'undefined' && typeof _settings.observers[index] !== 'undefined') {
                result = _settings.observers[index];   
            }
            return result;  
        },
        saveSettings: function() {
            saveSettings();    
        },
        cookiesOk: function() {
            return cookiesOK();
        },
        getRequireEUCookieLaw : function() {
            return _requireEUCookieLaw;    
        },

        getPassesBottomRightView : function() {
            return _settings.passesbr;    
        },
        setPassesBottomRightView : function(value) {
            _settings.passesbr = value;
        },
                
        getPassesBottomLeftView : function() {
            return _settings.passesbl;    
        },
        setPassesBottomLeftView : function(value) {
            _settings.passesbl = value;
        },
                
        getDebugView : function() {
            return _settings.debugView;    
        },
        setDebugView : function(value) {
            _settings.debugView = value;
        }, 
                
        getDefaultTLEgroup : function() {
            return _settings.defaultTleGroup;    
        },
        setDefaultTLEgroup : function(value) {
            _settings.defaultTleGroup = value;
        },         
        getAutoAddSats : function() {
            return _settings.autoAddSats;    
        },
        setAutoAddSats : function(value) {
            _settings.autoAddSats = value;
        }, 
                
        getShowPopupHelp : function() {
            return _settings.showPopupHelp;    
        },
        setShowPopupHelp : function(value) {
            _settings.showPopupHelp = value;
            jQuery(document).trigger('agsattrack.showpopuphelp', value);            
        },    
        getCalculateEvents : function() {
            return _calculateEvents;    
        },
        setCalculateEvents : function(value) {
            _calculateEvents = value;
        },      
        getDebugLevel : function() {
            return _debugLevel;    
        },
        setDebugLevel : function(value) {
            _debugLevel = value;
        },       
        getSPM : function() {
            return _spm;    
        },
        setSPM : function(value) {
            _spm = value;
        },   
        getSwitchViewOnTabClick : function() {
            return _settings.switchViewOnTabClick;
        },
        setSwitchViewOnTabClick : function(value) {
            _settings.switchViewOnTabClick = value;    
        },
        getHaveWebGL : function() {
            return _haveWebGl;
        },
        setHaveWebGL : function(value) {
            _haveWebGl = value;    
        },
        getHaveCanvas : function() {
            return _haveCanvas;
        },
        setHaveCanvas : function(value) {
            _haveCanvas = value;    
        },
		getAosEl : function() {
			return _settings.aosEl;
		},
		setAosEl : function(val) {
			_settings.aosEl = val;
		},
		getRefreshTimerInterval : function() {
			return _settings.refreshTimerInterval;
		},
		setRefreshTimerInterval : function(val) {
			_settings.refreshTimerInterval = val;
		}	

	};
})();