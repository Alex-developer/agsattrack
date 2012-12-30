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
    opsmode = 'i';
    
    //var planets = new AGPLANETS();
    
   // var pos = planets.PlanetAlt();
   
        
    Modernizr.load({
      test: Modernizr.webgl,
      yep : 'js/cesium/Cesium.js',
      complete : function() {
          AGSETTINGS.setHaveWebGL(Modernizr.webgl);
          AGSETTINGS.setHaveCanvas(Modernizr.canvas);
          AGSatTrack = new agsattrack();
          AGSatTrack.init();            
      }
    });
       
});