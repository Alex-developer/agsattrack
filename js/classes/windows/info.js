/*
 Copyright 2012 - 2017 Alex Greenland

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

/*global AGSatTrack, AGVIEWS, AGUTIL, jQuery, scrollview */

var AGINFOWINDOW = function(element, params) {
    'use strict';

    var _element = element;
    var _infoElement = AGUTIL.getId();

    jQuery(_element).window({
        width:200,
        height:400,
        title: 'Satellite Info',
        modal:false,
        minimizable: false,
        maximizable : false
    });

    jQuery('<div></div>').attr('id', _infoElement).appendTo(_element);

    var _infoGrid = AGVIEWS.getNewView('info',_infoElement);
    _infoGrid.init(AGVIEWS.modes.SHORT);

    jQuery(_element).window('collapse');

    jQuery(document).bind('agsattrack.newsatselected', function() {
        var selectedSatellite = AGSatTrack.getFollowing();
        _infoGrid.satSelected();
        if (selectedSatellite === null) {
            jQuery(_element).window('collapse');
        } else {
            jQuery(_element).window('expand');
        }
    });
    jQuery(document).bind('agsattrack.updatesatdata', function() {
        _infoGrid.dataUpdated();
    });

    function destroy() {

    }
    
    return {
        init : function() {
            jQuery(_element).window('open');
        },
        destroy: function() {
            destroy();
        }
    };
};