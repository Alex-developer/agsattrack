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
/*
NOTE: I found this code online and have modified it. I cannot now find where I got it from. if anyone knows or its yours please
let me know and I will add the appropriate credit. 
*/  
(function($) {
	$.widget("ui.agcheckList", {	
		options: {
			listItems : [],
			selectedItems: [],
			effect: 'none',
			onChange: function(){},
			objTable: '',
			icount: 0,
            showCheckAll: false,
            filterText: 'Filter',
            fit: true
		},
		
		_create: function() {
			var self = this, o = self.options, el = self.element;

			// generate outer div
			var container = $('<div/>').addClass('checkList');
			// generate toolbar
			var toolbar = $('<div/>').addClass('toolbar');
			if (o.showCheckAll) {
                var chkAll = $('<input/>').attr('type','checkbox').addClass('chkAll').click(function(){
				    var state = $(this).attr('checked');
				    var setState = false;
				    
				    setState = (state==undefined) ? false : true;

				    o.objTable.find('.chk:visible').attr('checked', setState);

				    self._selChange();
			    });
            }
			var txtfilter = $('<input/>').attr('type','text').addClass('txtFilter').keyup(function(){
				self._filter($(this).val());
			});
			if (o.showCheckAll) {
                toolbar.append(chkAll);
            }
			toolbar.append($('<div/>').addClass('filterbox').text(o.filterText).append(txtfilter));

			// generate list table object
			o.objTable = $('<table/>').addClass('table');
			
			container.append(toolbar);
			container.append(o.objTable);
			el.append(container);
			self.loadList();
            
            jQuery(document).bind('agsattrack.satsselected', function(e, selected) {
                var data = [];
                for (var i=0; i < selected.selections.length; i++) {
                    var sat = AGSatTrack.getSatelliteByName(selected.selections[i]);
                    data.push({text: sat.getName(), value: sat.getCatalogNumber()});    
                }
                o.listItems = data;
                self.loadList();        
            }); 
                
            $(document).bind('agsattrack.newsatselected', function(e, satellites) {
                var list = container.find('input').prop('checked', false);
                for (var i=0;i<satellites.satellites.length;i++) {
                    var name = satellites.satellites[i].getName();
                    $.each(list, function(index, el) {
                        if ($(el).attr('data-text') === name) {
                            $(el).prop('checked', satellites.satellites[i].getSelected());
                            self._selChange(true, el);
                        }
                    });
                }       
            });            
		},

		_addItem: function(listItem){
			var self = this, o = self.options, el = self.element;

			var itemId = 'itm' + (o.icount++);	// generate item id
			var itm = $('<tr/>');
			var chk = $('<input/>').attr('type','checkbox').attr('id',itemId)
					.addClass('chk')
					.attr('data-text',listItem.text)
					.attr('data-value',listItem.value);
			
			itm.append($('<td/>').append(chk));
			var label = $('<label/>').attr('for',itemId).text(listItem.text);
			itm.append($('<td/>').append(label));
			o.objTable.append(itm);

			// bind selection-change
			//el.delegate('.chk','click', function(){self._selChange()});
			chk.on('click', function(){self._selChange(false, this)});
		},

		loadList: function(){
			var self = this, o = self.options, el = self.element;

			o.objTable.empty();
			$.each(o.listItems,function(){
				//console.log(JSON.stringify(this));
				self._addItem(this);
			});
		},

		_selChange: function(disableEvents, element){
			var self = this, o = self.options, el = self.element;
            
            if (typeof disableEvents === 'undefined') {
                disableEvents = false;    
            }
			// empty selection
			o.selectedItems = [];

			// scan elements, find checked ones
			o.objTable.find('.chk').each(function(){	
				if($(this).attr('checked')){
					o.selectedItems.push({
						text: $(this).attr('data-text'),
						value: $(this).attr('data-value')
					});
					$(this).parent().addClass('highlight').siblings().addClass('highlight');
				}else{
					$(this).parent().removeClass('highlight').siblings().removeClass('highlight');
				}
			});

			// fire onChange event
			if (!disableEvents) {
                o.onChange.call();
                jQuery(document).trigger('agsattrack.satclicked', {catalogNumber: $(element).attr('data-value')});
            }
		},

		_filter: function(filter){
			var self = this, o = self.options, el = self.element;

			o.objTable.find('.chk').each(function(){	
				if($(this).attr('data-text').toLowerCase().indexOf(filter.toLowerCase())>-1)
				{
					$(this).parent().parent().show(o.effect);
				}
				else{
					$(this).parent().parent().hide(o.effect);
				}
			});
		},

		getSelection: function(){
			var self = this, o = self.options, el = self.element;
			return o.selectedItems;
		},

        clear : function() {
            this.options.objTable.empty();    
        },
        
		setData: function(dataModel){
			var self = this, o = self.options, el = self.element;
			o.listItems = dataModel;
			self.loadList();
			self._selChange();
		}
	});
})(jQuery); 