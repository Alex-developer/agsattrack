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

/*global AGSatTrack, AGVIEWS, AGUTIL, jQuery, scrollview */

var AGINFOVIEW = function(element) {
    'use strict';

    var _render = false;                // Flag to indcate if this view is being rendered
    var _infoGrid = null;
    var _freqGrid  = null;
    var _rows = null;
    var _layout = null;
    var _element = null;
    var _satView = null;
    var _mode = null;

    var _infoElement = AGUTIL.getId();
    var _freqElement = AGUTIL.getId();
    var _3dElement = AGUTIL.getId();


    if (typeof element === 'undefined') {
        _element = 'info-layout';
    } else {
        _element = element;
    }

    function dataUpdated(selectedSatellite) {
        if (selectedSatellite === undefined) {
            selectedSatellite = AGSatTrack.getFollowing();
        }

        if (selectedSatellite !== null && selectedSatellite !== undefined) {
            for (var i = 0; i < _rows.length; i++) {
                var row = _infoGrid.datagrid('getRowIndex', _rows[i].key);
                if (row !== -1) {
                    _infoGrid.datagrid('updateRow', {
                        index: row,
                        row: {
                            value: selectedSatellite.get(_rows[i].key)
                        }
                    });
                }
            }
        }
    }

    function buildLayout() {
        _layout = jQuery('#' + _element).layout({
            fit: true
        });

        _layout.layout('add', {
            region: 'west',
            width: '22%',
            split: true
        });
        jQuery('<div></div>').attr('id',_infoElement).appendTo(_layout.layout('panel','west'));

        if (_mode === AGVIEWS.modes.DEFAULT) {
            _layout.layout('add', {
                region: 'center'
            });
            jQuery('<div></div>').attr('id', _3dElement).appendTo(_layout.layout('panel', 'center'));

            _layout.layout('add', {
                region: 'south',
                height: '100px'
            });
            jQuery('<div></div>').attr('id', _freqElement).appendTo(_layout.layout('panel', 'south'));

            _layout.layout('panel', 'center').panel({
                onResize: function (width, height) {
                    if (_satView !== null) {
                        _satView.resizeView(width, height);
                    }
                }
            });
        }
    }

    function createFrequencyGrid() {
        _freqGrid = jQuery('#' + _freqElement).datagrid({
            autoRowHeight:false,
            pagination: false,
            pageSize: 50,
            fitColumns: true,
            fit: true,
            remoteSort: false,
            view: scrollview,
            columns:[[
                {field:'uplink',title:'Uplink', width: '10%'},
                {field:'downlink',title:'Downlink', width: '10%'},
                {field:'beacon',title:'Beacon', width: '10%',align: 'right'},
                {field:'mode',title:'Mode', width: '20%',align: 'right'},
                {field:'callsign',title:'Callsign', width: '20%',align: 'right'},
                {field:'type',title:'Type', width: '20%',align: 'right'}
            ]]
        });
    }

    function createInfoGrid() {
        var gridElement = _infoElement;

        if (_mode === AGVIEWS.modes.SHORT) {
            gridElement = _element;
        }
        _infoGrid = jQuery('#' + gridElement).datagrid({
            autoRowHeight:false,
            pagination: false,
            pageSize: 50,
            fitColumns: true,
            fit: true,
            remoteSort: false,
            view: scrollview,
            idField: 'key',
            showHeader: false,
            columns:[[
                {field:'key',title:'Key', hidden: true},
                {field:'item',title:'Name', width: '50%'},
                {field:'value',title:'Value', width: '50%',align: 'right',
                    formatter: function(value,row){
                        var satellite;
                        var result = value;
                        switch (row.key) {
                            case 'latitude':
                                result = AGUTIL.convertDecDegLat(value);
                                break;

                            case 'longitude':
                                result = AGUTIL.convertDecDegLon(value);
                                break;

                            case 'altitude':
                            case 'footprint':
                            case 'elevation':
                            case 'velocity':
                            case 'range':
                            case 'rangerate':
                            case 'azimuth':
                            case 'orbitalphase':
                                if (value !== '') {
                                    result = value.toFixed(3);
                                }
                                break;

                            case 'dopplershift':
                            case 'signalloss':
                            case 'signaldelay':
                                if (value !== '') {
                                    result = value.toFixed(0);
                                }
                                break;

                            case 'geostationary':
                                satellite = AGSatTrack.getFollowing();
                                if (satellite !== null) {
                                    if (satellite.isGeostationary()) {
                                        if (satellite.get('elevation') > 0) {
                                            result = 'Yes - Visible';
                                        } else {
                                            result = 'Yes - Not Visible';
                                        }
                                    } else {
                                        result = 'No';
                                    }
                                }
                                break;

                            case 'catalognumber':
                                satellite = AGSatTrack.getFollowing();
                                if (satellite !== null) {
                                    result = satellite.getCatalogNumber();
                                }
                                break;

                            case 'name':
                                satellite = AGSatTrack.getFollowing();
                                if (satellite !== null) {
                                    result = satellite.getName();
                                }
                                break;

                            case 'owner':
                            case 'period':
                            case 'inclination':
                            case 'apogee':
                            case 'perigee':
                                satellite = AGSatTrack.getFollowing();
                                if (satellite !== null) {
                                    var extraData = satellite.getExtraData();
                                    if (extraData !== null) {
                                        result = extraData[row.key];
                                    }
                                }
                                break;
                        }

                        return result;
                    }
                }
            ]]
        });

        _rows = [{
            key: 'catalognumber',
            item: 'Catalog Number',
            value: ''
        },{
            key: 'name',
            item: 'Name',
            value: ''
        },{
            key: 'owner',
            item: 'Owner',
            value: ''
        },{
            key: 'latitude',
            item: 'Latitude',
            value: ''
        },{
            key: 'longitude',
            item: 'Longitude',
            value: ''
        },{
            key: 'altitude',
            item: 'Altitude (Km)',
            value: ''
        },{
            key: 'azimuth',
            item: 'Azimuth &deg;',
            value: ''
        },{
            key: 'elevation',
            item: 'Elevation &deg;',
            value: ''
        },{
            key: 'footprint',
            item: 'Footprint (Km)',
            value: ''
        },{
            key: 'locator',
            item: 'Locator',
            value: ''
        },{
            key: 'visibility',
            item: 'Visibility',
            value: ''
        },{
            key: 'orbitnumber',
            item: 'Orbit Number',
            value: ''
        },{
            key: 'velocity',
            item: 'Velocity',
            value: ''
        },{
            key: 'range',
            item: 'Range',
            value: ''
        },{
            key: 'dopplershift',
            item: 'Doppler Shift (Hz)',
            value: ''
        },{
            key: 'signalloss',
            item: 'Signal Loss(dB)',
            value: ''
        },{
            key: 'signaldelay',
            item: 'Signal Delay (ms)',
            value: ''
        },{
            key: 'rangerate',
            item: 'Range Rate',
            value: ''
        },{
            key: 'orbitalphase',
            item: 'Orbital Phase',
            value: ''
        },{
            key: 'geostationary',
            item: 'Geostationary',
            value: ''
        },{
            key: 'period',
            item: 'Period',
            value: ''
        },{
            key: 'inclination',
            item: 'Inclination',
            value: ''
        },{
            key: 'apogee',
            item: 'Apogee',
            value: ''
        },{
            key: 'perigee',
            item: 'Perigee',
            value: ''
        }

        ];
        _infoGrid.datagrid('loadData', _rows);
    }

    function buildView() {
        if (_mode === AGVIEWS.modes.DEFAULT) {
            buildLayout();
            createStage();
            createFrequencyGrid();
        }
        createInfoGrid();
    }

    function createStage() {
        if (_satView === null) {
            _satView = AGVIEWS.getNewView('3d', _3dElement);
            _satView.init(AGVIEWS.modes.SINGLE);
            _satView.setSingleSat(null);
            _satView.startRender();
        }
    }

    function setupFrequencie(satellite) {
        _freqGrid.datagrid('loadData', {"total":0,"rows":[]});

        satellite = AGSatTrack.getFollowing();
        if (satellite !== null) {
            var extraData = satellite.getExtraData();
            //noinspection JSUnresolvedVariable
            var freq = extraData.frequencies;
            var rows = [];
            for (var i=0;i<freq.length;i++) {

                rows.push({
                    uplink: freq[i].uplink,
                    downlink: freq[i].downlink,
                    beacon: freq[i].beacon,
                    mode: freq[i].mode,
                    callsign: freq[i].callsign,
                    type: freq[i].type
                });
            }
            _freqGrid.datagrid('loadData',rows);
        }
    }

    function updateView(satellite) {

        if (satellite === undefined) {
            satellite = AGSatTrack.getFollowing();
        }

        if (satellite !== null) {
            dataUpdated(satellite);
            if (_mode === AGVIEWS.modes.DEFAULT) {
                setupFrequencie(satellite);
            }
        }

        if (_mode === AGVIEWS.modes.DEFAULT) {
            if (satellite === null || satellite === undefined) {
                _satView.setSingleSat(null);
            } else {
                _satView.setSingleSat(satellite);
            }
        }
    }

    return {
        startRender : function() {
            _render = true;
            updateView();
        },

        stopRender : function() {
            _render = false;
        },

        destroy : function() {
            _render = false;
            jQuery('#'+_element).html('');
        },
        resizeView : function(width, height) {
        },
        init : function(mode) {
            if (mode === undefined) {
                mode = AGVIEWS.modes.DEFAULT;
            }
            _mode = mode;
            buildView();
        },

        dataUpdated : function(selectedSatellite) {
            dataUpdated(selectedSatellite);
        },

        satSelected: function(selectedSatellite) {
            updateView(selectedSatellite);
        }
    };
};