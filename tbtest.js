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

	jQuery('#ribbon').ribbon();

	jQuery(document).on('click', function(e) {
		// debugger;
	});

	_tles.load('amateur');

	

	jQuery(document).bind('agsattrack.tlesloaded', function(e, group) {
		var names = _tles.getNames();
		var items = [];

		for ( var i = 0; i < names.length; i++) {
			var item = {
				text : names[i],
				value : i
			};
			items.push(item);

		}

		jQuery('#ag-satselector').agsatbox('setData', items);	
	});

	return {

	}
}

jQuery(document).ready(function() {
	var tbtest = new TBTEST();
});