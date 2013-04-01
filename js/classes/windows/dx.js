var AGDXWINDOW = function(element, params) {

    var _element = element;

    var _gridElementId = AGUTIL.getId();
    var _gridElement;
        
    var _view = null;
                
    jQuery(_element).window({  
        width:600,  
        height:370,
        title: 'Visible Locations',  
        modal:false,
        minimizable: false,
        maximizable : false  
    });
    
    _gridElement = jQuery(_element).window('body')[0].id;

    _view = new AGDXVIEW(_gridElement);
    _view.init();
    _view.startRender();  
                         
    return {
        init : function(params) {
            jQuery(_element).window('open');    
        }    
    };
};