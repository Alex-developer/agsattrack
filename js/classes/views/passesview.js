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
*/
/*global AGVIEWS,AGSatTrack,AGUTIL,AGSETTINGS */
  
var AGPASSESVIEW = function() {
	'use strict';
    
	var _render = false;
    var _bottomLeft = null;
	var _bottomRight = null;
    var _currentPass = null;
    
    /**
    * when a new set of elements are loaded ensure that the views are reset
    * 
    */
    jQuery(document).bind('agsattrack.tlesloaded', function(e, group) {
        _bottomLeft.reset();
        _bottomRight.reset();
        jQuery('#passesgrid').datagrid('loadData',[]);    
    });
    
    /**
    * Update the view in the bottom left
    */
    jQuery(document).bind('agsattrack.passesblview', function(event, view) {
        if (_render) {
            AGVIEWS.destroyView(_bottomLeft);
            _bottomLeft = AGVIEWS.getNewView(view,'passbottomleft');
            _bottomLeft.init(AGVIEWS.modes.SINGLE);
            
            var catalogNumber = jQuery('#passes-sat').find(":selected").val();
            if (catalogNumber !== '-1') {
                var sat = AGSatTrack.getSatelliteByName(catalogNumber);
                _bottomLeft.setSingleSat(sat);
                
                var time = jQuery('#passes-passes').find(":selected").val();
                time = new Date(time);               
                _bottomLeft.setPassToShow(time);             
            } else {
                _bottomLeft.setSingleSat(null);    
            }
            _bottomLeft.startRender();
            resize();          
        }
    });

    /**
    * Update the view in the bottom right
    */
    
    jQuery(document).bind('agsattrack.passesbrview', function(event, view) {
        if (_render) {
            AGVIEWS.destroyView(_bottomRight);
            _bottomRight = AGVIEWS.getNewView(view,'passbottomright');
            _bottomRight.init(AGVIEWS.modes.SINGLE);
            var catalogNumber = jQuery('#passes-sat').find(":selected").val();
            if (catalogNumber !== '-1') {
                var sat = AGSatTrack.getSatelliteByName(catalogNumber);
                _bottomRight.setSingleSat(sat);
                
                var time = jQuery('#passes-passes').find(":selected").val();
                time = new Date(time);               
                _bottomRight.setPassToShow(time);             
            } else {
                _bottomRight.setSingleSat(null);    
            }                         
            _bottomRight.startRender();
            resize();
        }
    });
    
    /**
    * resize the view
    */
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
                width: width-5,
                height: (height-35) / 2
            });
            _bottomLeft.resizeView((width-5) / 2, height / 2);      
            _bottomRight.resizeView((width-5) / 2, height / 2);            
        }          

    }
    
    /**
    * Sets up the view when switched to.
    */
    function initToolbar() {
        jQuery('#passes-sat').children().remove();
        var sats = AGSatTrack.getSatellites();
        var following = AGSatTrack.getFollowing();
        if (following !== null) {
            if (following.isGeostationary()) {
                jQuery('#pass-info-table').hide();
                jQuery('#passes-available').hide();
                jQuery('#passes-available').next().hide();
                jQuery('#pass-info-geostationary').show();    
            } else {
                jQuery('#pass-info-geostationary').hide();  
                jQuery('#pass-info-table').show();              
                _bottomLeft.setSingleSat(following);
                _bottomRight.setSingleSat(following);
                updatePassgrid(following);
                updatePassesList(following);
            }
        } else {
            jQuery('#passes-passes').children().remove();
            jQuery('#passes-available').hide();
            jQuery('#passes-available').next().hide();
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

    /**
    * Update the datagrid with details of the satellites pass.    
    */
    function updatePassgrid(sat, time) {
        var passData;
        var observers = AGSatTrack.getObservers();
        var observer = observers[0];
                        
        if (typeof time === 'undefined') {
            passData = sat.getNextPass(observer);
        } else {
            passData = sat.getPassforTime(observer, time);
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
                delay: passData.pass[i].signaldelay.toFixed(0),
                loss: passData.pass[i].signalloss.toFixed(0),
                doppler: passData.pass[i].dopplershift.toFixed(0)
            });
        }

        jQuery('#passesgrid').datagrid('loadData',data);        
    }
    
    /**
    * Update the list of available passes for a satellite
    */
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
        jQuery('#passes-available').next().show();
                    

        jQuery(document).trigger('agsattrack.satclicked', {catalogNumber: catalogNumber, state: true});        
        
    }
    
    /**
    * Create the default views
    */
    function setDefaultViews() {
        _bottomLeft = AGVIEWS.getNewView(AGSETTINGS.getPassesBottomLeftView(),'passbottomleft');
        _bottomLeft.init(AGVIEWS.modes.SINGLE);
        _bottomRight = AGVIEWS.getNewView(AGSETTINGS.getPassesBottomRightView(),'passbottomright');
        _bottomRight.init(AGVIEWS.modes.SINGLE);       
    }
    
	return {
		startRender : function() {
            resize();
            initToolbar();
			_render = true;
            _bottomLeft.startRender();
            _bottomRight.startRender();		
		},
		
		stopRender : function() {
			_render = false;
            _bottomLeft.stopRender();			
            _bottomRight.stopRender();
		},

        resizeView : function(width, height) {
            resize(width, height);     
        },
	
		init : function() {
            
            setDefaultViews();
            
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
                    if (sat.isGeostationary()) {
                        jQuery('#pass-info-table').hide();
                        jQuery('#passes-available').hide();
                        jQuery('#passes-available').next().hide();
                        jQuery('#pass-info-geostationary').show();    
                    } else {
                        jQuery('#pass-info-geostationary').hide();  
                        jQuery('#pass-info-table').show();  
                        _bottomLeft.setSingleSat(sat);
                        _bottomRight.setSingleSat(sat);
                        updatePassesList(sat);
                        updatePassgrid(sat);
                    }
                } else {
                    AGSatTrack.setFollowing(null);
                    _bottomLeft.setSingleSat(null);   
                    _bottomRight.setSingleSat(null);
                    jQuery('#passes-passes').children().remove();
                    jQuery('#passes-available').hide();
                    jQuery('#passes-available').next().hide();
                    jQuery('#passesgrid').datagrid('loadData',[]);  
                }
                _bottomLeft.reDraw();
                _bottomRight.reDraw();
            });
            
            jQuery('#passes-passes').on('change', function(e){
                var time = jQuery('#passes-passes').find(":selected").val();
                var sat =  AGSatTrack.getFollowing();
                time = new Date(time);               
                _bottomLeft.setPassToShow(time);
                _bottomRight.setPassToShow(time);
                updatePassgrid(sat, time);
                _bottomLeft.reDraw();
                _bottomRight.reDraw();
            });
            
		}		
	};
};