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
var AGVIEWS = (function(element) {
    var _views = {
        '3d' : {
            classname : 'AG3DVIEW',
            active : false,
            index: 1
        },
        'passes' : {
            classname : 'AGPASSESVIEW',
            active : false,
            index: 2
        },
        'sky' : {
            classname : 'AGSKYVIEW',
            active : false,
            index: 4
        },
        'polar' : {
            classname : 'AGPOLARVIEW',
            active : false,
            index: 3
        },
        'list' : {
            classname : 'AGLISTVIEW',
            active : true,
            index: 0
        },
        'timeline' : {
            classname : 'AGTIMELINE',
            active : false,
            index: 5
        },
        'options' : {
            classname : 'AGOPTIONS',
            active : false,
            index: 6
        }        
    };
    
    return {
    
        getViews : function() {
            return _views;
        },
        
        getViewFromIndex : function(index) {
            var view = null;
            jQuery.each(_views, function(_view, _options) {
                if (_options.index === index) {
                    view = _options;
                }  
            });
            return view;    
        }   

    }
})();