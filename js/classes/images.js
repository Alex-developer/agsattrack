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
/*global AGUTIL */

var AGIMAGES = (function() {
    'use strict';

    var _images = [];
    
    AGUTIL.loadImages({
        city: '/images/city.png',
        home: '/images/home.png',
        satellite16: '/images/satellite-16.png',
        satellite24: '/images/satellite-24.png',
        satellite32: '/images/satellite-32.png',
        iss16: '/images/iss-16.png',
        iss32: '/images/iss-32.png',
        generic: '/images/planets/generic.png',
        jupiter: '/images/planets/jupiter.png',
        saturn: '/images/planets/saturn.png',
        mars: '/images/planets/mars.png',
        uranus: '/images/planets/uranus.png',
        neptune: '/images/planets/neptune.png',
        sun: '/images/planets/sun.png',
        mercury: '/images/planets/mercury.png',
        venus: '/images/planets/venus.png',
        moon1: '/images/moon/phase1.png',
        moon2: '/images/moon/phase2.png',
        moon3: '/images/moon/phase3.png',
        moon4: '/images/moon/phase4.png',
        moon5: '/images/moon/phase5.png',
        moon6: '/images/moon/phase6.png',
        moon7: '/images/moon/phase7.png',
        moon8: '/images/moon/phase8.png',
        moon9: '/images/moon/phase9.png',
        moon10: '/images/moon/phase10.png',
        moon11: '/images/moon/phase11.png',
        moon12: '/images/moon/phase12.png',
        moon13: '/images/moon/phase13.png',
        moon14: '/images/moon/phase14.png',
        moon15: '/images/moon/phase15.png',
        moon16: '/images/moon/phase16.png',
        moon17: '/images/moon/phase17.png',
        moon18: '/images/moon/phase18.png',
        moon19: '/images/moon/phase19.png',
        moon20: '/images/moon/phase20.png',
        moon21: '/images/moon/phase21.png',
        moon22: '/images/moon/phase22.png',
        moon23: '/images/moon/phase23.png',
        moon24: '/images/moon/phase24.png',
        moon25: '/images/moon/phase25.png',
        moon26: '/images/moon/phase26.png',
        moon27: '/images/moon/phase27.png',
        moon28: '/images/moon/phase28.png',
        moon29: '/images/moon/phase29.png',
        moon30: '/images/moon/phase30.png'
    }, function(loadedImages){
        _images = loadedImages;
    });
    
        
    return {
    
        getImage : function(imageName, fallbackImage) {
            var image;
            
            if (typeof _images[imageName] !== 'undefined') {
                image = _images[imageName];
            } else {
                image = _images[fallbackImage];
            }
            
            return image;            
        }
    };
    
})();