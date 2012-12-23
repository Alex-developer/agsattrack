Modernizr.load([
  {
    test : Modernizr.webgl,
    yep: ['js/cesium/Cesium.js', 'js/agsattrack-webgl.js'],
    nope : ['js/agsattrack-nonwebgl.js'],
    both : [
            'js/cookies/jquery.cookies.js',
            'js/classes/settings.js',
            'js/checklist/jquery.ui.checkList.js',
            'js/classes/tle.js', 'js/classes/observer.js','js/classes/satellite.js','js/classes/ui.js','js/classes/tles.js','js/classes/sgp4.js',
        	'js/classes/util.js', 'js/classes/date.js',
        	'js/classes/views/3dview.js', 'js/classes/views/passesview.js', 'js/classes/views/polarview.js', 'js/classes/views/skyview.js', 'js/classes/views/listview.js',
        	'js/classes/views/timelineview.js', 'js/classes/views/options.js',
        	'js/classes/sunmoon.js',
        	'js/kinetic/kinetic.js',
        	'js/agsatbox/agsatbox.js'
           ],
    complete : function () {
    	
    	opsmode = 'i';
    	
    	jQuery(document).ready(function() {
    		
    		//jQuery(document.body).showLoading();
    		
    		AGSatTrack = new agsattrack();
    		AGSatTrack.init();
    		});
    	

      }    
  }
]);