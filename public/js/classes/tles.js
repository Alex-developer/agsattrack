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
 
/* Options for JSHint http://www.jshint.com/
* 
* Last Checked: 25/01/2013
* 
*/
/*global AGSatTrack, AGVIEWS, AGSATELLITE, AGSETTINGS */ 
 
var AGTLES = function() {
	'use strict';
	
    var baseUrl = '/elements/';
	var updateUrl = '/elements/update/';
	var _group = '';
    var _groupName = '';
	var rawKeps = '';
	var satellites = [];
	var satIndex;
    var sat;
    
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
        AGVIEWS.tlesLoaded();
        jQuery(document).trigger('agsattrack.tlesloaded', _group);
	}
	
	/**
	 * Listen for changes in the satellite selection
	 */
	jQuery(document).bind('agsattrack.satsselected', function(event, selection) {
		var i;
        
        for (i=0; i < satellites.length; i++) {
			satellites[i].setDisplaying(false);
		}
		if (typeof selection.selections !== 'undefined') {
			for (i=0; i < selection.selections.length; i++) {
                var index = getSatelliteIndexFromCatalogNumber(selection.selections[i]);
				satellites[index].setDisplaying(true);
			}
		}
        var selectedSatellites = getSelected();
        jQuery(document).trigger('agsattrack.satsselectedcomplete', {selected: selectedSatellites});        
	});

    jQuery(document).bind('agsattrack.updategroup', function() {
        jQuery('#home-update-elements').disable();
        jQuery('#home-update-elements').stop();  
        var url = updateUrl + _group;

        jQuery.getJSON(url, function(data) {
            loadElements(_group);    
        });
    
    });
        
    function getSatelliteIndexFromCatalogNumber(noradId) {
        var index = -1;
        for (var i=0; i < satellites.length; i++) {
            if (satellites[i].getCatalogNumber() === noradId) {
                index = i;
                break;
            }
        } 
        return index;           
    }

    function getSelected() {
        var satelliteList = [];
        for (var i=0; i < satellites.length; i++) {
            if (satellites[i].isDisplaying() && satellites[i].getSelected()) {
                satelliteList.push(satellites[i]);
            }
        }
        return satelliteList;           
    }
	
    function loadElements(group) {
        var url = baseUrl + group;

        jQuery.getJSON(url, function(data) {
            satellites = [];
            _group = data.id;
            var groupData = jQuery('#sat-group-selector-listbox').jqxListBox('getItemByValue', group);
            if (typeof groupData !== 'undefined') {
                _groupName = groupData.label;
                rawKeps = data.keps.split('\n');
                processRawData();
                
                if (data.averageage >= data.updateat) {
                    jQuery('#home-update-elements').enable();
                    jQuery('#home-update-elements').pulse({
                        opacity: [0,1]
                    }, {
                        duration: 1000,
                        times: 30,
                        easing: 'linear',
                        complete: function() {
                        }
                    });                        
                }
                //jQuery('#home-update-elements').enable();
            }
        });            
    }
    
	return {
	
        getSelected : function() {
            return getSelected();
        },
        
        deselectAll : function() {
            for (var i=0; i < satellites.length; i++) {
                satellites[i].setSelected(false);
            }             
        },
        
        displayAll : function() {
            for (var i=0; i < satellites.length; i++) {
                satellites[i].setDisplaying(true);
            }            
        },

        displayNone : function() {
            for (var i=0; i < satellites.length; i++) {
                satellites[i].setDisplaying(false);
            }            
        },
                
        getDisplaying : function() {
            var satelliteList = [];
            for (var i=0; i < satellites.length; i++) {
                if (satellites[i].isDisplaying()) {
                    satelliteList.push(satellites[i]);
                }
            }
            return satelliteList;            
        },
                
        getCount : function() {
            return satellites.length;    
        },
        
		getTotalDisplaying : function() {
			var total = 0;
			for (var i=0; i < satellites.length; i++) {
				if (satellites[i].isDisplaying()) {
					total++;
				}
			}
			return total;
		},
		
		calcAll: function(date, observer, mutualObserver) {
            AGSatTrack.getUI().updateStatus('Updating All Satellites ...');
			for (var i=0; i < satellites.length; i++) {

				if (satellites[i].isDisplaying()) {
					satellites[i].calc(date, observer, mutualObserver);
				}
			}
            AGSatTrack.getUI().updateStatus('Idle');
		},
		
        resetAll : function() {
            for (var i=0; i < satellites.length; i++) {
                satellites[i].setSelected(false);
                satellites[i].setDisplaying(false);
            }            
        },
        
        getSatelliteIndex : function(name) {
            return getSatelliteIndexFromCatalogNumber(name);          
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
		
        getGroupName : function() {
            return _groupName;    
        },
        
		load: function(group) {
            loadElements(group);
		}
	};
};