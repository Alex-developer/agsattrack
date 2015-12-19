<?php

/* home/parts/general/ga.twig */
class __TwigTemplate_cb96bf2b365c70506d81bb23413bac0c329095669fa2ad9e11659635c428f955 extends Twig_Template
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
        echo "    <script type=\"text/javascript\">
        var href = document.location.href;
        
        if (href.indexOf('local') === -1) {
            if (AGSETTINGS.cookiesOk()) {
                var _gaq = _gaq || [];
                _gaq.push([ '_setAccount', 'UA-36758800-1' ]);
                _gaq.push([ '_trackPageview' ]);

                (function() {
                    var ga = document.createElement('script');
                    ga.type = 'text/javascript';
                    ga.async = true;
                    ga.src = ('https:' == document.location.protocol ? 'https://ssl'
                            : 'http://www')
                            + '.google-analytics.com/ga.js';
                    var s = document.getElementsByTagName('script')[0];
                    s.parentNode.insertBefore(ga, s);
                })();
            }
        }
    </script>";
    }

    public function getTemplateName()
    {
        return "home/parts/general/ga.twig";
    }

    public function getDebugInfo()
    {
        return array (  19 => 1,);
    }
}
/*     <script type="text/javascript">*/
/*         var href = document.location.href;*/
/*         */
/*         if (href.indexOf('local') === -1) {*/
/*             if (AGSETTINGS.cookiesOk()) {*/
/*                 var _gaq = _gaq || [];*/
/*                 _gaq.push([ '_setAccount', 'UA-36758800-1' ]);*/
/*                 _gaq.push([ '_trackPageview' ]);*/
/* */
/*                 (function() {*/
/*                     var ga = document.createElement('script');*/
/*                     ga.type = 'text/javascript';*/
/*                     ga.async = true;*/
/*                     ga.src = ('https:' == document.location.protocol ? 'https://ssl'*/
/*                             : 'http://www')*/
/*                             + '.google-analytics.com/ga.js';*/
/*                     var s = document.getElementsByTagName('script')[0];*/
/*                     s.parentNode.insertBefore(ga, s);*/
/*                 })();*/
/*             }*/
/*         }*/
/*     </script>*/
