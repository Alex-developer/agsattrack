var AGINFOWINDOW = function(element, params) {

    var _element = element;
                         
    return {
        init : function(params) {
            jQuery(_element).window('open');    
        }    
    };
};