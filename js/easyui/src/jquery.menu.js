/**
 * menu - jQuery EasyUI
 * 
 * Licensed under the GPL terms
 * To use it on other terms please contact us
 *
 * Copyright(c) 2009-2012 stworthy [ stworthy@gmail.com ] 
 */
(function($){
	
	/**
	 * initialize the target menu, the function can be invoked only once
	 */
	function init(target){
		$(target).appendTo('body');
		$(target).addClass('menu-top');	// the top menu
		
		var menus = [];
		adjust($(target));

		var time = null;
		for(var i=0; i<menus.length; i++){
			var menu = menus[i];
			wrapMenu(menu);
			menu.children('div.menu-item').each(function(){
				bindMenuItemEvent(target, $(this));
			});
			
			menu.bind('mouseenter', function(){
				if (time){
					clearTimeout(time);
					time = null;
				}
			}).bind('mouseleave', function(){
				time = setTimeout(function(){
					hideAll(target);
				}, 100);
			});
		}
		
		
		function adjust(menu){
			menus.push(menu);
			menu.find('>div').each(function(){
				var item = $(this);
				var submenu = item.find('>div');
				if (submenu.length){
					submenu.insertAfter(target);
					item[0].submenu = submenu;
					adjust(submenu);
				}
			});
		}
		
		
		/**
		 * wrap a menu and set it's status to hidden
		 * the menu not include sub menus
		 */
		function wrapMenu(menu){
			menu.addClass('menu').find('>div').each(function(){
				var item = $(this);
				if (item.hasClass('menu-sep')){
					item.html('&nbsp;');
				} else {
					// the menu item options
					var itemOpts = $.extend({}, $.parser.parseOptions(this,['name','iconCls','href']), {
						disabled: (item.attr('disabled') ? true : undefined)
					});
					item.attr('name',itemOpts.name || '').attr('href',itemOpts.href || '');
					
					var text = item.addClass('menu-item').html();
					item.empty().append($('<div class="menu-text"></div>').html(text));
					
					if (itemOpts.iconCls){
						$('<div class="menu-icon"></div>').addClass(itemOpts.iconCls).appendTo(item);
					}
					if (itemOpts.disabled){
						setDisabled(target, item[0], true);
					}
					if (item[0].submenu){
						$('<div class="menu-rightarrow"></div>').appendTo(item);	// has sub menu
					}
					
					item._outerHeight(22);
				}
			});
			menu.hide();
		}
	}
	
	/**
	 * bind menu item event
	 */
	function bindMenuItemEvent(target, item){
		item.unbind('.menu');
		item.bind('mousedown.menu', function(){
			return false;	// skip the mousedown event that has been used for document to hide the menu
		}).bind('click.menu', function(){
			if ($(this).hasClass('menu-item-disabled')){
				return;
			}
			// only the sub menu clicked can hide all menus
			if (!this.submenu){
				hideAll(target);
				var href = $(this).attr('href');
				if (href){
					location.href = href;
				}
			}
			var item = $(target).menu('getItem', this);
			$.data(target, 'menu').options.onClick.call(target, item);
		}).bind('mouseenter.menu', function(e){
			// hide other menu
			item.siblings().each(function(){
				if (this.submenu){
					hideMenu(this.submenu);
				}
				$(this).removeClass('menu-active');
			});
			// show this menu
			item.addClass('menu-active');
			
			if ($(this).hasClass('menu-item-disabled')){
				item.addClass('menu-active-disabled');
				return;
			}
			
			var submenu = item[0].submenu;
			if (submenu){
				var left = item.offset().left + item.outerWidth() - 2;
				if (left + submenu.outerWidth() + 5 > $(window)._outerWidth() + $(document).scrollLeft()){
					left = item.offset().left - submenu.outerWidth() + 2;
				}
				var top = item.offset().top - 3;
				if (top + submenu.outerHeight() > $(window)._outerHeight() + $(document).scrollTop()){
					top = $(window)._outerHeight() + $(document).scrollTop() - submenu.outerHeight() - 5;
				}
				showMenu(submenu, {
					left: left,
					top: top
				});
			}
		}).bind('mouseleave.menu', function(e){
			item.removeClass('menu-active menu-active-disabled');
			var submenu = item[0].submenu;
			if (submenu){
				if (e.pageX>=parseInt(submenu.css('left'))){
					item.addClass('menu-active');
				} else {
					hideMenu(submenu);
				}
				
			} else {
				item.removeClass('menu-active');
			}
		});
	}
	
	/**
	 * hide top menu and it's all sub menus
	 */
	function hideAll(target){
		var opts = $.data(target, 'menu').options;
		hideMenu($(target));
		$(document).unbind('.menu');
		opts.onHide.call(target);
		return false;
	}
	
	/**
	 * show the top menu
	 */
	function showTopMenu(target, pos){
		var opts = $.data(target, 'menu').options;
		if (pos){
			opts.left = pos.left;
			opts.top = pos.top;
			if (opts.left + $(target).outerWidth() > $(window)._outerWidth() + $(document).scrollLeft()){
				opts.left = $(window)._outerWidth() + $(document).scrollLeft() - $(target).outerWidth() - 5;
			}
			if (opts.top + $(target).outerHeight() > $(window)._outerHeight() + $(document).scrollTop()){
				opts.top -= $(target).outerHeight();
			}
		}
		showMenu($(target), {left:opts.left,top:opts.top}, function(){
			$(document).unbind('.menu').bind('mousedown.menu', function(){
				hideAll(target);
				$(document).unbind('.menu');
				return false;
			});
			opts.onShow.call(target);
		});
	}
	
	function showMenu(menu, pos, callback){
		if (!menu) return;
		
		if (pos){
			menu.css(pos);
		}
		menu.show(0, function(){
			if (!menu[0].shadow){
				menu[0].shadow = $('<div class="menu-shadow"></div>').insertAfter(menu);
			}
			menu[0].shadow.css({
				display:'block',
				zIndex:$.fn.menu.defaults.zIndex++,
				left:menu.css('left'),
				top:menu.css('top'),
				width:menu.outerWidth(),
				height:menu.outerHeight()
			});
			menu.css('z-index', $.fn.menu.defaults.zIndex++);
			
			if (callback){
				callback();
			}
		});
	}
	
	function hideMenu(menu){
		if (!menu) return;
		
		hideit(menu);
		menu.find('div.menu-item').each(function(){
			if (this.submenu){
				hideMenu(this.submenu);
			}
			$(this).removeClass('menu-active');
		});
		
		function hideit(m){
			m.stop(true,true);
			if (m[0].shadow){
				m[0].shadow.hide();
			}
			m.hide();
		}
	}
	
	function findItem(target, text){
		var result = null;
		var tmp = $('<div></div>');
		function find(menu){
			menu.children('div.menu-item').each(function(){
				var item = $(target).menu('getItem', this);
				var s = tmp.empty().html(item.text).text();
				if (text == $.trim(s)) {
					result = item;
				} else if (this.submenu && !result){
					find(this.submenu);
				}
			});
		}
		find($(target));
		tmp.remove();
		return result;
	}
	
	function setDisabled(target, itemEl, disabled){
		var t = $(itemEl);
		
		if (disabled){
			t.addClass('menu-item-disabled');
			if (itemEl.onclick){
				itemEl.onclick1 = itemEl.onclick;
				itemEl.onclick = null;
			}
		} else {
			t.removeClass('menu-item-disabled');
			if (itemEl.onclick1){
				itemEl.onclick = itemEl.onclick1;
				itemEl.onclick1 = null;
			}
		}
	}
	
	function appendItem(target, param){
		var menu = $(target);
		if (param.parent){
			menu = param.parent.submenu;
		}
		var item = $('<div class="menu-item"></div>').appendTo(menu);
		$('<div class="menu-text"></div>').html(param.text).appendTo(item);
		if (param.iconCls) $('<div class="menu-icon"></div>').addClass(param.iconCls).appendTo(item);
		if (param.id) item.attr('id', param.id);
		if (param.href) item.attr('href', param.href);
		if (param.name) item.attr('name', param.name);
		if (param.onclick){
			if (typeof param.onclick == 'string'){
				item.attr('onclick', param.onclick);
			} else {
				item[0].onclick = eval(param.onclick);
			}
		}
		if (param.handler) item[0].onclick = eval(param.handler);
		
		bindMenuItemEvent(target, item);
		
		if (param.disabled){
			setDisabled(target, item[0], true);
		}
	}
	
	function removeItem(target, itemEl){
		function removeit(el){
			if (el.submenu){
				el.submenu.children('div.menu-item').each(function(){
					removeit(this);
				});
				var shadow = el.submenu[0].shadow;
				if (shadow) shadow.remove();
				el.submenu.remove();
			}
			$(el).remove();
		}
		removeit(itemEl);
	}
	
	function destroyMenu(target){
		$(target).children('div.menu-item').each(function(){
			removeItem(target, this);
		});
		if (target.shadow) target.shadow.remove();
		$(target).remove();
	}
	
	$.fn.menu = function(options, param){
		if (typeof options == 'string'){
			return $.fn.menu.methods[options](this, param);
		}
		
		options = options || {};
		return this.each(function(){
			var state = $.data(this, 'menu');
			if (state){
				$.extend(state.options, options);
			} else {
				state = $.data(this, 'menu', {
					options: $.extend({}, $.fn.menu.defaults, $.fn.menu.parseOptions(this), options)
				});
				init(this);
			}
			$(this).css({
				left: state.options.left,
				top: state.options.top
			});
		});
	};
	
	$.fn.menu.methods = {
		show: function(jq, pos){
			return jq.each(function(){
				showTopMenu(this, pos);
			});
		},
		hide: function(jq){
			return jq.each(function(){
				hideAll(this);
			});
		},
		destroy: function(jq){
			return jq.each(function(){
				destroyMenu(this);
			});
		},
		/**
		 * set the menu item text
		 * param: {
		 * 	target: DOM object, indicate the menu item
		 * 	text: string, the new text
		 * }
		 */
		setText: function(jq, param){
			return jq.each(function(){
				$(param.target).children('div.menu-text').html(param.text);
			});
		},
		/**
		 * set the menu icon class
		 * param: {
		 * 	target: DOM object, indicate the menu item
		 * 	iconCls: the menu item icon class
		 * }
		 */
		setIcon: function(jq, param){
			return jq.each(function(){
				var item = $(this).menu('getItem', param.target);
				if (item.iconCls){
					$(item.target).children('div.menu-icon').removeClass(item.iconCls).addClass(param.iconCls);
				} else {
					$('<div class="menu-icon"></div>').addClass(param.iconCls).appendTo(param.target);
				}
			});
		},
		/**
		 * get the menu item data that contains the following property:
		 * {
		 * 	target: DOM object, the menu item
		 *  id: the menu id
		 * 	text: the menu item text
		 * 	iconCls: the icon class
		 *  href: a remote address to redirect to
		 *  onclick: a function to be called when the item is clicked
		 * }
		 */
		getItem: function(jq, itemEl){
			var t = $(itemEl);
			var item = {
				target: itemEl,
				id: t.attr('id'),
				text: $.trim(t.children('div.menu-text').html()),
				disabled: t.hasClass('menu-item-disabled'),
				href: t.attr('href'),
				name: t.attr('name'),
				onclick: itemEl.onclick
			}
			var icon = t.children('div.menu-icon');
			if (icon.length){
				var cc = [];
				var aa = icon.attr('class').split(' ');
				for(var i=0; i<aa.length; i++){
					if (aa[i] != 'menu-icon'){
						cc.push(aa[i]);
					}
				}
				item.iconCls = cc.join(' ');
			}
			return item;
		},
		findItem: function(jq, text){
			return findItem(jq[0], text);
		},
		/**
		 * append menu item, the param contains following properties:
		 * parent,id,text,iconCls,href,onclick
		 * when parent property is assigned, append menu item to it
		 */
		appendItem: function(jq, param){
			return jq.each(function(){
				appendItem(this, param);
			});
		},
		removeItem: function(jq, itemEl){
			return jq.each(function(){
				removeItem(this, itemEl);
			});
		},
		enableItem: function(jq, itemEl){
			return jq.each(function(){
				setDisabled(this, itemEl, false);
			});
		},
		disableItem: function(jq, itemEl){
			return jq.each(function(){
				setDisabled(this, itemEl, true);
			});
		}
	};
	
	$.fn.menu.parseOptions = function(target){
		return $.extend({}, $.parser.parseOptions(target, ['left','top']));
	};
	
	$.fn.menu.defaults = {
		zIndex:110000,
		left: 0,
		top: 0,
		onShow: function(){},
		onHide: function(){},
		onClick: function(item){}
	};
})(jQuery);
