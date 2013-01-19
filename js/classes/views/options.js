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
* 
*/
/*global AGSatTrack, AGVIEWS, AGSETTINGS */ 
 
var AGOPTIONS = function() {
	'use strict';
	
	var _render = false;
	var _dirty = false;
	var _polarPreview = null;
    
	jQuery(document).bind('agsattrack.satclicked', function() {
		setupOptions();
		_dirty = false;		
	});
	
	function setupOptions() {
		jQuery('#window-preferences-calc-timer').numberspinner('setValue', AGSETTINGS.getRefreshTimerInterval() /1000);
		jQuery('#window-preferences-aos').numberspinner('setValue', AGSETTINGS.getAosEl());
        if (AGSETTINGS.getSwitchViewOnTabClick()) {
            jQuery('#switchtabonclick').prop('checked', true);
        } else {
            jQuery('#switchtabonclick').prop('checked', false);
        }
        if (AGSETTINGS.getShowPopupHelp()) {
            jQuery('#popuphelp-show').prop('checked', true);
        } else {
            jQuery('#popuphelp-show').prop('checked', false);
        }
        
        if (AGSETTINGS.getAutoAddSats()) {
            jQuery('#sats-autoadd').prop('checked', true);
        } else {
            jQuery('#sats-autoadd').prop('checked', false);
        }  
        
        jQuery('#options-sat-group-selector-listbox').children().remove();
        var tleGroups = jQuery('#sat-group-selector-listbox').jqxListBox('getItems');
        var selectedGroup = AGSETTINGS.getDefaultTLEgroup();
        jQuery.each(tleGroups, function(index, group) {
            var selected = '';
            if (group.value === selectedGroup) {
                selected = ' selected="selected"';
            }
            jQuery('#options-sat-group-selector-listbox').append('<option value="'+group.value+'"'+selected+'>'+group.label+'</option>'); 
        });        
     
       var observers = AGSatTrack.getObservers();
       var observer = observers[0];      
       jQuery('#observername').val(observer.getName());
       jQuery('#observerlatitude').val(observer.getLat());
       jQuery('#observerlongitude').val(observer.getLon());
       jQuery('#observeraltitude').val(observer.getAlt());
       
        if (observer.getAutoGeo()) {
            jQuery('#observergelocate').prop('checked', true);
        } else {
            jQuery('#observergelocate').prop('checked', false);
        }
        setObserverForm(observer.getAutoGeo());
        
        if (AGSETTINGS.getDebugView()) {
            jQuery('#debugger-show').prop('checked', true);
        } else {
            jQuery('#debugger-show').prop('checked', false);
        }
        
        jQuery('#options-passes-view-bottomleft option[value="' + AGSETTINGS.getPassesBottomLeftView() + '"]').attr('selected', true);
        jQuery('#options-passes-view-bottomright option[value="' + AGSETTINGS.getPassesBottomRightView() + '"]').attr('selected', true);
        
        if (_polarPreview === null) {
            _polarPreview = AGVIEWS.getNewView('polar','polar-preview');
            _polarPreview.init(AGVIEWS.modes.PREVIEW);
            _polarPreview.startRender();

            var colours = AGSETTINGS.getViewSettings('polar').colours;            
            setPolarColours(colours);
        }
      
        
        /**
        * Disable the save button - Just in case any of the above enabled it.
        */
        jQuery('#options-save').disable();              
    }
    
    jQuery('#observergelocate').on('click', function(e){
        var state = jQuery('#observergelocate').prop('checked');
        setObserverForm(state);
        enableSave();        
    });
    
    function setObserverForm(state) {
        if (state) {
            jQuery('#observername').prop('disabled',true);
            jQuery('#observerlatitude').prop('disabled',true);
            jQuery('#observerlongitude').prop('disabled',true);
            jQuery('#observeraltitude').prop('disabled',true);          
            jQuery('#geoshow').prop('disabled',true);          
        } else {
            jQuery('#observername').prop('disabled',false);
            jQuery('#observerlatitude').prop('disabled',false);
            jQuery('#observerlongitude').prop('disabled',false);
            jQuery('#observeraltitude').prop('disabled',false);           
            jQuery('#geoshow').prop('disabled',false);           
        }        
    }
    
    function setPolarColours(colours) {
        jQuery('#polar-background-color')[0].color.fromString(colours.background);
        jQuery('#polar-border-color')[0].color.fromString(colours.border);
        jQuery('#polar-gradient-start')[0].color.fromString(colours.gradientstart);
        jQuery('#polar-gradient-end')[0].color.fromString(colours.gradientend);
        jQuery('#polar-grid')[0].color.fromString(colours.grid);
        jQuery('#polar-text')[0].color.fromString(colours.text);
        jQuery('#polar-degrees-text')[0].color.fromString(colours.degcolour);        
    }
    
    jQuery('.polarcolour').on('change', function(e){
        var colours = {
            background: jQuery('#polar-background-color')[0].color.toString(),
            border: jQuery('#polar-border-color')[0].color.toString(),
            grid: jQuery('#polar-grid')[0].color.toString(),
            text: jQuery('#polar-text')[0].color.toString(),
            degcolour: jQuery('#polar-degrees-text')[0].color.toString(),
            gradientstart: jQuery('#polar-gradient-start')[0].color.toString(),
            gradientend: jQuery('#polar-gradient-end')[0].color.toString()
        }
        _polarPreview.setPreviewColours(colours);            
        enableSave();        
    });
    jQuery('#polar-reset-colours').on('click', function(e){
        var colours = AGSETTINGS.getViewSettings('polar').defaultColours;
        setPolarColours(colours);
        _polarPreview.setPreviewColours(colours);           
        enableSave();        
    });    
    
    
    jQuery('.options-cb').on('change', function(e){
        enableSave();        
    });
        
    jQuery('.observerhome').on('change', function(e){
        enableSave();        
    });
        
    jQuery('#options-sat-group-selector-listbox').on('change', function(e){
        enableSave();        
    });
        
    jQuery('#sats-autoadd').on('click', function(e){
        enableSave();        
    });
        
    jQuery('#popuphelp-show').on('click', function(e){
        enableSave();        
    });

    jQuery('#switchtabonclick').on('click', function(e){
        enableSave();        
    });
    
	jQuery('#window-preferences-calc-timer').numberspinner({
		onSpinUp : function() {
			enableSave();
		},
		onSpinDown : function() {
			enableSave();
		}
	});
	jQuery('#window-preferences-aos').numberspinner({
		onSpinUp : function() {
			enableSave();
		},
		onSpinDown : function() {
			enableSave();
		}
	});	
	function enableSave() {
		jQuery('#options-save').enable();
	}
	
	jQuery('#options-save').click(function(){
        var temp;
        
		temp = jQuery('#window-preferences-calc-timer').numberspinner('getValue') * 1000;
		AGSETTINGS.setRefreshTimerInterval(temp);

		temp = jQuery('#window-preferences-aos').numberspinner('getValue');
		AGSETTINGS.setAosEl(temp);

        temp = jQuery('#switchtabonclick').prop('checked');
        AGSETTINGS.setSwitchViewOnTabClick(temp);

        temp = jQuery('#popuphelp-show').prop('checked');
        AGSETTINGS.setShowPopupHelp(temp);
        
        temp = jQuery('#sats-autoadd').prop('checked');
        AGSETTINGS.setAutoAddSats(temp);        
        
        var defaultgroup = jQuery('#options-sat-group-selector-listbox').find(":selected").val();
        AGSETTINGS.setDefaultTLEgroup(defaultgroup);  

        var blView = jQuery('#options-passes-view-bottomleft').find(":selected").val();
        AGSETTINGS.setPassesBottomLeftView(blView);  

        var brView = jQuery('#options-passes-view-bottomright').find(":selected").val();
        AGSETTINGS.setPassesBottomRightView(brView);          
                
        var observers = AGSatTrack.getObservers();
        var observer = observers[0];   
        observer.setName(jQuery('#observername').val());
        observer.setLat(jQuery('#observerlatitude').val());
        observer.setLon(jQuery('#observerlongitude').val());
        observer.setAlt(jQuery('#observeraltitude').val());
        observer.setAutoGeo(jQuery('#geoshow').prop('disabled'));
        
        if (observer.getAutoGeo()) {
            observer.doGeoLocate();
        } else {
            jQuery(document).trigger('agsattrack.locationAvailable',observer);     
        }
        
        temp = jQuery('#debugger-show').prop('checked');
        AGSETTINGS.setDebugView(temp);  
        if (temp) {
            jQuery('#ribbon-tab-header-8').show(); 
        } else {
            AGVIEWS.stopView('debug');
            jQuery('#ribbon-tab-header-8').hide(); 
        }
        
        
        var colours = {
            background: jQuery('#polar-background-color')[0].color.toString(),
            border: jQuery('#polar-border-color')[0].color.toString(),
            grid: jQuery('#polar-grid')[0].color.toString(),
            text: jQuery('#polar-text')[0].color.toString(),
            degcolour: jQuery('#polar-degrees-text')[0].color.toString(),
            gradientstart: jQuery('#polar-gradient-start')[0].color.toString(),
            gradientend: jQuery('#polar-gradient-end')[0].color.toString()
        }        
        AGSETTINGS.setViewColours('polar', colours);
        AGVIEWS.optionsUpdated('polar');
             
        AGSETTINGS.saveSettings();               
		jQuery('#options-save').disable();         
	});
    
    jQuery('#geoshow').on('click', function(){
       var observers = AGSatTrack.getObservers();
       observers[0].showGeoWindow();
    });
    
	return {
		startRender : function() {
			_render = true;
		},
		
		stopRender : function() {
			_render = false;			
		},
		
		init : function() {
            jQuery(document).bind('agsattrack.setupoptions',
                function(e) {
                setupOptions();
            });			
		}
	};
};