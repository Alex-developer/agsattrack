;(function($) {
    var pluginName = 'agsatbox';

    function Plugin(element, options) {
        var el = element;
        var $el = $(element);
        var divLeft;
        var divRight;
        var _ignoreEvents = false;
        
        options = $.extend({}, $.fn[pluginName].defaults, options);

        function init() {

            var leftSource = [
            ];
            var rightSource = [
            ];


            var divWrapper = $('<div style="width:555px" />');
            divLeft = $('<div style="float:left;" > <select id="leftsat" multiple="multiple" style="width:250px;height:400px"></select></div>');
            var divCenter = $('<div style="float:left;" />');
            divRight = $('<div style="float:left;" ><select id="rightsat" multiple="multiple" style="width:250px;height:400px"></select></div>');


            var buttonPrefix =  $el.attr('id')+'Button';
            var selectorHTML = '        \
            <div style="position:relative; height:200px;width: 50px">   \
            <div style="position: absolute;top: 35%;">    \
            <button class="'+buttonPrefix+' all left" type="button"><<</button>     \
            <button class="'+buttonPrefix+' all right" type="button">>></button>     \
            </div>    \
            </div>';

            divCenter.append(selectorHTML);


            divWrapper.append(divLeft);
            divWrapper.append(divCenter);
            divWrapper.append(divRight);
            $el.append(divWrapper);                         

            $('.' + buttonPrefix).on('click', function(e){
                var el = $(e.target);
                var direction = el.hasClass('right') ? 'right' : 'left';

                moveSats(direction);
                
                e.stopImmediatePropagation();
            });
 
            
            jQuery(document).bind('agsattrack.newsatselected', function(event, params) {
                _ignoreEvents = true;

                _ignoreEvents = false;    
            });
                   
            hook('onInit');
        }

        function moveSats(direction) {
             _moveAllSats(direction, false);    
        }
        
        function moveAllSats(direction) {
             _moveAllSats(direction, true);    
        }
        
        function _move(direction, all) {
            var selectedOpts = [];
            if (direction === 'right') {
                if (all) {
                    selectedOpts = jQuery('#leftsat option');
                } else {
                    selectedOpts = jQuery('#leftsat option:selected');
                }
                jQuery('#rightsat').append(jQuery(selectedOpts).clone());
                jQuery(selectedOpts).remove();
            } else {
                if (all) {
                    selectedOpts = jQuery('#rightsat option');
                } else {
                    selectedOpts = jQuery('#rightsat option:selected');
                }                
                jQuery('#leftsat').append(jQuery(selectedOpts).clone());
                jQuery(selectedOpts).remove();                
            }
            selectedOpts = jQuery('#rightsat option');
            return selectedOpts;           
        }
             
        function _moveAllSats(direction, all) {
            if (direction === 'right') {
                var sourceData = [];

                if (all) {
                    _move('left', all);
                }
                selectedOpts = _move(direction, all);
                
                jQuery.each(selectedOpts, function(index, opt) {
                    sourceData.push(jQuery(opt).val());
                });                

                jQuery(document).trigger('agsattrack.satsselected', {
                    selections : sourceData
                }); 
                jQuery(document).trigger('agsattrack.forceupdate', {});                                        

            } else {
                var sourceData = [];
                if (all) {
                    _move('right', all);
                }
                selectedOpts = _move(direction, all);
                jQuery.each(selectedOpts, function(index, opt) {
                    sourceData.push(jQuery(opt).val());
                });

                jQuery(document).trigger('agsattrack.satsselected', {
                    selections : sourceData
                }); 
                jQuery(document).trigger('agsattrack.forceupdate', {});                                        

            }
            divRight.jqxListBox('clearSelection'); 
            divLeft.jqxListBox('clearSelection');             
        }
        
        function SendMoveEvents() {
            var sourceData = [];
            var rightItems = divRight.jqxListBox('getItems'); 
            if (typeof rightItems !== 'undefined' && rightItems.length > 0) {
                for (var i=0;i<rightItems.length;i++) {
                    sourceData.push(rightItems[i].value);    
                }
            }
            jQuery(document).trigger('agsattrack.satsselected', {
                selections : sourceData
            });                     
        }

        function clear() {
            jQuery('#leftsat').children().remove();
            jQuery('#rightsat').children().remove();
        }

        function setData(tles) {
            clear(); 
            for (var i=0; i < tles.getCount(); i++) {          
                var sat = tles.getSatellite(i);
                var name = sat.getName(); 
                var value = sat.getCatalogNumber();       
                if (sat.isDisplaying()) {
                    jQuery('#rightsat').append('<option value="'+value+'">'+name+'</option>');
                } else {
                    jQuery('#leftsat').append('<option value="'+value+'">'+name+'</option>');
                }
            }    
        }


        function option (key, val) {
            if (val) {
                options[key] = val;
            } else {
                return options[key];
            }
        }

        function destroy() {
            $el.each(function() {
                var el = this;
                var $el = $(this);

                // Add code to restore the element to its original state...

                hook('onDestroy');
                $el.removeData('plugin_' + pluginName);
            });
        }

        function hook(hookName) {
            if (options[hookName] !== undefined) {
                options[hookName].call(el);
            }
        }

        init();

        return {
            option: option,
            destroy: destroy,
            clear: clear,
            setData: setData,
            moveAllSats : moveAllSats
        };
    }

    $.fn[pluginName] = function(options) {
        if (typeof arguments[0] === 'string') {
            var methodName = arguments[0];
            var args = Array.prototype.slice.call(arguments, 1);
            var returnVal;
            this.each(function() {
                if ($.data(this, 'plugin_' + pluginName) && typeof $.data(this, 'plugin_' + pluginName)[methodName] === 'function') {
                    returnVal = $.data(this, 'plugin_' + pluginName)[methodName].apply(this, args);
                } else {
                    throw new Error('Method ' +  methodName + ' does not exist on jQuery.' + pluginName);
                }
            });
            if (returnVal !== undefined){
                return returnVal;
            } else {
                return this;
            }
        } else if (typeof options === "object" || !options) {
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        }
    };

    $.fn[pluginName].defaults = {
        onInit: function() {},
        onDestroy: function() {}
    };

})(jQuery);