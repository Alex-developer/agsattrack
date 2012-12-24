(function($) {
	$.widget("ui.agsatbox", {	
		options: {
			listItems : [],
			selectedItems: [],
			effect: 'blink',
			onChange: {},
			objTable: '',
			objSrcTable: '',			
			objButtonTable: '',
			icount: 0,
			width: 600,
			height: 500
		},
		
		_create: function() {
			var self = this, o = self.options, el = self.element;
			var html = '';
			
			// generate outer div
			var container = $('<div/>').addClass('agsatbox');

			$(container).width(o.width);
			$(container).height(o.height);
			
			
			
			html += '<div class="toolbar">Toolbar</div>';
			html += '<div class="wrapper">';
			html += '	<div class="left">';
			html += '	</div>';
			html += '	<div class="center">';
			html += '		<table width="100%" height="100%">';
			html += '        	<tr>';
			html += '        		<td valign="center" align="center">';
			html += '                    <button id="to2" type="button">&nbsp;&gt;&nbsp;</button>';
			html += '                    <button id="allTo2" type="button">&nbsp;&gt;&gt;&nbsp;</button>';
			html += '                    <button id="to1" type="button">&nbsp;&lt;&nbsp;</button>';
			html += '                    <button id="allTo1" type="button">&nbsp;&lt;&lt;&nbsp;</button>';
			html += '                </td>';
			html += '			</tr>';
			html += '		</table>';
			html += '	</div>';
			html += '	<div class="right">';
			html += '	</div>';
			html += '</div>';
			
			// generate toolbar
			var toolbar = $('<div/>').addClass('toolbar');
			var chkAll = $('<input/>').attr('type','checkbox').addClass('chkAll').click(function(){
				var state = $(this).attr('checked');
				var setState = false;
				
				setState = (state==undefined) ? false : true;

				o.objTable.find('.chk:visible').attr('checked', setState);

				self._selChange();
			});
			var txtfilter = $('<input/>').attr('type','text').addClass('txtFilter').keyup(function(){
				self._filter($(this).val());
			});
			toolbar.append(chkAll);
			toolbar.append($('<div/>').addClass('filterbox').text('filter').append(txtfilter));

			var tableWidth = parseInt((o.width - 50)/2);
			var tableHeight = o.height - 30;

			// generate list table object
			o.objTable = $('<table/>').width(tableWidth).height(tableHeight);
			o.objSrcTable = $('<table/>').width(tableWidth).height(tableHeight);
			o.objButtonTable = $('<table/>').width(5);
			
			var left = $('<td/>').addClass('tableleft').append(o.objSrcTable);
			var center = $('<td/>').addClass('tablecenter').append(o.objButtonTable);
			var right = $('<td/>').addClass('tableright').append(o.objTable);
			
			var row = $('<tr/>').append(left).append(center).append(right);
			var wrapper = $('<table/>').addClass('table').append(row);
			
			container.append(toolbar);
			container.append(wrapper);
			//container.append(o.objTable);
			el.append(container);
			self.loadList();
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
			el.delegate('#'+itemId,'click', function(){self._selChange()});
		},

		loadList: function(){
			var self = this, o = self.options, el = self.element;

			o.objTable.empty();
			$.each(o.listItems,function(){
				//console.log(JSON.stringify(this));
				self._addItem(this);
			});
		},

		_selChange: function(){
			var self = this, o = self.options, el = self.element;

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
			o.onChange.call();
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

		setData: function(dataModel){
			var self = this, o = self.options, el = self.element;
			o.listItems = dataModel;
			self.loadList();
			self._selChange();
		}
	});
})(jQuery); 