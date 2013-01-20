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

 
var AGHOMEVIEW = function() {
    'use strict';
    
    var _render = false;
    
    function resize(width, height) {
        if (typeof width === 'undefined' || typeof height === 'undefined') {
            var parent = jQuery('#home');
            width = parent.width();
            height = parent.height();
        }

        if (width !== 0 && height !== 0) {
        }          
    }

                  
    return {
        startRender : function() {
            resize();
            _render = true;
        },
        
        stopRender : function() {
            _render = false;            
        },
        
        init : function() {
                
        },
        
        resizeView : function(width, height) {
            resize(width, height);     
        }        
    };
};