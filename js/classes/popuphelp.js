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
var AGPOPUPHELP = function() {
    'use strict';
    var _helpAgent = null;    
    var ANIMATETIMER = 10000;
    var _queueItem = null;
    
    if (AGSETTINGS.getShowPopupHelp()) {
        clippy.load('Links', function(agent) {
            var windowWidth = jQuery(window).width();
            var windowHeight = jQuery(window).height();
            _helpAgent = agent;
            
            _helpAgent.show();
            _helpAgent.moveTo(windowWidth - 110, windowHeight - 100, 0);
            
            jQuery('.clippy-balloon').on('click', function(){
                _helpAgent.closeBalloon(true);    
            });
        }, function(){
        }); 
        jQuery(document).bind('agsattrack.showpopuphelp', function(state) {
            if (state) {
                _helpAgent.show();    
            } else {
                _helpAgent.hide();
            }
        }); 
    }
              
    function randomAnimation() {
        if (_helpAgent !== null) {
            _helpAgent.animate();
        }
        setTimeout(randomAnimation, ANIMATETIMER);
    }
    if (AGSETTINGS.getShowPopupHelp()) {
        randomAnimation();
    }
    
    function waitForHelper() {
        if (_helpAgent !== null) {
            _helpAgent.tip(_queueItem, true);
        }
        setTimeout(waitForHelper, 250);        
    }
        
    return {
        showHelp: function(helpText) {
            if (AGSETTINGS.getShowPopupHelp()) {            
                if (_helpAgent === null) {
                    _queueItem = helpText;
                    waitForHelper();   
                } else {
                    _helpAgent.tip(helpText, true);
                }
            }
        },
        
        closeBalloon : function(fast) {
            if (AGSETTINGS.getShowPopupHelp()) {
                if (_helpAgent === null) {             
                    _helpAgent.closeBalloon(fast);  
                }
            }
        } 

    };
};