/*
 * jQuery Officebar 0.2
 *
 * Copyright (c) 2009 Sven Rymenants
 * GPL (GPL-LICENSE.txt) license.
 *
 */
;(function($) {
  // private function for debugging
  $.buildOfficeBar = function(object, options) {
    if ($(object).data("officebar")) { return false; } //return if already exist	

    options = $.extend({}, $.fn.officebar.defaults, options);

    var officeBarClass = {
      object: null,

      closeMenu: function() {
        var menu = $(object).data("officebar.activeMenu");
        if(menu === null) { return; }

        if (menu.type === 0) {
          this.hideSplitMenu(menu.object); }
        else if(menu.type === 1) {
          this.hideDropDown(menu.object); }
      },

      showSplitMenu: function(triggerButton) {
        var me = $(triggerButton).parent();
        var menu = me.data("officebar.menu");
        if(!menu) { return; }

        var activeMenu = $(object).data("officebar.activeMenu");
        if(activeMenu && ((activeMenu.type !== 0) || (activeMenu.object !== menu))) {
          this.hideSplitMenu(activeMenu.object); }
        var eventInfo = { id: me.attr("id"), rel: me.attr("rel") };

        if(options.onBeforeShowSplitMenu) {
          (options.onBeforeShowSplitMenu)(eventInfo); }

        menu.show();
        $(object).data("officebar.activeMenu", {object: menu, type: 0});

        //Fixes repaint bug in IE7
        if($.browser.msie)
          $("ul", object).css('display', 'none').css('display', 'block');

        if(options.onAfterShowSplitMenu) {
          (options.onAfterShowSplitMenu)(eventInfo); }
      },

      hideSplitMenu: function(menu) {
        //var eventInfo = { id: me.attr("id"), rel: me.attr("rel") };

        if(options.onBeforeHideSplit) {
          (options.onBeforeHideSplit)({id:null, rel:null}); }

        $(menu).hide();

        $(object).data("officebar.activeMenu", null);
        if(options.onAfterHideSplit) {
          (options.onAfterHideSplit)({id:null, rel:null}); }
      },
      
      showDropDown: function(triggerButton) {
        var me = $(triggerButton);
        var eventInfo = { id: me.attr("id"), rel: me.attr("rel") };
        var menu = me.data("officebar.menu");
        var pos = me.offset();

        menu.css({top: pos.top+me.height(), left: pos.left}).show();
        
        $(me).addClass("opened");

        $(object).data("officebar.activeMenu", {object: menu, type: 1});
        if(options.onShowDropdown) {
          (options.onShowDropdown)(eventInfo); }
      },

      hideDropDown: function(dropdown) {
        var b = $("a.opened");
        var eventInfo = { id: b.attr("id"), rel: b.attr("rel") };

        b.removeClass("opened");
        $(dropdown).hide();

        $(object).data("officebar.activeMenu", null);
        if(options.onHideDropdown) {
          (options.onHideDropdown)(eventInfo); }
      },
      
      bindButton: function(ref, fnc) {
        var aRef = ref.split(">");
        switch(aRef.length) {
          case 1: $("a[rel="+aRef[0]+"]", object).bind("click", fnc); break;
          case 2: $("a[rel="+aRef[0]+"] + div>ul>li div a[rel="+aRef[1]+"]", object).bind("click", fnc); break;
        }
      },
      
      selectTab: function(trigger) {
        var activeTab = $(object).data("officebar.activeTab");
        
        this.closeMenu();
        
        if(activeTab) {
          $("div:eq(0)", activeTab)
            .hide()
            .parent()
            .removeClass('current'); }

        $(object).data("officebar.activeTab",
        $(trigger)
          .next()
          .show()
          .end()
          .parent()
          .addClass('current')
          .get(0));
        
        var me = $(trigger);
        if(options.onSelectTab) {
          (options.onSelectTab)({ id: me.attr("id"), rel: me.attr("rel") }); }
      },
      
      dragStart: function(e, obj) {
        var menu = $(obj).parent().parent();
        $(object).data("officebar.resize", {
          object: menu,
          startX: e.pageX,
          startY: e.pageY,
          width: $(obj).width(),
          height: menu.height(),
          handle: parseInt($(obj).css('margin-top'), 10) });
        $("body").css("cursor", "se-resize");
      },

      dragMove: function(e) {
        var dragData = $(object).data("officebar.resize");
        if(!dragData) { return; }
        
        var diffX = e.pageX - dragData.startX + dragData.width;
        var diffY = e.pageY - dragData.startY + dragData.height;

        var diffHandle = e.pageY - dragData.startY + dragData.handle;
        if(diffHandle > 0)
        {
          $('li.resize', dragData.object).css('margin-top', diffHandle);
          dragData.object.css({width: diffX+"px", height: diffY+"px" });
        }
      },
      
      dragStop: function(e) {
        var dragData = $(object).data("officebar.resize");
        if(!dragData) {
          //var menuData = $(object).data("officebar.activeMenu");
          return;
        }
        $(object).data("officebar.resize", null);
        $("body").css("cursor", "default");
      }
    };
    
    //Object data
    $(object).data("officebar", {
      init: true,
      options: options,
      version: "0.1"});
    $(object).data("officebar.activeMenu", null);
    $(object).data("officebar.activeTab", null);
    $(object).data("officebar.resize", null);

    // create the tab event handler
    $(">ul>li", object).each(function() {
      var isSelected = $(this).hasClass("current");
      if(isSelected) {
        $(object).data("officebar.activeTab", this); }
      
      $(">ul", this).wrap('<div class="officetab"></div>')
        .parent()
        .css('display', isSelected ? 'block' : 'none');
      
      $("a:eq(0)", this).bind("click", function(e) {
        (officeBarClass.selectTab)(this);
        return false;
      });
    });

    //Wrap each li content in panel div
    $("div.officetab>ul>li", object).each(function() {
      $(this).wrapInner('<div class="panel"></div>');
    });

    // small button alignment
    $("div.list>ul, div.textlist>ul", object).each(function() {
      var count = $("li", this).size();
      var style = "";
      if(count === 1) {
        style = ' style="margin-top: 23px"'; }
      else if(count === 2) {
        style = ' style="margin-top: 14px"'; }
      $(this).wrap('<div'+style+'></div>');
    });

    //text button lists
    $("div.textlist li>a", object).each(function() {
      $(this).wrapInner('<span></span>');
    });

    //dropdown lists
    $("li.dropdown ul>li", object).each(function() {
      $(this).wrapInner('<span></span>');
    });

    // split button menu move and event binding
    $("div.split>div", object).each(function() {
      var me = $(this);
      var pos = me.offset();
      
      me.prev() //TODO: check node type
      .data("officebar.menu",
         me.clone()
          .css("display", "none")
          .addClass("buttonsplitmenu")
          .css({top: pos.top, left: pos.left, display: "none"})
          .appendTo(object)
          .bind("click", function(e) {
            if($(e.target).parent().hasClass("resize")) return;
              (officeBarClass.hideSplitMenu)(this);
          })
        .find("li>a")
        .wrapInner('<span></span>')
        .end()
      );

      //IE fix for popup's: Fix width
      if($.browser.msie)
      {
        var help = me.prev().data("officebar.menu");
        help.css("width", help.width());
      }
      me.remove();
    });

    // create the split button event handler
    $("div.split>a>span", object).bind("click", function(e) {
      (officeBarClass.showSplitMenu)(this);
      return false; //prevent that the button handler closes the menu again
    });

    // dropdown button menu move and event binding
    $("div.textlist li.dropdown div", object).each(function(){
      var me = $(this);
      me.prev() //TODO: check node type
        .data("officebar.menu",
           me.clone()
          .css("display", "none")
          .addClass("buttonsplitmenu")
          .appendTo(object)
          .bind("click", function(e) {
            (officeBarClass.hideDropDown)(this);
          })
          .find("li>a")
          .wrapInner('<span></span>')
          .end()
        );

      //IE fix for popup's: Fix width
      if($.browser.msie)
      {
        var help = me.prev().data("officebar.menu");
        help.css("width", help.width());
      }
      me.remove();
    });

    // create the dropdown button menu event handler
    $("div.textlist li.dropdown>a", object).bind("click", function(e) {
      var me = $(this);
      var menu = me.data("officebar.menu");
      if(menu) {
        if(menu.is(":visible")) {
          (officeBarClass.hideDropDown)(me.data("officebar.menu"));
        }
        else {
          (officeBarClass.showDropDown)(this);
        }
      }
    });
    
    //Event handlers: buttons
    $("div.button>a, div.list a").bind("click", function(e) {
      var me = $(this);
      e.preventDefault();
      var eventInfo = { id: me.attr("id"), rel: me.attr("rel") };

      if($(object).data("officebar.activeMenu")) {
        (officeBarClass.closeMenu)(); }

      if(options.onClickButton) {
        (options.onClickButton)(eventInfo); }
    });

    //Add separator to text boxes
    $(".textboxlist", object).addClass("separator");
    $(".textboxlist:eq(0)", object).removeClass("separator");

    //Separator button alignment
    $("div.textboxlist>ul", object).each(function() {
      var count = $("li", this).size();
      var style = "";
      if(count === 1) {
        style = ' style="margin-top: 23px"'; }
      else if(count === 2) {
        style = ' style="margin-top: 13px"'; }
      $(this).wrap('<div'+style+'></div>');
    });
    
    //Add the resize to the list
    $("div.buttonsplitmenu ul", object).append('<li class="resize"><span>&nbsp;</span></li>');
    $("div.buttonsplitmenu ul li.resize", object).bind("mousedown", function(e) { (officeBarClass.dragStart)(e, this); });

		$(document)
    .bind("mousemove", function(e) { (officeBarClass.dragMove)(e); })
    .bind("mouseup", function(e) { (officeBarClass.dragStop)(e); })
    .bind("hover", function(e) { (officeBarClass.dragStop)(e); })
		;
    
    //Next task
    
		//Publish class
    $(object).data("officebar.class", officeBarClass);
  };

	$.fn.officebar = function(options) {
		return this.each(function() { 
      $.buildOfficeBar(this, options);
    });
	};

  $.fn.officebarBind = function(ref, fnc) {
		return this.each(function() { 
      if($(this).data("officebar")) {
        $(this).data("officebar.class").bindButton(ref, fnc); }
    });
  };
  
  // plugin defaults
  $.fn.officebar.defaults = {
    onSelectTab: false,
    onBeforeShowSplitMenu: false,
    onAfterShowSplitMenu: false,
    onBeforeHideSplit: false,
    onAfterHideSplit: false,
    onShowDropdown: false,
    onHideDropdown: false,
    onClickButton: false
  };
})(jQuery);
