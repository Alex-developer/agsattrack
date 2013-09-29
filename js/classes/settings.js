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

var clone = (function(){ 
  return function (obj) { Clone.prototype=obj; return new Clone() };
  function Clone(){}
}());

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
    var _cookieVersion = 3.0;
    
    var _defaultSettings = {
        version: _cookieVersion,
        aosEl: 5,
        refreshTimerInterval : 5000,
        showPopupHelp : false,
        autoAddSats: true,
        defaultTleGroup: 'amateur',
        debugView: false,
        passesbl: 'polar',
        passesbr: 'sky',
        observer: {
            auto: true,
            enabled: true,
            name: '',
            lat: 0,
            lon: 0,
            height: 0    
        },
        mutualObserver: {
            auto: false,
            enabled: false,
            name: '',
            lat: 0,
            lon: 0,
            height: 0    
        },
        mutualObserverEnabled: false,
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
            },
            threed: {
                staticimage : 'NE2_50M_SR_W_4096.jpg',
                unselectedIcon: 1,
                selectedIcon: 1,
                unselectedIconSize: 32,
                selectedIconSize: 64,
                unselectedLabelSize: 12,
                selectedLabelSize: 14,
                unselectedLabelColour: 'f7ff0a',
                selectedLabelColour: 'ff0000',
                view: 'threed',
                provider : 'staticimage',
                useTerrainProvider: true,
                fillFootprints: false,
                showGroundSSP: true,
                fillMutual: false,
                showCities: false,
                cityPopulation: 2,
                cityFontSize: 12,
                cityLabelColour: 'ffffff' 
            }
        }
    };
    
    var _settings = jQuery.extend(true, {}, _defaultSettings);
        
    var COOKIENAME = 'agsattrack';
    var COOKIEEXPIRES = 30;
    
    /**
    * Save all of our settings to a cookie
    */
    function saveSettings() {
        if (AGSETTINGS.cookiesOk()) {
            
            var observer = AGSatTrack.getObserver(AGOBSERVER.types.HOME);
            _settings.observer.name = observer.getName();
            _settings.observer.lat = observer.getLat();
            _settings.observer.lon = observer.getLon();
            _settings.observer.alt = observer.getAlt();
            _settings.observer.enabled = observer.getEnabled();
            _settings.observer.auto = observer.getAutoGeo();
            
            observer = AGSatTrack.getObserver(AGOBSERVER.types.MUTUAL);
            _settings.mutualObserver.name = observer.getName();
            _settings.mutualObserver.lat = observer.getLat();
            _settings.mutualObserver.lon = observer.getLon();
            _settings.mutualObserver.alt = observer.getAlt();
            _settings.mutualObserver.enabled = observer.getEnabled();
            _settings.mutualObserver.auto = observer.getAutoGeo();
                        
            var cookieData = JSON.stringify(_settings);
            
            jQuery.cookie(COOKIENAME, cookieData, { expires: COOKIEEXPIRES });
            jQuery(document).trigger('agsattrack.settingssaved');
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
            _settings = $.extend(true, _settings, savedSettings);  

/*        if (typeof savedSettings.version !== 'undefined' && savedSettings.version == _cookieVersion) {
            _settings = $.extend({}, _settings, savedSettings);  
        } else {
            _forceReset = true;
        }
 */
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

        reset: function() {
            _settings = jQuery.extend(true, {}, _defaultSettings);
            var observer = AGSatTrack.getObserver(AGOBSERVER.types.HOME);
            observer.init(_settings.observer);
            observer = AGSatTrack.getObserver(AGOBSERVER.types.MUTUAL);
            observer.init(_settings.mutualObserver);
            saveSettings();    
        },
        
        getMutualObserverEnabled : function() {
            return _settings.mutualObserverEnabled;    
        },
        setMutualObserverEnabled : function(value) {
            _settings.mutualObserverEnabled = value;
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
        
        setViewSettings : function(view, settings) {
            return _settings.views[view] = settings;    
        },
                
        setViewColours: function(view, colours) {
            _settings.views[view].colours = colours;    
        },
        
        getObserver: function() {
            return _settings.observer;  
        },
        getMutualObserver: function() {
            return _settings.mutualObserver;  
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