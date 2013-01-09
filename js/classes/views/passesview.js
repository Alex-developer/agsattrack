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
var AGPASSESVIEW = function() {
	'use strict';
	var _render = false;
    var _polar;
	var _sky;
    
    function resize(width, height) {
/*
        if (typeof width === 'undefined' || typeof height === 'undefined') {
            var parent = jQuery('#passes');
            width = parent.width();
            height = parent.height();
        }

        if (width !== 0 && height !== 0) {
            jQuery('#passes').width(width);
            jQuery('#passes').height(height);
            jQuery('#passesgrid').datagrid('resize',{
                width: width / 2,
                height: height
            });
            _polar.resizeView(width / 2, height / 2);      
            _sky.resizeView(width / 2, height / 2);            
        }          
*/
    }
/*
	jQuery(document).bind('agsattrack.newsatselected1', function(event, selected) {

		var selected = AGSatTrack.getSelected();
		var selected = null;
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

	//	var selected = AGSatTrack.getSelected();
    var selected = null;
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
*/	
	return {
		startRender : function() {
			_render = true;
    //        _polar.startRender();
     //       _sky.startRender();		
		},
		
		stopRender : function() {
			_render = false;
      //      _polar.stopRender();			
      //      _sky.stopRender();
		},

        resizeView : function(width, height) {
            resize(width, height);     
        },
        		
		init : function() {
     //       _polar = AGVIEWS.getNewView('polar','passespolar');
     //       _sky = AGVIEWS.getNewView('sky','passessky');
     //       _sky.init();
		}		
	}
}