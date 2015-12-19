<?php

/* home/parts/general/help.twig */
class __TwigTemplate_a84e7f051c8b62a9da548e0e3e8bdfab840cadee45cf98cd3e5a08b84286b1ef extends Twig_Template
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
        echo "    <div id=\"help-window\" class=\"easyui-window\" data-options=\"title:'Help',closed:true, resizable:false, minimizable:false,maximizable:false, collapsible: false\" style=\"width:900px;height:600px;padding:0px\">
        <div class=\"easyui-layout\" data-options=\"fit:true\">
            <div data-options=\"region:'center',border:false\" style=\"background:#fff;border:1px solid #ccc;\">
                <div class=\"easyui-layout\" data-options=\"fit:true\">
                    <div data-options=\"region:'west',split:true,title:'Topics'\" style=\"width:200px;overflow:auto\">
                        <ul id=\"help-tree\" class=\"easyui-tree\">  
                            <li>  
                                <span>Help Topics</span>  
                                <ul>  
                                    <li>  
                                        <span>Introduction</span>  
                                        <ul>  
                                            <li>  
                                                <span><a href=\"help/whatis.html\" class=\"tree-help-item\">What is AgSatTrack</a></span>  
                                            </li>   
                                        </ul>                  
                                    </li>
                                    <li>  
                                        <span>How To</span>  
                                        <ul>  
                                            <li>  
                                                <span><a href=\"help/loadgroups.html\" class=\"tree-help-item\">Load Groups</a></span>  
                                            </li>  
                                        </ul>                  
                                    </li>                
                                </ul>  
                            </li>  
                        </ul>                    
                    </div>
                    <div data-options=\"region:'center',title:'Help'\">
                        <div id=\"help-content\" style=\"padding:2px\">
                        </div>
                    </div>
                </div>
            </div>
            <div data-options=\"region:'south',border:false\" style=\"text-align:right;padding:5px 0;\">
                <a class=\"easyui-linkbutton\" href=\"javascript:void(0)\" onclick=\"jQuery('#help-window').window('close');\">Ok</a>
            </div>
        </div>
    </div>
    
    <div id=\"help-1\" class=\"helpwrapper\">
        <div style=\"width: 220px\" class=\"helptext\">       
            <h2><span><img src=\"/images/info.png\" width=32 /></span>Information</h2>
            <p>There are {tlecount} satellites loaded but none are current being displayed.</p>
            <p>before satellites are displayed you need to add them. There are two ways to add satellites.</p>
            <ul>
                <li><img src=\"/js/ribbon/icons/hot/satellite.png\"><span>Use the satellite selector on the home ribbon tab</span></li>
                <li><img src=\"/js/ribbon/icons/hot/satellite_all.png\"><span>Use the add all satellites button on the home ribbon tab</span></li>
            </ul>
        </div>
    </div>    ";
    }

    public function getTemplateName()
    {
        return "home/parts/general/help.twig";
    }

    public function getDebugInfo()
    {
        return array (  19 => 1,);
    }
}
/*     <div id="help-window" class="easyui-window" data-options="title:'Help',closed:true, resizable:false, minimizable:false,maximizable:false, collapsible: false" style="width:900px;height:600px;padding:0px">*/
/*         <div class="easyui-layout" data-options="fit:true">*/
/*             <div data-options="region:'center',border:false" style="background:#fff;border:1px solid #ccc;">*/
/*                 <div class="easyui-layout" data-options="fit:true">*/
/*                     <div data-options="region:'west',split:true,title:'Topics'" style="width:200px;overflow:auto">*/
/*                         <ul id="help-tree" class="easyui-tree">  */
/*                             <li>  */
/*                                 <span>Help Topics</span>  */
/*                                 <ul>  */
/*                                     <li>  */
/*                                         <span>Introduction</span>  */
/*                                         <ul>  */
/*                                             <li>  */
/*                                                 <span><a href="help/whatis.html" class="tree-help-item">What is AgSatTrack</a></span>  */
/*                                             </li>   */
/*                                         </ul>                  */
/*                                     </li>*/
/*                                     <li>  */
/*                                         <span>How To</span>  */
/*                                         <ul>  */
/*                                             <li>  */
/*                                                 <span><a href="help/loadgroups.html" class="tree-help-item">Load Groups</a></span>  */
/*                                             </li>  */
/*                                         </ul>                  */
/*                                     </li>                */
/*                                 </ul>  */
/*                             </li>  */
/*                         </ul>                    */
/*                     </div>*/
/*                     <div data-options="region:'center',title:'Help'">*/
/*                         <div id="help-content" style="padding:2px">*/
/*                         </div>*/
/*                     </div>*/
/*                 </div>*/
/*             </div>*/
/*             <div data-options="region:'south',border:false" style="text-align:right;padding:5px 0;">*/
/*                 <a class="easyui-linkbutton" href="javascript:void(0)" onclick="jQuery('#help-window').window('close');">Ok</a>*/
/*             </div>*/
/*         </div>*/
/*     </div>*/
/*     */
/*     <div id="help-1" class="helpwrapper">*/
/*         <div style="width: 220px" class="helptext">       */
/*             <h2><span><img src="/images/info.png" width=32 /></span>Information</h2>*/
/*             <p>There are {tlecount} satellites loaded but none are current being displayed.</p>*/
/*             <p>before satellites are displayed you need to add them. There are two ways to add satellites.</p>*/
/*             <ul>*/
/*                 <li><img src="/js/ribbon/icons/hot/satellite.png"><span>Use the satellite selector on the home ribbon tab</span></li>*/
/*                 <li><img src="/js/ribbon/icons/hot/satellite_all.png"><span>Use the add all satellites button on the home ribbon tab</span></li>*/
/*             </ul>*/
/*         </div>*/
/*     </div>    */
