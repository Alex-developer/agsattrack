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
Modernizr.load([
  {
    test : Modernizr.canvas,
    yep: [
            'js/classes/views/3dview.js', 'js/classes/views/polarview.js', 'js/classes/views/skyview.js',
            'js/classes/views/timelineview.js',
            'js/kinetic/kinetic.js'
    ],
    nope : ['js/redirect.js'],
    both : [
            'js/cesium/Cesium.js',
            'js/agsattrack.js',
            'js/cookies/jquery.cookies.js',
            'js/classes/settings.js',
            'js/checklist/jquery.ui.checkList.js',
            'js/classes/views/passesview.js', 'js/classes/views/listview.js',  'js/classes/views/options.js',
            'js/classes/tle.js', 'js/classes/observer.js','js/classes/satellite.js','js/classes/ui.js','js/classes/tles.js','js/classes/sgp4.js',
        	'js/classes/util.js', 'js/classes/date.js',
        	'js/classes/sunmoon.js',
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