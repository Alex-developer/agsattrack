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
var AGTLES = function() {
	'use strict';
	
	var baseUrl = 'ajax.php?keps=';
	var group = '';
	var rawKeps = '';
	var satellites = [];
	
	function processRawData() {
        var tle = [];
        for (var linenum = 0; linenum < rawKeps.length; linenum++) {
            if (rawKeps[linenum].substring(0, 2) === '1 ') {
                tle[1] = rawKeps[linenum];
            }
            else if (rawKeps[linenum].substring(0, 2) === '2 ') {
                tle[2] = rawKeps[linenum];
                var tmp = new AGSATELLITE(tle[0],tle[1],tle[2]);
                satellites.push(tmp);
                tle = [];
            }
            else {
                var name = rawKeps[linenum];
                name = name.replace(/(\r\n|\n|\r)/gm,'');
                name = name.replace(/\s+$/,'');
                tle[0] = name;
            }
        }
        jQuery(document).trigger('agsattrack.tlesloaded', group);
	}
	
	/**
	 * Listen for changes in the satellite selection
	 */
	jQuery(document).bind('agsattrack.satsselected', function(event, selection) {
		for (var i=0; i < satellites.length; i++) {
			satellites[i].setDisplaying(false);
		}
		if (typeof selection.selections !== 'undefined') {
			for (var i=0; i < selection.selections.length; i++) {
				satellites[selection.selections[i].value].setDisplaying(true);
			}
		}
	});
	
	return {
		
		getTotalSelected : function() {
			var total = 0;
			for (var i=0; i < satellites.length; i++) {
				if (satellites[i].isDisplaying()) {
					total++
				}
			}
			return total;
		},
		
		calcAll: function(date, observer, selected) {
			for (var i=0; i < satellites.length; i++) {
				if (satellites[i].isDisplaying()) {
					satellites[i].calc(date, observer);
					if (selected !== null && i === selected.index) {
						satellites[i].calculateOrbit(observer);
					}
				}
			}
		},
		
		getSatellites : function() {
			return satellites;
		},
		getSatellite : function(pos) {
			return satellites[pos];
		},
		
		getNames : function() {
			var names = [];
			for (var i=0; i < satellites.length; i++) {
				names.push(satellites[i].getName());
			}
			return names;
		},
		
		load: function(group) {
			var url = baseUrl + group;
			
			jQuery.getJSON(url, function(data) {
				satellites = [];
				group = data.id;
				rawKeps = data.keps.split('\n');
				processRawData();
			});			
		}
	
	}
}