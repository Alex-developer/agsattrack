var AGSETTINGS = (function(element) {
	var _aosEl = 5;
	var _refreshTimerInterval = 5000;
	
	return {
		init: function() {
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