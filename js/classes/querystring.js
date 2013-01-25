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
 
// This is public domain code written in 2011 by Jan Wolter and distributed
// for free at http://unixpapa.com/js/querystring.html

/* Options for JSHint http://www.jshint.com/
* 
* Last Checked: 25/01/2013
* 
*/

var AGQUERYSTRING = (function() {
    "use strict";
    
    var dict = {};
    var qs = '';
    var match;
    
    qs = location.search;

    if (qs.charAt(0) === '?') {
        qs = qs.substring(1);    
    }

    var re = /([^=&]+)(=([^&]*))?/g;
    while ((match = re.exec(qs))) {
        var key= decodeURIComponent(match[1].replace(/\+/g,' '));
        var value= match[3] ? decode(match[3]) : '';
        if (dict[key]) {
            dict[key].push(value);
        } else {
            dict[key]= [value];
        }
    }    
   
   function decode(s) {
        s = s.replace(/\+/g,' ');
        s = s.replace(/%([EF][0-9A-F])%([89AB][0-9A-F])%([89AB][0-9A-F])/g,
        function(code,hex1,hex2,hex3) {
            var n1 = parseInt(hex1,16)-0xE0;
            var n2 = parseInt(hex2,16)-0x80;
            if (n1 === 0 && n2 < 32) {
                return code;
            }
            var n3 = parseInt(hex3,16)-0x80;
 /*jslint bitwise: true*/ 
            var n = (n1<<12) + (n2<<6) + n3;
 /*jslint bitwise: false*/ 
            if (n > 0xFFFF) {
                return code;
            }
            return String.fromCharCode(n);
        });
        s = s.replace(/%([CD][0-9A-F])%([89AB][0-9A-F])/g,
        function(code,hex1,hex2) {
            var n1 = parseInt(hex1,16)-0xC0;
            if (n1 < 2) {
                return code;
            }
            var n2 = parseInt(hex2,16)-0x80;
 /*jslint bitwise: true*/             
            return String.fromCharCode((n1<<6)+n2);           
        });
        s = s.replace(/%([0-7][0-9A-F])/g,
        function(code,hex) {
            return String.fromCharCode(parseInt(hex,16));
        });
        return s;
    }
    
    return {

        value : function(key) {
            var a = dict[key];
            return a ? a[a.length-1] : undefined;
        },

        values : function (key) {
            var a= this.dict[key];
            return a ? a : [];
        },

        keys : function () {
            var a= [];
            for (var key in dict) {
                if (dict.hasOwnProperty(key)) {
                    a.push(key);
                }
            }
            return a;
        }
        
    };
    
})();