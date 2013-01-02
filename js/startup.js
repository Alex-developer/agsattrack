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
jQuery(document).ready(function() {
    
    /**
    * Check if webGL is really supported. Some devices, like the iPad report, via Modernizer that webGL
    * is available when in fact it is not.
    */
    function webGlTest() {
        var result = false;
        var disableWebGLOn = {
            product : ['ipad', 'iphone', 'ipod'],
            name : ['ie']
        };
        
        function isWebBGLSupported() {
            var result = true;
            
            for(var property in disableWebGLOn){
                for (i=0;i<disableWebGLOn[property].length;i++) {
                    if (platform[property]) {
                        if (disableWebGLOn[property][i] === platform[property].toLowerCase()) {
                            result = false;
                            break;
                        }
                    }    
                }
            }
            return result;  
        }
            
        if (Modernizr.webgl) {
            result = isWebBGLSupported();
        } else {
            result = false;
        }
        
        return result;
    }
    
    Modernizr.load({
      test: webGlTest(),
      yep : 'js/cesium/Unminified/Cesium.js',
      complete : function() {
          AGSETTINGS.setHaveWebGL(webGlTest());
          AGSETTINGS.setHaveCanvas(Modernizr.canvas);
          AGSatTrack = new agsattrack();
          AGSatTrack.init();            
      }
    });
       
});