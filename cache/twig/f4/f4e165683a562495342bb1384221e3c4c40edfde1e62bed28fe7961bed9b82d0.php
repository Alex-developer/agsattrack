<?php

/* home/home.twig */
class __TwigTemplate_2e6d38562c4ed58272c1ab17786c3a6b2274e54a1d82b6276f5942bab571bb7b extends Twig_Template
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
        echo "<!DOCTYPE html>
<html lang=\"en\">
    <head>
        <meta charset=\"UTF-8\">
        <title>AGSatTrack - Online</title>
        ";
        // line 6
        $this->loadTemplate("home/parts/general/scripts.twig", "home/home.twig", 6)->display($context);
        echo "  
    </head>
    <body class='easyui-layout default' style=\"display: none\" id=\"body\">
        <div data-options=\"region:'north', title:'&nbsp;'\" style=\"height: 120px;\">
            ";
        // line 10
        $this->loadTemplate("home/parts/north/ribbon.twig", "home/home.twig", 10)->display($context);
        // line 11
        echo "        </div>
        <div data-options=\"region:'west',split:true\" title=\"Information\" style=\"width: 270px;\">
            ";
        // line 13
        $this->loadTemplate("home/parts/west/west.twig", "home/home.twig", 13)->display($context);
        // line 14
        echo "        </div>
        <div data-options=\"region:'center'\" id=\"center-panel\">
            ";
        // line 16
        $this->loadTemplate("home/parts/center/center.twig", "home/home.twig", 16)->display($context);
        // line 17
        echo "        </div>
        <div data-options=\"region:'south'\" id=\"south-panel\">
            ";
        // line 19
        $this->loadTemplate("home/parts/south/south.twig", "home/home.twig", 19)->display($context);
        // line 20
        echo "        </div>
        ";
        // line 21
        $this->loadTemplate("home/parts/general/contact.twig", "home/home.twig", 21)->display($context);
        // line 22
        echo "        ";
        $this->loadTemplate("home/parts/general/help.twig", "home/home.twig", 22)->display($context);
        // line 23
        echo "        ";
        $this->loadTemplate("home/parts/general/joyride.twig", "home/home.twig", 23)->display($context);
        // line 24
        echo "        ";
        $this->loadTemplate("home/parts/general/ga.twig", "home/home.twig", 24)->display($context);
        echo "           
    </body>
</html>";
    }

    public function getTemplateName()
    {
        return "home/home.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  64 => 24,  61 => 23,  58 => 22,  56 => 21,  53 => 20,  51 => 19,  47 => 17,  45 => 16,  41 => 14,  39 => 13,  35 => 11,  33 => 10,  26 => 6,  19 => 1,);
    }
}
/* <!DOCTYPE html>*/
/* <html lang="en">*/
/*     <head>*/
/*         <meta charset="UTF-8">*/
/*         <title>AGSatTrack - Online</title>*/
/*         {% include 'home/parts/general/scripts.twig' %}  */
/*     </head>*/
/*     <body class='easyui-layout default' style="display: none" id="body">*/
/*         <div data-options="region:'north', title:'&nbsp;'" style="height: 120px;">*/
/*             {% include 'home/parts/north/ribbon.twig' %}*/
/*         </div>*/
/*         <div data-options="region:'west',split:true" title="Information" style="width: 270px;">*/
/*             {% include 'home/parts/west/west.twig' %}*/
/*         </div>*/
/*         <div data-options="region:'center'" id="center-panel">*/
/*             {% include 'home/parts/center/center.twig' %}*/
/*         </div>*/
/*         <div data-options="region:'south'" id="south-panel">*/
/*             {% include 'home/parts/south/south.twig' %}*/
/*         </div>*/
/*         {% include 'home/parts/general/contact.twig' %}*/
/*         {% include 'home/parts/general/help.twig' %}*/
/*         {% include 'home/parts/general/joyride.twig' %}*/
/*         {% include 'home/parts/general/ga.twig' %}           */
/*     </body>*/
/* </html>*/
