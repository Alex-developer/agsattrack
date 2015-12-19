var TBTEST = function() {
	'use strict';

	var _tles = new AGTLES();

	jQuery('#ag-satselector').agsatbox({
		effect : null,
		width: 600,
		height: 400,
		onChange : function() {

		}
	});

        
    jQuery('#ag-satselector').agsatbox('clear');
    
	jQuery('#ribbon').ribbon();

	jQuery(document).on('click', function(e) {
		// debugger;
	});

	_tles.load('amateur');

	

	jQuery(document).bind('agsattrack.tlesloaded', function(e, group) {
		jQuery('#ag-satselector').agsatbox('setData', _tles);	
	});

	return {

	}
}

jQuery(document).ready(function() {
	var tbtest = new TBTEST();
});