var AGPASSESVIEW = function() {
	'use strict';
	var _render = false;
	
	jQuery(window).resize(function() {
		jQuery('#passesgrid').datagrid('resize');
	});
	
	jQuery(document).bind('agsattrack.newsatselected', function(event, selected) {

		var selected = AGSatTrack.getSelected();
		var data = [];
		if (selected !== null) {
			var satData = AGSatTrack.getSatellite(selected.index).getOrbitData();
			for (var i=0; i < satData.length; i++) {
				if (satData[i].el > AGSETTINGS.getAosEl()) {
					data.push({
						date: AGUTIL.shortdate(satData[i].date),
						el: satData[i].el.toFixed(0),
						az: satData[i].az.toFixed(0),
						range: 0,
						footprint: 0
					});
				}
			}
		}

		jQuery('#passesgrid').datagrid('loadData',data);
	});
	
	function getData(){
		var rows = [];

		var selected = AGSatTrack.getSelected();
		if (selected !== null) {
			var satData = AGSatTrack.getSatellite(selected.index).getOrbitData();
			debugger;
		}
		return rows;
	}
	
	function pagerFilter(data){
		
        if (typeof data.length == 'number' && typeof data.splice == 'function'){    // is array  
            data = {  
                total: data.length,  
                rows: data  
            }  
        }  
        var dg = $(this);  
        var opts = dg.datagrid('options');  
        var pager = dg.datagrid('getPager');  
        pager.pagination({  
            onSelectPage:function(pageNum, pageSize){  
                opts.pageNumber = pageNum;  
                opts.pageSize = pageSize;  
                pager.pagination('refresh',{  
                    pageNumber:pageNum,  
                    pageSize:pageSize  
                });  
                dg.datagrid('loadData',data);  
            }  
        });  
        if (!data.originalRows){  
            data.originalRows = (data.rows);  
        }  
        var start = (opts.pageNumber-1)*parseInt(opts.pageSize);  
        var end = start + parseInt(opts.pageSize);  
if (typeof data.originalRows !== 'undefined') {
        data.rows = (data.originalRows.slice(start, end));
}
        return data; 		
		
	}
	
	jQuery('#passesgrid').datagrid({loadFilter:pagerFilter}).datagrid('loadData', getData());
	
	return {
		startRender : function() {
			_render = true;			
		},
		
		stopRender : function() {
			_render = false;			
		},
		
		init : function() {
			
		}		
	}
}