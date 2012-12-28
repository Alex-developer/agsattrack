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

						if (buttonType == 'dropdownmenu' || buttonType == 'dropdownmenustay') {
							el.click(function(e){
								$(menu).toggleClass('ribbon-menu-closed');
								$(menu).toggleClass('ribbon-menu-open');
							});
                            
                            menu.click(function(e){
                                e.stopImmediatePropagation();
                            });
							
                            if (buttonType == 'dropdownmenu') {
							    menu.on('mouseleave', function(){
								    $(menu).addClass('ribbon-menu-closed');
								    $(menu).removeClass('ribbon-menu-open');								
							    });
                            }
						}
						
						if (buttonType === 'togglebutton') {
							el.click(function(e){
								var toggleClass = 'ribbon-button-large-active';
								if (el.hasClass('ribbon-button-small')) {
									toggleClass = 'ribbon-button-small-active';									
								}
								el.toggleClass(toggleClass);
								var event = el.attr('data-event');
								if (typeof event !== 'undefined') {
									jQuery(document).trigger(event, el.hasClass(toggleClass));
								}								
							});
						}
						
						if (buttonType === 'buttongroup') {
							el.click(function(e){
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

;(function ( $, window, document, undefined ) {
  "use strict";

  var defaults = {
      pulses   : 1,
      interval : 0,
      returnDelay : 0,
      duration : 500
    };

  $.fn.pulse = function(properties, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    options = $.extend({}, defaults, options);

    if (!(options.interval >= 0))    options.interval = 0;
    if (!(options.returnDelay >= 0)) options.returnDelay = 0;
    if (!(options.duration >= 0))    options.duration = 500;
    if (!(options.pulses >= -1))     options.pulses = 1;
    if (typeof callback !== 'function') callback = function(){};

    return this.each(function () {
      var el = $(this),
          property,
          original = {}
        ;

      for (property in properties) {
        if (properties.hasOwnProperty(property)) original[property] = el.css(property);
      }

      var timesPulsed = 0;

      function animate() {
        if (options.pulses > -1 && ++timesPulsed > options.pulses) return callback.apply(el);
        el.animate(
          properties,
          {
            duration : options.duration / 2,
            complete : function(){
              window.setTimeout(function(){
                el.animate(original, {
                  duration : options.duration / 2,
                  complete : function() {
                    window.setTimeout(animate, options.interval);
                  }
                });
              },options.returnDelay);
            }
          }
        );
      }

      animate();
    });
  };

})( jQuery, window, document );