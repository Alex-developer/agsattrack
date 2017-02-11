;(function($) {
   $.agSelector = function(element, options) {

        var _ignoreSelectorEvents = false;
        var _dataGrid = null;

        var defaults = {
            enabled: true,
            lonGroups: ['geo'],
            onUpdate: function() {}
        }
        var $element = $(element);
        var element = element;
        var plugin = this;

        plugin.settings = {}

        plugin.init = function() {
            plugin.settings = $.extend({}, defaults, options);
            setupGrid();
        }

        plugin.groupUpdated = function(group) {
            var dataGrid = jQuery('#quick-sat-selector');

            if (plugin.settings.lonGroups.indexOf(group) !== -1) {
                dataGrid.datagrid('showColumn','lon');
            } else {
                dataGrid.datagrid('hideColumn','lon');
            }
        }

        plugin.setup = function() {
            var data = [];
            var satellites = AGSatTrack.getSatellites();

            _dataGrid.datagrid('loadData', {"total":0,"rows":[]});

            for ( var i = 0; i < satellites.length; i++) {
                var sat = satellites[i];
                data.push({
                    ck: true,
                    name: sat.getName(),
                    lon: AGUTIL.convertDecDegLon(sat.get('longitude')),
                    catalognumber: sat.getCatalogNumber()
                });
            }
            _dataGrid.datagrid('loadData',data);
        }

        plugin.update = function() {
            var catalogNumber;
            var satellite;
            var satellites = AGSatTrack.getSatellites();

            for (var i=0; i<satellites.length; i++) {
                catalogNumber = satellites[i].getCatalogNumber();

                var row = _dataGrid.datagrid('getRowIndex', catalogNumber);
                if (row !== -1) {
                    _dataGrid.datagrid('updateRow', {
                        index: row,
                        row: {
                            lon: satellites[i].get('longitude')
                        }
                    });

                    if (satellites[i].getSelected()) {
                        _ignoreSelectorEvents = true;
                        _dataGrid.datagrid('checkRow', row);
                        _ignoreSelectorEvents = false;
                    } else {
                        _ignoreSelectorEvents = true;
                        _dataGrid.datagrid('uncheckRow', row);
                        _ignoreSelectorEvents = false;
                    }
                }
            }
        }

        plugin.clear = function() {
            _dataGrid.datagrid('loadData', {"total":0,"rows":[]});
        }
        
        var setupGrid = function() {
            _dataGrid = jQuery('#quick-sat-selector').datagrid({
                autoRowHeight:false,
                pagination: false,
                pageSize: 50,
                fitColumns: true,
                fit: true,
                remoteSort: false,
                view: scrollview,
                idField: 'catalognumber',
                columns:[[
                    {field:'ck',checkbox:true},
                    {field:'name',title:'Name',width:200},
                    {field:'lon',title:'Lon',width:95,align:'right',sortable: true,
                        formatter: function(value,row,index){
                            return AGUTIL.convertDecDegLonShort(row.lon);
                        }
                    },
                    {field:'catalognumber',title:'',hidden: true}
                ]],
                onCheck: function(index,data){
                    if (!_ignoreSelectorEvents) {
                        jQuery(document).trigger('agsattrack.satclicked', {catalogNumber: data.catalognumber, state: true});
                    }
                },
                onUncheck: function(index,data){
                    if (!_ignoreSelectorEvents) {
                        jQuery(document).trigger('agsattrack.satclicked', {catalogNumber: data.catalognumber, state: false});
                    }
                }
            });
        }
        plugin.init();
    }


    $.fn.agSelector = function(options, opt1) {

        // iterate through the DOM elements we are attaching the plugin to
        return this.each(function() {

            // if plugin has not already been attached to the element
            if (undefined == $(this).data('agSelector')) {

                // create a new instance of the plugin
                // pass the DOM element and the user-provided options as arguments
                var plugin = new $.agSelector(this, options);

                // in the jQuery version of the element
                // store a reference to the plugin object
                // you can later access the plugin and its methods and properties like
                // element.data('pluginName').publicMethod(arg1, arg2, ... argn) or
                // element.data('pluginName').settings.propertyName
                $(this).data('agSelector', plugin);

            } else {
                if(typeof $(this).data('agSelector')[options] === 'function') {
                    $(this).data('agSelector')[options](opt1);
                }
            }

        });

    }

})(jQuery);