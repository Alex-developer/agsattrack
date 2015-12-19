<?php

/* home/parts/south/south.twig */
class __TwigTemplate_7f2412b46f0d565c5791c53c2c620c3d0ce6991fed5230033563312bfd7d7690 extends Twig_Template
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
        echo "        <div id=\"statusbar\">
            <div id=\"status\" class=\"panel\"><strong>Initialising</strong></div>
            <div id=\"statusgroup\" class=\"panel\"><strong>Group:</strong> NONE</div>
            <div id=\"statusfollowing\" class=\"panel\"><strong>Following:</strong> NONE</div>
            <div id=\"statustotalloaded\" class=\"panel\">0 Satellites Loaded</div>
            <div id=\"currenttime\" class=\"panel\"></div>
            <div id=\"credits\" class=\"panel\"></div>
                        
            <div id=\"social-fb\" class=\"panel last-panel\">
                <div id=\"fb-root\"></div>
                    <script>(function(d, s, id) {
                      var js, fjs = d.getElementsByTagName(s)[0];
                      if (d.getElementById(id)) return;
                      js = d.createElement(s); js.id = id;
                      js.src = \"//connect.facebook.net/en_GB/all.js#xfbml=1&appId=218900791485439\";
                      fjs.parentNode.insertBefore(js, fjs);
                    }(document, 'script', 'facebook-jssdk'));</script>
                    <div class=\"fb-like\" data-href=\"http://www.facebook.com/agsattrack\" data-send=\"true\" data-layout=\"button_count\" data-width=\"450\" data-show-faces=\"true\"></div>
            </div>
            <div id=\"social-twitter\" class=\"panel\">
                <iframe allowtransparency=\"true\" frameborder=\"0\" scrolling=\"no\" src=\"https://platform.twitter.com/widgets/tweet_button.html?via=agsattrack\" style=\"width:105px; height:20px;\"></iframe>
                <iframe allowtransparency=\"true\" frameborder=\"0\" scrolling=\"no\" src=\"//platform.twitter.com/widgets/follow_button.html?screen_name=agsattrack\" style=\"width:200px; height:20px;\"></iframe>
            </div>            
        </div>";
    }

    public function getTemplateName()
    {
        return "home/parts/south/south.twig";
    }

    public function getDebugInfo()
    {
        return array (  19 => 1,);
    }
}
/*         <div id="statusbar">*/
/*             <div id="status" class="panel"><strong>Initialising</strong></div>*/
/*             <div id="statusgroup" class="panel"><strong>Group:</strong> NONE</div>*/
/*             <div id="statusfollowing" class="panel"><strong>Following:</strong> NONE</div>*/
/*             <div id="statustotalloaded" class="panel">0 Satellites Loaded</div>*/
/*             <div id="currenttime" class="panel"></div>*/
/*             <div id="credits" class="panel"></div>*/
/*                         */
/*             <div id="social-fb" class="panel last-panel">*/
/*                 <div id="fb-root"></div>*/
/*                     <script>(function(d, s, id) {*/
/*                       var js, fjs = d.getElementsByTagName(s)[0];*/
/*                       if (d.getElementById(id)) return;*/
/*                       js = d.createElement(s); js.id = id;*/
/*                       js.src = "//connect.facebook.net/en_GB/all.js#xfbml=1&appId=218900791485439";*/
/*                       fjs.parentNode.insertBefore(js, fjs);*/
/*                     }(document, 'script', 'facebook-jssdk'));</script>*/
/*                     <div class="fb-like" data-href="http://www.facebook.com/agsattrack" data-send="true" data-layout="button_count" data-width="450" data-show-faces="true"></div>*/
/*             </div>*/
/*             <div id="social-twitter" class="panel">*/
/*                 <iframe allowtransparency="true" frameborder="0" scrolling="no" src="https://platform.twitter.com/widgets/tweet_button.html?via=agsattrack" style="width:105px; height:20px;"></iframe>*/
/*                 <iframe allowtransparency="true" frameborder="0" scrolling="no" src="//platform.twitter.com/widgets/follow_button.html?screen_name=agsattrack" style="width:200px; height:20px;"></iframe>*/
/*             </div>            */
/*         </div>*/
