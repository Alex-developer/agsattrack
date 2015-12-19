<?php

/* home/parts/general/contact.twig */
class __TwigTemplate_a022feb97522ab47cbf1fd84e1021c45c73c3aa80553731ae8e563e2543a2abc extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "    <div id=\"contact-window\" class=\"easyui-window\" data-options=\"title:'Contact',closed:true, resizable:false, minimizable:false,maximizable:false, collapsible: false\" style=\"width:500px;height:200px;padding:5px;\">
        <div class=\"easyui-layout\" data-options=\"fit:true\">
            <div data-options=\"region:'center',border:false\" style=\"padding:10px;background:#fff;border:1px solid #ccc;\">
                <h2>Contact</h2>
                <p>To contact me please send an email to alex AT agsattrack.com</p>
            </div>
            <div data-options=\"region:'south',border:false\" style=\"text-align:right;padding:5px 0;\">
                <a class=\"easyui-linkbutton\" href=\"javascript:void(0)\" onclick=\"jQuery('#contact-window').window('close');\">Ok</a>
            </div>
        </div>
    </div>";
    }

    public function getTemplateName()
    {
        return "home/parts/general/contact.twig";
    }

    public function getDebugInfo()
    {
        return array (  19 => 1,);
    }
}
/*     <div id="contact-window" class="easyui-window" data-options="title:'Contact',closed:true, resizable:false, minimizable:false,maximizable:false, collapsible: false" style="width:500px;height:200px;padding:5px;">*/
/*         <div class="easyui-layout" data-options="fit:true">*/
/*             <div data-options="region:'center',border:false" style="padding:10px;background:#fff;border:1px solid #ccc;">*/
/*                 <h2>Contact</h2>*/
/*                 <p>To contact me please send an email to alex AT agsattrack.com</p>*/
/*             </div>*/
/*             <div data-options="region:'south',border:false" style="text-align:right;padding:5px 0;">*/
/*                 <a class="easyui-linkbutton" href="javascript:void(0)" onclick="jQuery('#contact-window').window('close');">Ok</a>*/
/*             </div>*/
/*         </div>*/
/*     </div>*/
