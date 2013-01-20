(function($) {
	$.fn.ribbon = function(id) {
		if (!id) {
			if (this.attr('id')) {
				id = this.attr('id');
			}
		}

		var that = function() {
			return thatRet;
		};

		var thatRet = that;

		that.selectedTabIndex = -1;

		var tabNames = [];

		that.goToBackstage = function() {
			ribObj.addClass('backstage');
		}

		that.returnFromBackstage = function() {
			ribObj.removeClass('backstage');
		}
		var ribObj = null;

		that.init = function(id) {
			if (!id) {
				id = 'ribbon';
			}

			ribObj = $('#' + id);
			ribObj.find('.ribbon-window-title').after(
					'<div id="ribbon-tab-header-strip"></div>');
			var header = ribObj.find('#ribbon-tab-header-strip');

			ribObj.find('.ribbon-tab').each(
					function(index) {
						var id = $(this).attr('id');
						if (id == undefined || id == null) {
							$(this).attr('id', 'tab-' + index);
							id = 'tab-' + index;
						}
						tabNames[index] = id;

						var title = $(this).find('.ribbon-title');
						var isBackstage = $(this).hasClass('file');
						header.append('<div id="ribbon-tab-header-' + index
								+ '" class="ribbon-tab-header"></div>');
						var thisTabHeader = header.find('#ribbon-tab-header-'
								+ index);
						thisTabHeader.append(title);
						if (isBackstage) {
							thisTabHeader.addClass('file');

							thisTabHeader.click(function() {
								that.switchToTabByIndex(index);
								that.goToBackstage();
							});
						} else {
							if (that.selectedTabIndex == -1) {
								that.selectedTabIndex = index;
								thisTabHeader.addClass('sel');
							}

							thisTabHeader.click(function() {
								that.returnFromBackstage();
								that.switchToTabByIndex(index);
							});
						}

						$(this).hide();
					});
			
			
			ribObj.find('.ribbon-button').each(
					function(index) {
						var el = $(this);
						
						var buttonType = el.attr('data-type');
						if (typeof buttonType === 'undefined') {
							buttonType = 'button';
						}
												
						var title = el.find('.button-title');
						title.detach();
						
						if (buttonType === 'dropdownmenu' || buttonType === 'dropdownmenustay') {
							var menu = el.find('.ribbon-menu');
							$(title).insertBefore(menu);
						} else {
							el.append(title);
						}

						this.enable = function() {
							el.removeClass('disabled');
						}
						this.disable = function() {
							el.addClass('disabled');
						}
						this.isEnabled = function() {
							return !el.hasClass('disabled');
						}

						if ($(this).find('.ribbon-hot').length == 0) {
							$(this).find('.ribbon-normal').addClass(
									'ribbon-hot');
						}
						if ($(this).find('.ribbon-disabled').length == 0) {
							$(this).find('.ribbon-normal').addClass(
									'ribbon-disabled');
							$(this).find('.ribbon-normal').addClass(
									'ribbon-implicit-disabled');
						}

                        $(this).tooltip({
                                bodyHandler: function () {
                                    if (!$(this).isEnabled()) { 
                                        $('#tooltip').css('visibility', 'hidden');
                                        return '';
                                    }

                                    var tor = '';

                                    if (jQuery(this).children('.button-help').size() > 0)
                                        tor = (jQuery(this).children('.button-help').html());
                                    else
                                        tor = '';

                                    if (tor == '') {
                                        $('#tooltip').css('visibility', 'hidden');
                                        return '';
                                    }

                                    $('#tooltip').css('visibility', 'visible');

                                    return tor;
                                },
                                delay: 1000,
                                extraClass: 'ribbon-tooltip'
                            });
                                        
						if (buttonType == 'dropdownmenu' || buttonType == 'dropdownmenustay') {
							el.click(function(e){
                                if (!el.hasClass('disabled')) {                                   
								    $(menu).toggleClass('ribbon-menu-closed');
								    $(menu).toggleClass('ribbon-menu-open');
                                }
							});
                            
                            menu.click(function(e){
                                e.stopImmediatePropagation();
                            });
							
                            var event = el.attr('data-event');
                            if (typeof event !== 'undefined') {
                                $(el).find('li').on('click',function(){
                                    var eventParam = $(this).attr('data-event-param');
                                    jQuery(document).trigger(event, eventParam);
                                    
                                    var buttonIcon = $(this).attr('data-icon');
                                    if (typeof buttonIcon !== 'undefined') {                                    
                                        $(el).find('.ribbon-icon').attr('src', buttonIcon);
                                    }
                                    $(menu).addClass('ribbon-menu-closed');
                                    $(menu).removeClass('ribbon-menu-open');                                    
                                });
                            }
                            
                            if (buttonType == 'dropdownmenu') {
							    menu.on('mouseleave', function(){
                                    if (!el.hasClass('disabled')) {                                    
								        $(menu).addClass('ribbon-menu-closed');
								        $(menu).removeClass('ribbon-menu-open');
                                    }								
							    });
                            }
						}
						
						if (buttonType === 'togglebutton') {
							el.click(function(e){
                                if (!el.hasClass('disabled')) {
								    var toggleClass = 'ribbon-button-large-active';
								    if (el.hasClass('ribbon-button-small')) {
									    toggleClass = 'ribbon-button-small-active';									
								    }
								    el.toggleClass(toggleClass);
								    var event = el.attr('data-event');
								    if (typeof event !== 'undefined') {
									    jQuery(document).trigger(event, el.hasClass(toggleClass));
								    }
                                }								
							});
						}

                        if (buttonType === 'button') {
                            el.click(function(e){
                                if (!el.hasClass('disabled')) {
                                    var event = el.attr('data-event');
                                    if (typeof event !== 'undefined') {
                                        jQuery(document).trigger(event);
                                    }
                                }                                
                            });
                        }
                        						
                        /**
                        * Group toggle button.
                        * 
                        * A series of toggle buttons where only ONE can be active at any one time.
                        * 
                        * Options
                        * 
                        * data-type="grouptogglebutton"  Indicates a group toggle button
                        * data-event="some event" The event to fire
                        * data-group="some group" The name of the group
                        * 
                        */
                        if (buttonType === 'grouptogglebutton') {
                            el.click(function(e){
                                if (!el.hasClass('disabled')) {
                                    var group = el.attr('data-group');
                                    var groupButtons = $('[data-group="'+group+'"]');
            
                                    jQuery.each(groupButtons, function(index, button) {
                                        if (el.prop('id') !== $(button).prop('id')) {
                                            var removeClass = 'ribbon-button-large-active';
                                            if (el.hasClass('ribbon-button-small')) {
                                                removeClass = 'ribbon-button-small-active';                                    
                                            }
                                            if ($(button).hasClass(removeClass)) {
                                                $(button).removeClass(removeClass);
                                                var event = $(button).attr('data-event');
                                                if (typeof event !== 'undefined') {
                                                    jQuery(document).trigger(event, $(button).hasClass(removeClass));
                                                }                                           
                                            }
                                        }
                                    });
                                                
                                    var toggleClass = 'ribbon-button-large-active';
                                    if (el.hasClass('ribbon-button-small')) {
                                        toggleClass = 'ribbon-button-small-active';                                    
                                    }
                                    el.toggleClass(toggleClass);
                                    var event = el.attr('data-event');
                                    if (typeof event !== 'undefined') {
                                        jQuery(document).trigger(event, el.hasClass(toggleClass));
                                    }
                                }                                
                            });
                        }
                                                
						if (buttonType === 'buttongroup') {
							el.click(function(e){
                                if (!el.hasClass('disabled')) {                                
								    var oldActive = null;
								    var buttonGroup = el.attr('data-group');
								    $('div[data-group="'+buttonGroup+'"]').each(function() {
								        if ($(this).hasClass('ribbon-button-large-active')) {
								    	    $(this).removeClass('ribbon-button-large-active');
								    	    oldActive = this;
								        }
								    });
								    $(this).addClass('ribbon-button-large-active');
								    var event = el.attr('data-event');
								    if (typeof event !== 'undefined') {
									    jQuery(document).trigger(event);
								    }
                                }
							});
						} 
						
					});

			ribObj.find('.ribbon-section').each(function(index) {
				$(this).after('<div class="ribbon-section-sep"></div>');
			});

			ribObj.find('div').attr('unselectable', 'on');
			ribObj.find('span').attr('unselectable', 'on');
			ribObj.attr('unselectable', 'on');

			that.switchToTabByIndex(that.selectedTabIndex);
		}

		that.switchToTabByIndex = function(index) {
			var headerStrip = $('#ribbon #ribbon-tab-header-strip');
			headerStrip.find('.ribbon-tab-header').removeClass('sel');
			headerStrip.find('#ribbon-tab-header-' + index).addClass('sel');

			$('#ribbon .ribbon-tab').hide();
			$('#ribbon #' + tabNames[index]).show();
		}

        $.fn.setState = function(e, state) {
            var toggleClass = 'ribbon-button-large-active';
            if ($(this).hasClass('ribbon-button-small')) {
                toggleClass = 'ribbon-button-small-active';                                    
            }
            $(this).toggleClass(toggleClass);
        }
                
		$.fn.enable = function() {
			if (this.hasClass('ribbon-button')) {
				if (this[0] && this[0].enable) {
					this[0].enable();
				}
			} else {
				this.find('.ribbon-button').each(function() {
					$(this).enable();
				});
			}
		}

		$.fn.disable = function() {
			if (this.hasClass('ribbon-button')) {
				if (this[0] && this[0].disable) {
					this[0].disable();
				}
			} else {
				this.find('.ribbon-button').each(function() {
					$(this).disable();
				});
			}
		}

		$.fn.isEnabled = function() {
			if (this[0] && this[0].isEnabled) {
				return this[0].isEnabled();
			} else {
				return true;
			}
		}

        
        $.fn.AddMenuEntry = function(options) {
            
        }
        
		that.init(id);
		this.show();
		$.fn.ribbon = that;
	};

})(jQuery);


/*global jQuery*/
/*jshint curly:false*/

/**
 * Pulse plugin for jQuery 
 * ---
 * @author James Padolsey (http://james.padolsey.com)
 * @version 0.1
 * @updated 16-DEC-09
 * ---
 * Note: In order to animate color properties, you need
 * the color plugin from here: http://plugins.jquery.com/project/color
 * ---
 * @info http://james.padolsey.com/javascript/simple-pulse-plugin-for-jquery/
 */

;jQuery.fn.pulse = function( prop, speed, times, easing, callback ) {
    
    if ( isNaN(times) ) {
        callback = easing;
        easing = times;
        times = 1;
    }
    
    var optall = jQuery.speed(speed, easing, callback),
        queue = optall.queue !== false,
        largest = 0;
        
    for (var p in prop) {
        largest = Math.max(prop[p].length, largest);
    }
    
    optall.times = optall.times || times;
    
    return this[queue?'queue':'each'](function(){
        
        var counts = {},
            opt = jQuery.extend({}, optall),
            self = jQuery(this);
            
        pulse();
        
        function pulse() {
            
            var propsSingle = {},
                doAnimate = false;
            
            for (var p in prop) {
                
                // Make sure counter is setup for current prop
                counts[p] = counts[p] || {runs:0,cur:-1};
                
                // Set "cur" to reflect new position in pulse array
                if ( counts[p].cur < prop[p].length - 1 ) {
                    ++counts[p].cur;
                } else {
                    // Reset to beginning of pulse array
                    counts[p].cur = 0;
                    ++counts[p].runs;
                }
                
                if ( prop[p].length === largest ) {
                    doAnimate = opt.times > counts[p].runs;
                }
                
                propsSingle[p] = prop[p][counts[p].cur];
                
            }
            
            opt.complete = pulse;
            opt.queue = false;
            
            if (doAnimate) {
                self.animate(propsSingle, opt);
            } else {
                optall.complete.call(self[0]);
            }
            
        }
            
    });
    
};