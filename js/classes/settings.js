/*
Copyright 2012 Alex Greenland

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
var AGSETTINGS = (function(element) {
	var _aosEl = 5;
	var _refreshTimerInterval = 5000;
	var _haveCanvas = true;
    var _switchViewOnTabClick = true;
    var _haveWebGl = false;
    var _spm = 'isana';
    
	return {
		init: function() {
		},

        getSPM : function() {
            return _spm;    
        },
        setSPM : function(value) {
            _spm = value;
        },
                
        getSwitchViewOnTabClick : function() {
            return _switchViewOnTabClick;
        },
        setSwitchViewOnTabClick : function(value) {
            _switchViewOnTabClick = value;    
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
			return _aosEl;
		},
		setAosEl : function(val) {
			_aosEl = val
		},
		
		getRefreshTimerInterval : function() {
			return _refreshTimerInterval;
		},
		setRefreshTimerInterval : function(val) {
			_refreshTimerInterval = val;
		}	

	}
})();