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
            divLeft = $('<div style="float:left;" />');
            var divCenter = $('<div style="float:left;" />');
            divRight = $('<div style="float:left;" />');
            divLeft.jqxListBox({ source: leftSource, width: 250, height: 400, allowDrop: true, allowDrag: true, multipleextended: true,
                dragEnd: function (dragItem, dropItem) {
                    SendMoveEvents();                    
                    return true;
                }                                   
            });
            divRight.jqxListBox({ source: rightSource, checkboxes: true, width: 250, height: 400, allowDrop: true, allowDrag: true, multipleextended: true,
                dragEnd: function (dragItem, dropItem) {
                    SendMoveEvents();                    
                    return true;
                }
            });

            var buttonPrefix =  $el.attr('id')+'Button';
            var selectorHTML = '        \
            <div style="position:relative; height:200px;width: 50px">   \
            <div style="position: absolute;top: 35%;">    \
            <button class="'+buttonPrefix+' all left" type="button"><<</button>     \
            <button class="'+buttonPrefix+' all right" type="button">>></button>     \
            </div>    \
            </div>';

            divCenter.append(selectorHTML);
            divLeft.jqxListBox.bind('select', function (e) {
                var args = e.args;

            });
            divRight.jqxListBox.bind('select', function (e) {

            });

            divWrapper.append(divLeft);
            divWrapper.append(divCenter);
            divWrapper.append(divRight);
            $el.append(divWrapper);                         

            $('.' + buttonPrefix).on('click', function(e){
                var el = $(e.target);
                var direction = el.hasClass('right') ? 'right' : 'left';

                moveAllSats(direction);
                
                e.stopImmediatePropagation();
            });

            divRight.on('checkChange', function (event) {
                if (!_ignoreEvents) {
                    var args = event.args;
                    if (args.checked) {
                        jQuery(document).trigger('agsattrack.satclicked', {
                            index : args.value,
                            state: true
                        });
                    } else {
                        jQuery(document).trigger('agsattrack.satclicked', {
                            index : args.value,
                            state: false
                        });                    
                    }
                }
            });  
            
            jQuery(document).bind('agsattrack.newsatselected', function(event, params) {
                _ignoreEvents = true;
                divRight.jqxListBox('uncheckAll');
                var rightItems = divRight.jqxListBox('getItems');
                for (var i=0; i<params.satellites.length; i++) {
                    for (var j=0; j<rightItems.length;j++) {
                        if (rightItems[j].value === params.satellites[i].getName()) {
                            divRight.jqxListBox('checkIndex', rightItems[j].index);
                            break;    
                        }
                    }    
                }
                _ignoreEvents = false;    
            });
                   
            hook('onInit');
        }

        function moveAllSats(direction) {
            if (direction === 'right') {
                var leftItems = divLeft.jqxListBox('getItems');
                var rightItems = divRight.jqxListBox('getItems');
                var sourceData = [];
                if (typeof rightItems !== 'undefined' && rightItems.length > 0) {
                    for (var i=0;i<rightItems.length;i++) {
                        sourceData.push(rightItems[i].value);    
                    }
                }
                if (typeof leftItems !== 'undefined' && leftItems.length > 0) {
                    for (var i=0;i<leftItems.length;i++) {
                        sourceData.push(leftItems[i].value);    
                    }
                }

                jQuery(document).trigger('agsattrack.satsselected', {
                    selections : sourceData
                }); 
                jQuery(document).trigger('agsattrack.forceupdate', {});                                        

                divLeft.jqxListBox('clear');
                divRight.jqxListBox({ source: sourceData});

            } else {
                var leftItems = divLeft.jqxListBox('getItems');
                var rightItems = divRight.jqxListBox('getItems');
                var sourceData = [];
                if (typeof leftItems !== 'undefined' && leftItems.length > 0) {
                    for (var i=0;i<leftItems.length;i++) {
                        sourceData.push(leftItems[i].value);    
                    }
                }
                if (typeof rightItems !== 'undefined' && rightItems.length > 0) {
                    for (var i=0;i<rightItems.length;i++) {
                        sourceData.push(rightItems[i].value);    
                    }
                }
                divRight.jqxListBox('clear');
                divLeft.jqxListBox({ source: sourceData});

                jQuery(document).trigger('agsattrack.satsselected', {
                    selections : []
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
            divLeft.jqxListBox('clear');
            divRight.jqxListBox('clear');
        }

        function setData(tles) {
            clear(); 
            for (var i=0; i < tles.getCount(); i++) {          
                var sat = tles.getSatellite(i);        
                if (sat.isDisplaying()) {
                    divRight.jqxListBox('addItem', sat.getName());    
                } else {
                    divLeft.jqxListBox('addItem', sat.getName());    
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