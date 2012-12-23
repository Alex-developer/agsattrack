var AGOPTIONS = function() {
	'use strict';
	
	var _render = false;
	var _dirty = false;
	
	jQuery(document).bind('agsattrack.satclicked', function() {
		setupOptions();
		_dirty = false;		
	});
	
	function setupOptions() {
		jQuery('#window-preferences-calc-timer').numberspinner('setValue', AGSETTINGS.getRefreshTimerInterval() /1000);
		jQuery('#window-preferences-aos').numberspinner('setValue', AGSETTINGS.getAosEl());
	}
	
	jQuery('#window-preferences-calc-timer').numberspinner({
		onSpinUp : function() {
			spinnerChanged();
		},
		onSpinDown : function() {
			spinnerChanged();
		}
	});
	jQuery('#window-preferences-aos').numberspinner({
		onSpinUp : function() {
			spinnerChanged();
		},
		onSpinDown : function() {
			spinnerChanged();
		}
	});	
	function spinnerChanged() {
		jQuery('#options-save').enable();
	}
	
	jQuery('#options-save').click(function(){
		var temp = jQuery('#window-preferences-calc-timer').numberspinner('getValue') * 1000;
		AGSETTINGS.setRefreshTimerInterval(temp)

		var temp = jQuery('#window-preferences-aos').numberspinner('getValue');
		AGSETTINGS.setAosEl(temp)

		
		jQuery('#options-save').disable();
	});
	
	return {
		startRender : function() {
			_render = true;
		},
		
		stopRender : function() {
			_render = false;			
		},
		
		init : function() {
			
		}
	}
}