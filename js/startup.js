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
* Last Checked: 19/01/2013
* 
*/
/*global AGSatTrack, Agsattrack, Modernizr, AGUTIL, AGSETTINGS, AGSPMENGINE */ 

 /**
 * Shim to support animation frames
 */
window.requestAnimFrame = (function() {
 'use strict';    
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

/**
* Delayed trigger hack
*/
$.fn.delayedTrigger = function(duration, eventName, event) {
 'use strict';
     
  var target = this;
  var timeoutId = $.delayedEvents[eventName];
  if (timeoutId) {
    clearTimeout(timeoutId);
  }
  $.delayedEvents[eventName] = setTimeout(function() { 
    delete $.delayedEvents[eventName];
    target.trigger(eventName, event);
  }, duration);
};
$.delayedEvents = {}; 
    
jQuery(document).ready(function() {
    'use strict';    
    
    Modernizr.load({
      test: AGUTIL.webGlTest(),
      yep : 'js/cesium/Unminified/Cesium.js',
      complete : function() {
          AGSETTINGS.setHaveWebGL(AGUTIL.webGlTest());
          AGSETTINGS.setHaveCanvas(Modernizr.canvas);          
          
          AGSPMENGINE.loadSPMEngine(function(){
            AGSatTrack = new Agsattrack();
            AGSatTrack.init();      
            
            if (AGSETTINGS.getRequireEUCookieLaw()) {
                jQuery.cookieCuttr({
                    cookieDeclineButton: true,
                    cookieAnalytics: false,
                    cookiePolicyLink: 'privacy_policy.html'
                });
            }
      
          });
      }
    });
});

var AGSatTrack;