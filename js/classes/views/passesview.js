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
var AGPASSESVIEW = function() {
	'use strict';
	var _render = false;
    var _polar;
	var _sky;
    var _currentPass = null;
    
    function resize(width, height) {

        if (typeof width === 'undefined' || typeof height === 'undefined') {
            var parent = jQuery('#passes');
            width = parent.width();
            height = parent.height();
        }

        if (width !== 0 && height !== 0) {
            jQuery('#passes').width(width);
            jQuery('#passes').height(height);
            jQuery('#passesgrid').datagrid('resize',{
                width: width-30,
                height: (height-35) / 2
            });
            _polar.resizeView((width-5) / 2, height / 2);      
            _sky.resizeView((width-5) / 2, height / 2);            
        }          

    }
    
    /**
    * Sets up the view when switched to.
    */
    function initToolbar() {
        jQuery('#passes-sat').children().remove();
        var sats = AGSatTrack.getSatellites();;
        var following = AGSatTrack.getFollowing();
        if (following !== null) {
            _polar.setSingleSat(following);
            _sky.setSingleSat(following);
            updatePassgrid(following);
            updatePassesList(following);
        } else {
            jQuery('#passes-passes').children().remove();
            jQuery('#passes-available').hide();
            jQuery('#passesgrid').datagrid('loadData',[]);             
        }
        jQuery('#passes-sat').append('<option value="-1">--- Select ---</option>'); 
        jQuery.each(sats, function(index, sat) {
            var selected = '';
            if (following !== null && following.getCatalogNumber() === sat.getCatalogNumber()) {
                selected = ' selected="selected"';
            }
            jQuery('#passes-sat').append('<option value="'+sat.getCatalogNumber()+'"'+selected+'>'+sat.getName()+'</option>'); 
        }); 
        
               
    }
    
    function updatePassgrid(sat, time) {
        var passData;
        var observers = AGSatTrack.getObservers();
        var observer = observers[0];
                        
        if (typeof time === 'undefined') {
            passData = sat.getNextPass(observer);
        } else {
            var passData = sat.getPassforTime(observer, time);
        }
        
        var data = [];
        for (var i=0; i < passData.pass.length; i++) {
            data.push({
                date: AGUTIL.shortdate(passData.pass[i].date),
                el: passData.pass[i].el.toFixed(2),
                az: passData.pass[i].az.toFixed(2),
                range: passData.pass[i].range.toFixed(0),
                footprint: passData.pass[i].footprint.toFixed(0),
                viz: passData.pass[i].viz,
            });
        }

        jQuery('#passesgrid').datagrid('loadData',data);        
    }
    
    function updatePassesList(sat) {
        var catalogNumber = sat.getCatalogNumber();
        var passes = sat.getTodaysPasses();
        if (passes === null) {
            var observers = AGSatTrack.getObservers();
            var observer = observers[0];                         
            passes = sat.calculateTodaysPasses(observer);
        }
        
        jQuery('#passes-passes').children().remove();                
        var lastDate = null;
        var inGroup = false;
        jQuery.each(passes, function(index, pass) {
            var selected = '';
            if (_currentPass !== null && _currentPass === pass.orbitNumber) {
                selected = ' selected="selected"';
            }
            var passDescription = AGUTIL.shortdate(pass.dateTimeStart) + ' (Peak El: '+pass.peakElevation.toFixed(2)+')';
            if (lastDate === null || pass.dateTimeStart.toDateString() !== lastDate.toDateString()) {
                if (inGroup) {
                    jQuery('#passes-passes').append('</optgroup>'); 
                }
                jQuery('#passes-passes').append('<optgroup label="'+pass.dateTimeStart.toDateString()+'">'); 
                lastDate = pass.dateTimeStart;
                inGroup = true;
            }
            jQuery('#passes-passes').append('<option value="'+pass.dateTimeStart.toString()+'"'+selected+'>'+passDescription+'</option>'); 
        }); 
        if (inGroup) {
            jQuery('#passes-passes').append('</optgroup>'); 
        }                               
        jQuery('#passes-available').show();            

        jQuery(document).trigger('agsattrack.satclicked', {catalogNumber: catalogNumber, state: true});        
        
    }
    
	return {
		startRender : function() {
            resize();
            initToolbar();
			_render = true;
            _polar.startRender();
            _sky.startRender();		
		},
		
		stopRender : function() {
			_render = false;
            _polar.stopRender();			
            _sky.stopRender();
		},

        resizeView : function(width, height) {
            resize(width, height);     
        },
        		
		init : function() {
            _polar = AGVIEWS.getNewView('polar','passespolar');
            _polar.init(AGPOLARVIEW.modes.SINGLE);
            _sky = AGVIEWS.getNewView('sky','passessky');
            _sky.init(AGSKYVIEW.modes.SINGLE);
            
            /**
            * Set the following sat when a new sat is selected in the 
            * drop down list on the ribbon bar.
            */
            jQuery('#passes-sat').on('change', function(e){
                AGSatTrack.getTles().deselectAll();
                var catalogNumber = jQuery('#passes-sat').find(":selected").val();
                if (catalogNumber !== '-1') {
                    var sat = AGSatTrack.getSatelliteByName(catalogNumber);
                    sat.setSelected(true);
                    AGSatTrack.setFollowing(sat);
                    _polar.setSingleSat(sat);
                    _sky.setSingleSat(sat);
                    updatePassesList(sat);
                    updatePassgrid(sat);
                } else {
                    AGSatTrack.setFollowing(null);
                    _polar.setSingleSat(null);   
                    _sky.setSingleSat(null);
                    jQuery('#passes-passes').children().remove();
                    jQuery('#passes-available').hide();
                    jQuery('#passesgrid').datagrid('loadData',[]);  
                }
                _polar.reDraw();
                _sky.reDraw();
            });
            
            jQuery('#passes-passes').on('change', function(e){
                var time = jQuery('#passes-passes').find(":selected").val();
                var sat =  AGSatTrack.getFollowing();
                time = new Date(time);               
                _polar.setPassToShow(time);
                _sky.setPassToShow(time);
                updatePassgrid(sat, time);
                _polar.reDraw();
                _sky.reDraw();
            });
            
		}		
	}
}