<?php

/* home/parts/north/ribbon.twig */
class __TwigTemplate_45ae0164c65be890503d45bd36b9111d1904fecb85d9af3c648d23c7659cf9f2 extends Twig_Template
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
        echo "        <div id=\"ribbon\">
            <span class=\"ribbon-window-title\"></span>
            <div class=\"ribbon-tab file\" id=\"info-tab\">
                ";
        // line 4
        $this->loadTemplate("home/parts/north/info/info.twig", "home/parts/north/ribbon.twig", 4)->display($context);
        // line 5
        echo "            </div>
            
            <div class=\"ribbon-tab\" id=\"format-tab\">
                <span class=\"ribbon-title\">Home</span>

                <div class=\"ribbon-section\">
                    <span class=\"section-title\" data-tab=\"home\">View</span>
                    <div class=\"ribbon-button ribbon-button-large\" id=\"view-select\" data-type=\"dropdownmenu\">
                        <span class=\"button-title\">Select <img src=\"js/ribbon/arrow_down.png\"></span> 
                        <span class=\"button-help\"><strong>Select view.</strong><br /><br />Selects the view you wish to display.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for mor information</span></span>
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/view.png\" /> 
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/view.png\" /> 
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/view.png\" />
                        <div class=\"ribbon-menu ribbon-menu-closed\">
                            <div class=\"title\">Select View</div>
                            <ul>
                                <li class=\"satview\" data-options=\"list\"><img src=\"images/ribbon/list.png\"><span>List View</span></li>
                                <li class=\"satview\" data-options=\"passes\"><img src=\"images/ribbon/table.png\"><span>Passes View</span></li>
                                <li class=\"satview\" data-options=\"3d\"><img src=\"images/ribbon/globe.png\"><span>3D View</span></li>
                                <li class=\"satview\" data-options=\"polar\"><img src=\"images/ribbon/polar.png\"><span>Polar View</span></li>
                                <li class=\"satview\" data-options=\"sky\"><img src=\"images/ribbon/sky.png\"><span>Sky View</span></li>
                                <li class=\"satview\" data-options=\"timeline\"><img src=\"images/ribbon/timeline.png\"><span>Timeline View</span></li>
                                <li class=\"satview\" data-options=\"dx\"><img src=\"/js/ribbon/icons/normal/dx-16.png\"><span>Dx View</span></li>
                            </ul>
                        </div>
                    </div>
                    <div class=\"ribbon-button ribbon-button-large view-reset\">
                        <span class=\"button-title\">Reset</span>
                        <span class=\"button-help\"><strong>Reset view.</strong><br /><br />Resets the current view to its defaults.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for mor information</span></span>                        
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/reset.png\" /> 
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/reset.png\" /> 
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/reset.png\" />
                    </div>
                </div>

                <div class=\"ribbon-section\">
                    <span class=\"section-title\">Satellites</span>
                    
                    <div class=\"ribbon-fl\">
                        <div class=\"ribbon-button ribbon-button-large\" id=\"sat-group-selector\"  data-type=\"dropdownmenu\">
                            <span class=\"button-title\">Groups <img src=\"js/ribbon/arrow_down.png\"></span> 
                            <span class=\"button-help\"><strong>Select Satellite Group.</strong><br /><br />Selects the group of satellites.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for mor information</span></span>                        
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/group.png\" /> 
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/group.png\" /> 
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/group.png\" />
                            <div class=\"ribbon-menu ribbon-menu-closed\">
                                <div class=\"title\">Select Group</div>
                                <div id=\"sat-group-selector-listbox\"></div>
                            </div>
                        </div>
                        <div class=\"ribbon-button ribbon-button-large\" id=\"sat-selector\" data-type=\"dropdownmenustay\">
                            <span class=\"button-title\">Select <img src=\"js/ribbon/down.png\" /></span> 
                            <span class=\"button-help\"><strong>Select Satellites.</strong><br /><br />Selects the satellites to display and show orbits for.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for mor information</span></span>                        
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/satellite.png\" /> 
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/satellite.png\" /> 
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/satellite.png\" />
                            <div class=\"ribbon-menu ribbon-menu-closed\">
                                <div class=\"title\">Select Satellite</div>
                                <div id=\"ag-satselector\"> </div>
                            </div>                        
                        </div>
                    </div>
                    <div class=\"ribbon-fl\">
                        <div class=\"ribbon-button ribbon-button-small\" id=\"sat-display-all\">
                            <span class=\"button-title\"></span>
                            <span class=\"button-help\"><strong>Display All Satellites.</strong><br /><br />Display all satellites in the current group.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for mor information</span></span>                        
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/satellite_all.png\" /> 
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/satellite_all.png\" /> 
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/satellite_all.png\" />
                        </div>
                        <div class=\"ribbon-button ribbon-button-small\" id=\"sat-display-none\">
                            <span class=\"button-title\"></span> 
                            <span class=\"button-help\"><strong>Remove All Satellites.</strong><br /><br />Remove all satellites from display.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for mor information</span></span>                        
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/satellite_delete_all.png\" /> 
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/satellite_delete_all.png\" /> 
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/satellite_delete_all.png\" />
                        </div>                     
                    </div>
                    <div class=\"ribbon-button ribbon-button-large disabled\" id=\"home-update-elements\" data-event=\"agsattrack.updategroup\">
                        <span class=\"button-title\">Update <br />Elements</span>
                        <span class=\"button-help\"><strong>Update Elements.</strong><br /><br />Update the elements for this satellite group.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/download.png\" /> 
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/download.png\" /> 
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/download.png\" />
                    </div>                                      
                </div>

                <div class=\"ribbon-section\">
                    <span class=\"section-title\">Settings</span>
                    <div style=\"float:left\">
                        <div class=\"ribbon-button ribbon-button-large\" id=\"options\">
                            <span class=\"button-title\">Options</span> 
                            <span class=\"button-help\"></span> 
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/settings.png\" />
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/settings.png\" /> 
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/settings.png\" />
                        </div>
                        <div class=\"ribbon-button ribbon-button-large\" id=\"options\" data-event=\"agsattrack.resetoptions\">
                            <span class=\"button-title\">Reset All<br />Options</span> 
                            <span class=\"button-help\"></span> 
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/reset.png\" />
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/reset.png\" /> 
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/reset.png\" />
                        </div>                        
                    </div>
                    <div style=\"float:left\">                    
                        <div class=\"ribbon-button ribbon-button-small disabled\" id=\"options-save\" unselectable=\"on\">
                            <span class=\"button-help\" unselectable=\"on\"></span>
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/save.png\" />
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/save.png\" />
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/save.png\" />
                            <span class=\"button-title\" unselectable=\"on\">Save</span>
                        </div>
                    </div>
                </div>

                <div class=\"ribbon-section\">
                    <span class=\"section-title\">Help</span>
                    <div style=\"float:left\">
                        <div class=\"ribbon-button ribbon-button-large\" id=\"help-help\">
                            <span class=\"button-title\">Help</span> 
                                <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/help.png\" /> 
                                <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/help.png\" /> 
                                <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/help.png\" />
                        </div>
                    </div>
                    <div style=\"float:left\">                    
                        <div class=\"ribbon-button ribbon-button-small\" id=\"help-tour\" unselectable=\"on\">
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/tour.png\" />
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/tour.png\" />
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/tour.png\" />
                            <span class=\"button-title\" unselectable=\"on\">Tour</span>
                        </div>
                        <div class=\"ribbon-button ribbon-button-small\" id=\"help-contact\" unselectable=\"on\">
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/email.png\" />
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/email.png\" />
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/email.png\" />
                            <span class=\"button-title\" unselectable=\"on\">Contact</span>
                        </div>
                        <div class=\"ribbon-button ribbon-button-small disabled\" id=\"help-forum\" unselectable=\"on\">
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/forum.png\" />
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/forum.png\" />
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/forum.png\" />
                            <span class=\"button-title\" unselectable=\"on\">Community</span>
                        </div>                                                  
                    </div>
                </div>                                        
            </div>
            
            <div class=\"ribbon-tab\" id=\"list-tab\">
                <span class=\"ribbon-title\" data-tab=\"list\">List View</span>
                
                <div class=\"ribbon-section\">
                    <span class=\"section-title\">View Options</span>
                    
                    <div class=\"ribbon-fl\" unselectable=\"on\">            
                        
                        <div class=\"ribbon-button ribbon-button-large view-reset\" id=\"list-view-reset\">
                            <span class=\"button-title\">Reset</span> 
                            <span class=\"button-help\"><strong>Reset view.</strong><br /><br />Resets the list view to its defaults.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/reset.png\" /> 
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/reset.png\" /> 
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/reset.png\" />
                        </div>
                            
                        <div class=\"ribbon-button ribbon-button-large\" id=\"list-view-show-mutual\" data-type=\"togglebutton\" data-event=\"agsattrack.listviewshowmutuallocations\">
                            <span class=\"button-title\">Show<br/>Mutual</span> 
                            <span class=\"button-help\"><strong>Show Mutual.</strong><br /><br />Adds a column to the table which indicates if the satellite is visible from both your location and the mutual observer.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/mutual.png\" /> 
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/mutual.png\" /> 
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/mutual.png\" />
                        </div>                                                 
                    </div>
                </div>
            </div>

            <div class=\"ribbon-tab\" id=\"3d-tab\">
                <span class=\"ribbon-title\" data-tab=\"3d\">3D View</span>
                
                <div class=\"ribbon-section\">                

                </div>
                                                    
                <div class=\"ribbon-section\">
                    <span class=\"section-title\">View Options</span>

                    <div class=\"ribbon-fl\">

                        <div class=\"ribbon-button ribbon-button-large\" id=\"3d-projection\" data-type=\"dropdownmenu\">
                            <span class=\"button-title\">Views <img src=\"js/ribbon/arrow_down.png\"></span> <span class=\"button-help\"></span>
                            <span class=\"button-help\"><strong>Select view.</strong><br /><br />Choose from 3d, 2d or 2.5d views.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/viewselect.png\" /> 
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/viewselect.png\" /> 
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/viewselect.png\" />
                            <div class=\"ribbon-menu ribbon-menu-closed\">
                                <div class=\"title\">Select View</div>
                                <ul>
                                    <li class=\"3dview\" data-options=\"twod\"><img src=\"images/ribbon/list.png\"><span>2D View</span></li>
                                    <li class=\"3dview\" data-options=\"twopointfived\"><img src=\"images/ribbon/table.png\"><span>2.5D View</span></li>
                                    <li class=\"3dview\" data-options=\"threed\"><img src=\"images/ribbon/globe.png\"><span>3D View</span></li>
                                </ul>
                            </div>
                        </div>
                        
                        <div class=\"ribbon-button ribbon-button-large\" id=\"3d-provider\" data-type=\"dropdownmenu\" style=\"width:95px;\">
                            <span class=\"button-title\">Provider <img src=\"js/ribbon/arrow_down.png\"></span> 
                            <span class=\"button-help\"><strong>Map Provider.</strong><br /><br />Select the provider for the globe rendering.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/tile.png\" /> 
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/tile.png\" />
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/tile.png\" />
                            <div class=\"ribbon-menu ribbon-menu-closed\">
                                <div class=\"title\">Select Provider</div>
                                <ul>
                                    <li class=\"tile\" data-options=\"staticimage\"><img src=\"js/ribbon/icons/normal/image.png\"><span>Static Image</span></li>
                                    <li class=\"tile\" data-options=\"bing\"><img src=\"js/ribbon/icons/normal/bing.png\"><span>Bing maps</span></li>
                                    <li class=\"tile\" data-options=\"osm\"><img src=\"js/ribbon/icons/normal/openstreetmap.png\"><span>Open StreetMap</span></li>
                                    <li class=\"tile\" data-options=\"arcgis\"><img src=\"js/ribbon/icons/normal/arcgis.png\"><span>Arc Gis</span></li>

                                </ul>
                            </div>
                        </div>                    
                                            
                        <div class=\"ribbon-button ribbon-button-large view-reset\" id=\"3d-view-reset\" style=\"width:60px;\">
                            <span class=\"button-title\">Reset</span> 
                            <span class=\"button-help\"><strong>Reset view.</strong><br /><br />Resets the 3d view to its defaults.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/reset.png\" /> 
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/reset.png\" /> 
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/reset.png\" />
                        </div>
                                            
                    </div>
                    <div class=\"ribbon-fl\" style=\"width:30px;\">
                        <div class=\"ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl\" unselectable=\"on\" data-type=\"togglebutton\" data-event=\"agsattrack.showatmosphere\" id=\"3d-atmosphere\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/atmoshpere-16.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/atmoshpere-16.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/atmoshpere-16.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Show Atmoshpere.</strong><br /><br />Toggle displaying the atmoshpere.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for mor information</span></span>                        
                        </div>
                        <div class=\"ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl\" unselectable=\"on\" data-type=\"togglebutton\" data-event=\"agsattrack.showskybox\" id=\"3d-skybox\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/cube.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/cube.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/cube.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Show Skybox.</strong><br /><br />Toggle displaying the skybox.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                        </div>                                             
                        <div class=\"ribbon-button ribbon-button-small ribbon-fl\" unselectable=\"on\" data-type=\"togglebutton\" data-event=\"agsattrack.showfps\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/fps.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/fps.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/fps.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Show FrameRate.</strong><br /><br />Display the frame rate.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                        </div>                                             

                    </div>
                    <div class=\"ribbon-fl\" style=\"width:30px;\">
                        <div class=\"ribbon-button ribbon-button-small ribbon-fl\" unselectable=\"on\" data-type=\"togglebutton\" data-event=\"agsattrack.showmousepos\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/mousepos.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/mousepos.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/mousepos.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Show Mouse Pos.</strong><br /><br />Toggle displaying the lat and lon of the mouse position.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>
                        </div>
                        
                        <div class=\"ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl\" unselectable=\"on\" data-type=\"togglebutton\" data-event=\"agsattrack.showterrain\" id=\"3d-show-terrain\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/terrain.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/terrain.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/terrain.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Show Terrain.</strong><br /><br />Toggle displaying terrain data<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                        </div>
                        
                        <div class=\"ribbon-button ribbon-button-small ribbon-button-small ribbon-fl\" unselectable=\"on\" data-type=\"togglebutton\" data-event=\"agsattrack.showcities\" id=\"3d-show-cities\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/citybutton.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/citybutton.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/citybutton.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Show Cities.</strong><br /><br />Toggle displaying Cities<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                        </div>                                                 
                    </div>
                    <div class=\"ribbon-fl\" style=\"width:30px;\">
                        <div class=\"ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl\" unselectable=\"on\" data-type=\"togglebutton\" data-event=\"agsattrack.show3dmodels\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/3dmodels.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/3dmodels.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/3dmodels.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Show 3D Models.</strong><br /><br />Toggle displaying 3D models (Only available in globe view).<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>
                        </div>
                        <div class=\"ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl\" unselectable=\"on\" data-type=\"togglebutton\" data-event=\"agsattrack.showlighting\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/light.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/light.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/light.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Enable Lighting.</strong><br /><br />Enable Sun Lighting (Only available in globe view).<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>
                        </div>                                               
                    </div>                                                            
                </div>

                <div class=\"ribbon-section\">
                    <span class=\"section-title\">Satellite Options</span>
                    
                    <div class=\"ribbon-button ribbon-button-large\" id=\"3d-view-sat-info-locations\" data-type=\"togglebutton\" data-event=\"agsattrack.showmutuallocations\">
                        <span class=\"button-title\">Show<br/>Mutual</span> 
                        <span class=\"button-help\"><strong>Show Mutual Locations.</strong><br /><br />Show Mutual locations visible from the selected satellite.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/mutual.png\" /> 
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/mutual.png\" /> 
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/mutual.png\" />
                    </div>   
                                        
                    <div class=\"ribbon-fl\" style=\"width:30px;\">
                        <div class=\"ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl\" unselectable=\"on\" data-type=\"togglebutton\" data-event=\"agsattrack.showsatlabels\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/label.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/label.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/label.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Show Satellite Labels.</strong><br /><br />Toggle displaying the name of the satellites.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                                 </div>                    
                    </div>
                    <div class=\"ribbon-fl\" style=\"width:30px;\">
                        <div class=\"ribbon-button ribbon-button-small ribbon-fl\" unselectable=\"on\" data-type=\"togglebutton\" data-event=\"agsattrack.setfootprinttype\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/filledfootprint.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/filledfootprint.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/filledfootprint.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Show footprints as filled circles.</strong><br /><br />Toggle displaying the  footprint as a filled circle.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>
                        </div>  
                        <div class=\"ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl\" unselectable=\"on\" data-type=\"togglebutton\" data-event=\"agsattrack.setssp\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/ssp.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/ssp.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/ssp.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Show Satellite ssp.</strong><br /><br />Toggle displaying the sub satellite points for a pass.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>
                        </div>  
                    </div>
                </div>
                
                <div class=\"ribbon-section\">
                    <span class=\"section-title\">Information</span>
                    <div class=\"ribbon-button ribbon-button-large\" id=\"3d-view-sat-info-locations\" data-type=\"button\" data-event=\"agsattrack.show3dlocationinfo\" style=\"width:60px;\">
                        <span class=\"button-title\">Visible<br/>Locations</span> 
                        <span class=\"button-help\"><strong>Visible Locations.</strong><br /><br />Show locations visible from the selected satellite.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/earth.png\" /> 
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/earth.png\" /> 
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/earth.png\" />
                    </div>                    
                </div>
                
                <div class=\"ribbon-section\">
                    <span class=\"section-title\">Follow</span>
                    <div class=\"ribbon-button ribbon-button-large\" id=\"3d-follow-sat\" data-type=\"grouptogglebutton\" data-event=\"agsattrack.followsatellite\" data-group=\"follow\">
                        <span class=\"button-title\">From<br />Satellite</span> 
                        <span class=\"button-help\"><strong>Follow Satellite.</strong><br /><br />Follows the selected satellite, looking at your location.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                        <img class=\"ribbon-icon ribbon-normal\" src=\"/js/ribbon/icons/normal/orbit.png\" />
                        <img class=\"ribbon-icon ribbon-hot\" src=\"/js/ribbon/icons/hot/orbit.png\" />
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"/js/ribbon/icons/disabled/orbit.png\" />
                    </div>
                    <div class=\"ribbon-button ribbon-button-large\" id=\"3d-follow-obs\" data-type=\"grouptogglebutton\" data-event=\"agsattrack.followsatelliteobs\" data-group=\"follow\">
                        <span class=\"button-title\">From<br />Home</span> 
                        <span class=\"button-help\"><strong>Follow Satellite.</strong><br /><br />Follows the selected satellite, looking from your location. This will ONLY work when the satellite is visible.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                        <img class=\"ribbon-icon ribbon-normal\" src=\"/js/ribbon/icons/normal/follow-obs.png\" />
                        <img class=\"ribbon-icon ribbon-hot\" src=\"/js/ribbon/icons/hot/follow-obs.png\" />
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"/js/ribbon/icons/disabled/follow-obs.png\" />
                    </div>
                    <div class=\"ribbon-button ribbon-button-large\" id=\"3d-follow-view\" data-type=\"grouptogglebutton\" data-event=\"agsattrack.followsatelliteview\" data-group=\"follow\">
                        <span class=\"button-title\">Satellite<br/>View</span> 
                        <span class=\"button-help\"><strong>Satellite View.</strong><br /><br />Shows the view of the earth from the satellites perspective.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                        <img class=\"ribbon-icon ribbon-normal\" src=\"/js/ribbon/icons/normal/follow-view.png\" />
                        <img class=\"ribbon-icon ribbon-hot\" src=\"/js/ribbon/icons/hot/follow-view.png\" />
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"/js/ribbon/icons/disabled/follow-view.png\" />
                    </div>  
                </div>

                <div class=\"ribbon-section\">
                    <span class=\"section-title\">Select And Fly To Satellite</span>
                    <select class=\"easyui-combobox\" id=\"3d-sat-finder\" style=\"width:200px;\">
                    </select>                    
                </div>                
                
                <div style=\"float:right;\">
                    <a href=\"http://cesium.agi.com/\" target=\"_blank\"><img src=\"/images/cesium_logo.svg\" width=\"300\" /></a>
                    <div id=\"camera-pos\">POS</div>
                </div>
                
            </div>

            <div class=\"ribbon-tab\" id=\"passes-tab\">
                <span class=\"ribbon-title\" data-tab=\"passes\">Passes View</span>
                
                <div class=\"ribbon-section\">
                    <span class=\"section-title\">View Options</span>
                    <div class=\"ribbon-button ribbon-button-large view-reset\">
                        <span class=\"button-title\">Reset</span>
                        <span class=\"button-help\"></span> 
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/reset.png\" /> 
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/reset.png\" /> 
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/reset.png\" />
                    </div>  

                    <div class=\"ribbon-button ribbon-button-large\" id=\"passes-view-show-mutual\" data-type=\"togglebutton\" data-event=\"agsattrack.passesshowmutuallocations\">
                        <span class=\"button-title\">Show<br/>Mutual</span> 
                        <span class=\"button-help\"><strong>Show Mutual.</strong><br /><br />Adds a column to the passes grid indicating if the selected satellite is visible from your home location and the mutual observers location.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/mutual.png\" /> 
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/mutual.png\" /> 
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/mutual.png\" />
                    </div> 
                                        
                    <div style=\"width: 100px; float:left;\">
                        <table width=\"100%\">
                            <tr>
                                <td colspan=\"2\" style=\"border:1px solid #ccc\" align=\"center\">Pass Table</td>
                            </tr>
                            <tr>
                                <td width=\"50%\" style=\"border:1px solid #ccc\">
                                
                                    <div class=\"ribbon-button ribbon-button-small\" id=\"passes-bl-view-select\" data-type=\"dropdownmenu\" data-event=\"agsattrack.passesblview\">
                                        <span class=\"button-title\"><img src=\"/js/ribbon/arrow_down-16.png\"></span> 
                                        <img class=\"ribbon-icon ribbon-normal\" src=\"/images/ribbon/polar.png\" /> 
                                        <img class=\"ribbon-icon ribbon-hot\" src=\"/images/ribbon/polar.png\" /> 
                                        <img class=\"ribbon-icon ribbon-disabled\" src=\"/images/ribbon/polar.png\" />
                                        <div class=\"ribbon-menu ribbon-menu-wide ribbon-menu-closed\">
                                            <div class=\"title\">Select Bottom left View</div>
                                            <ul>
                                                <li class=\"passesbl\" data-event-param=\"3d\" data-icon=\"/images/ribbon/globe.png\"><img src=\"/images/ribbon/globe.png\"><span>3D View</span></li>
                                                <li class=\"passesbl\" data-event-param=\"polar\" data-icon=\"/images/ribbon/polar.png\"><img src=\"/images/ribbon/polar.png\"><span>Polar View</span></li>
                                                <li class=\"passesbl\" data-event-param=\"sky\" data-icon=\"/images/ribbon/sky.png\"><img src=\"/images/ribbon/sky.png\"><span>Sky View</span></li>
                                                <li class=\"passesbl\" data-event-param=\"azel\" data-icon=\"/images/ribbon/azel-16.png\"><img src=\"/images/ribbon/azel-16.png\"><span>Az/El View</span></li>
                                            </ul>
                                        </div>
                                    </div>                                
                                </td>
                                <td style=\"border:1px solid #ccc\">
                                    <div class=\"ribbon-button ribbon-button-small\" id=\"passes-br-view-select\" data-type=\"dropdownmenu\" data-event=\"agsattrack.passesbrview\">
                                        <span class=\"button-title\"><img src=\"/js/ribbon/arrow_down-16.png\"></span> 
                                        <img class=\"ribbon-icon ribbon-normal\" src=\"/images/ribbon/sky.png\" /> 
                                        <img class=\"ribbon-icon ribbon-hot\" src=\"/images/ribbon/sky.png\" /> 
                                        <img class=\"ribbon-icon ribbon-disabled\" src=\"/images/ribbon/sky.png\" />
                                        <div class=\"ribbon-menu ribbon-menu-wide ribbon-menu-closed\">
                                            <div class=\"title\">Select Bottom Right View</div>
                                            <ul>
                                                <li class=\"passesbl\" data-event-param=\"3d\" data-icon=\"/images/ribbon/globe.png\"><img src=\"/images/ribbon/globe.png\"><span>3D View</span></li>
                                                <li class=\"passesbl\" data-event-param=\"polar\" data-icon=\"/images/ribbon/polar.png\"><img src=\"/images/ribbon/polar.png\"><span>Polar View</span></li>
                                                <li class=\"passesbl\" data-event-param=\"sky\" data-icon=\"/images/ribbon/sky.png\"><img src=\"/images/ribbon/sky.png\"><span>Sky View</span></li>
                                                <li class=\"passesbl\" data-event-param=\"azel\" data-icon=\"/images/ribbon/azel-16.png\"><img src=\"/images/ribbon/azel-16.png\"><span>Az/El View</span></li>
                                            </ul>
                                        </div>
                                    </div>                                 
                                </td>
                            </tr>
                        </table>
                    </div>
                </div>
                     
                <div class=\"ribbon-section\">
                    <span class=\"section-title\">Date And Time</span>
                    <div class=\"ribbon-button ribbon-button-large ribbon-fl ribbon-button-large-active\" id=\"passes-view-24\" unselectable=\"on\" data-type=\"togglebutton\" data-event=\"agsattrack.toggle24\">
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/disabled/clock.png\" />
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/disabled/clock.png\" />
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/clock.png\" />
                        <span class=\"button-title\" unselectable=\"on\">Show Next<br/>24 Hours</span>
                    </div>                    
                    <div class=\"ribbon-button ribbon-button-large disabled\" id=\"passes-view-start\" data-type=\"dropdownmenustay\">
                        <span class=\"button-title\">Start Date <img src=\"js/ribbon/arrow_down.png\"></span> 
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/calendar.png\" /> 
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/calendar.png\" /> 
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/calendar.png\" />
                        <div class=\"ribbon-menu ribbon-menu-closed\">
                            <div class=\"title\">Select Start date</div>
                            <input class=\"easyui-datetimebox\" id=\"passes-view-start-cal\" style=\"width:150px\" data-options=\"showSeconds:false\">
                        </div>
                    </div>
                    <div class=\"ribbon-button ribbon-button-large disabled\" id=\"passes-view-end\" data-type=\"dropdownmenustay\">
                        <span class=\"button-title\">End Date <img src=\"js/ribbon/arrow_down.png\"></span> 
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/calendar.png\" /> 
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/calendar.png\" /> 
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/calendar.png\" />
                        <div class=\"ribbon-menu ribbon-menu-closed\">
                            <div class=\"title\">Select End date</div>
                            <input class=\"easyui-datetimebox\" id=\"passes-view-end-cal\" style=\"width:150px\" data-options=\"showSeconds:false\">
                        </div>
                    </div>                                     
                    <div class=\"ribbon-button ribbon-button-large disabled\" id=\"passes-view-calc\" data-type=\"button\" data-event=\"agsattrack.passescalc\">
                        <span class=\"button-title\">Find<br/>Passes</span> 
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/calc.png\" /> 
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/calc.png\" /> 
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/calc.png\" />
                    </div> 
                </div>
                                               
                <div class=\"ribbon-section\">
                    <span class=\"section-title\">Satellite</span>
                    <select id=\"passes-sat\"></select>
                </div>
                
                <div class=\"ribbon-section\" id=\"passes-available\" style=\"display: none\">
                    <span class=\"section-title\">Available Passes</span>
                    <select id=\"passes-passes\"></select>
                </div>                
                
            </div>

            <div class=\"ribbon-tab\" id=\"polar-tab\">
                <span class=\"ribbon-title\" data-tab=\"polar\">Polar View</span>
                <div class=\"ribbon-section\">
                    <span class=\"section-title\">View Options</span>
                    
                    <div class=\"ribbon-fl\">
                        <div class=\"ribbon-button ribbon-button-large view-reset\">
                            <span class=\"button-title\">Reset</span> 
                            <span class=\"button-help\"></span> 
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/reset.png\" /> 
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/reset.png\" /> 
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/reset.png\" />
                        </div>
                    </div>
                    <div class=\"ribbon-fl\" style=\"width:30px;\">
                        <div class=\"ribbon-button ribbon-button-small ribbon-fl\" unselectable=\"on\" data-type=\"togglebutton\" data-event=\"agsattrack.showplanets\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/show-planets-16.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/show-planets-16.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/show-planets-16.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Show Planets</strong><br /><br />Toggle displaying planets.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for mor information</span></span>                        
                        </div>
                    </div>                        
                                        
                 </div>                
            </div>

            <div class=\"ribbon-tab\" id=\"sky-tab\">
                <span class=\"ribbon-title\" data-tab=\"sky\">Sky View</span>
                <div class=\"ribbon-section\">
                    <span class=\"section-title\">View Options</span>

                    <div class=\"ribbon-fl\">
                        <div class=\"ribbon-button ribbon-button-large view-reset\">
                            <span class=\"button-title\">Reset</span> 
                            <span class=\"button-help\"></span> 
                            <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/reset.png\" /> 
                            <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/reset.png\" /> 
                            <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/reset.png\" />
                        </div>  
                    </div>
                    <div class=\"ribbon-fl\" style=\"width:30px;\">
                        <div class=\"ribbon-button ribbon-button-small ribbon-fl\" unselectable=\"on\" data-type=\"togglebutton\" data-event=\"agsattrack.showplanets\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/show-planets-16.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/show-planets-16.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/show-planets-16.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Show Planets</strong><br /><br />Toggle displaying planets.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for mor information</span></span>                        
                        </div>
                        <div class=\"ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl\" unselectable=\"on\" data-type=\"togglebutton\" data-event=\"agsattrack.showcity\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/show-city-16.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/show-city-16.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/show-city-16.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Show City</strong><br /><br />Toggle displaying the city.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for mor information</span></span>                        
                        </div>                        
                    </div>                                         
                 </div>                
            </div>

            <div class=\"ribbon-tab\" id=\"timeline-tab\">
                <span class=\"ribbon-title\" data-tab=\"timeline\">Timeline View</span>
                <div class=\"ribbon-section\">
                    <span class=\"section-title\">View Options</span>
                    <div class=\"ribbon-button ribbon-button-large view-reset\" unselectable=\"on\" data-type=\"button\" id=\"timline-reset\" data-event=\"agsattrack.timeline-reset\">
                        <span class=\"button-title\">Reset</span> 
                        <span class=\"button-help\"></span> 
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/reset.png\" /> 
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/reset.png\" /> 
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/reset.png\" />
                    </div>  
                    <div class=\"ribbon-button ribbon-button-large\" id=\"timeline-view-show-mutual\" data-type=\"togglebutton\" data-event=\"agsattrack.timelineviewshowmutuallocations\">
                        <span class=\"button-title\">Show<br/>Mutual</span> 
                        <span class=\"button-help\"><strong>Show Mutual.</strong><br /><br />Displays mutal visibility in the timeline view.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for more information</span></span>                        
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/mutual.png\" /> 
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/mutual.png\" /> 
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/mutual.png\" />
                    </div>
                    <div class=\"ribbon-fl\" style=\"width:30px;\">
                        <div class=\"ribbon-button ribbon-button-small ribbon-fl\" unselectable=\"on\" data-type=\"button\" id=\"timline-zoom-in\" data-event=\"agsattrack.timeline-zoom-in\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/zoom_in.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/zoom_in.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/zoom_in.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Zoom In</strong><br /><br />Zoom In.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for mor information</span></span>                        
                        </div>
                        <div class=\"ribbon-button ribbon-button-small ribbon-fl\" unselectable=\"on\" data-type=\"button\" id=\"timline-zoom-out\" data-event=\"agsattrack.timeline-zoom-out\">
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-normal\" src=\"js/ribbon/icons/normal/zoom_out.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-hot\" src=\"js/ribbon/icons/normal/zoom_out.png\" />
                            <img class=\"ribbon-icon ribbon-button-small-no-title ribbon-disabled\" src=\"js/ribbon/icons/normal/zoom_out.png\" />
                            <span class=\"button-title\" unselectable=\"on\"></span>
                            <span class=\"button-help\"><strong>Zoom Out</strong><br /><br />Zoom Out.<br /><hr><img src=\"js/ribbon/help-16.png\" class=\"ribbon-help-small\"/><span> See Help for mor information</span></span>                        
                        </div>                        
                    </div>                                                              
                 </div>                
            </div> 

            <div class=\"ribbon-tab\" id=\"dx-tab\">
                <span class=\"ribbon-title\" data-tab=\"dx\">DX View</span>
                
                                
                <div class=\"ribbon-section\">
                    <span class=\"section-title\">View Options</span>
                    <div class=\"ribbon-button ribbon-button-large view-reset\">
                        <span class=\"button-title\">Reset</span> 
                        <span class=\"button-help\"></span> 
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/reset.png\" /> 
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/reset.png\" /> 
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/reset.png\" />
                    </div>  
                 </div>              
                
            </div>
                            
            <div class=\"ribbon-tab\" id=\"debug-tab\">
                <span class=\"ribbon-title\" data-tab=\"debug\">Debug View</span>
                <div class=\"ribbon-section\">
                    <span class=\"section-title\">View Options</span>
                    <div class=\"ribbon-button ribbon-button-large view-reset\">
                        <span class=\"button-title\">Reload<br />Data
                        </span> <span class=\"button-help\"></span> 
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/reset.png\" /> 
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/reset.png\" /> 
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/reset.png\" />
                    </div>  
                 </div>
                <div class=\"ribbon-section\" style=\"min-width: 80px;\">
                    <span class=\"section-title\">Cache Options</span>
                    <div class=\"ribbon-button ribbon-button-large ribbon-fl disabled\" id=\"debug-clear-cache\" data-type=\"button\" data-event=\"agsattrack.deletesatcache\">
                        <span class=\"button-title\">Clear</span> 
                        <img class=\"ribbon-icon ribbon-normal\" src=\"js/ribbon/icons/normal/trash.png\" /> 
                        <img class=\"ribbon-icon ribbon-hot\" src=\"js/ribbon/icons/hot/trash.png\" /> 
                        <img class=\"ribbon-icon ribbon-disabled\" src=\"js/ribbon/icons/disabled/trash.png\" />
                    </div>
                 </div>                                      
            </div>
                                   
        </div>";
    }

    public function getTemplateName()
    {
        return "home/parts/north/ribbon.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  26 => 5,  24 => 4,  19 => 1,);
    }
}
/*         <div id="ribbon">*/
/*             <span class="ribbon-window-title"></span>*/
/*             <div class="ribbon-tab file" id="info-tab">*/
/*                 {% include 'home/parts/north/info/info.twig' %}*/
/*             </div>*/
/*             */
/*             <div class="ribbon-tab" id="format-tab">*/
/*                 <span class="ribbon-title">Home</span>*/
/* */
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title" data-tab="home">View</span>*/
/*                     <div class="ribbon-button ribbon-button-large" id="view-select" data-type="dropdownmenu">*/
/*                         <span class="button-title">Select <img src="js/ribbon/arrow_down.png"></span> */
/*                         <span class="button-help"><strong>Select view.</strong><br /><br />Selects the view you wish to display.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for mor information</span></span>*/
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/view.png" /> */
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/view.png" /> */
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/view.png" />*/
/*                         <div class="ribbon-menu ribbon-menu-closed">*/
/*                             <div class="title">Select View</div>*/
/*                             <ul>*/
/*                                 <li class="satview" data-options="list"><img src="images/ribbon/list.png"><span>List View</span></li>*/
/*                                 <li class="satview" data-options="passes"><img src="images/ribbon/table.png"><span>Passes View</span></li>*/
/*                                 <li class="satview" data-options="3d"><img src="images/ribbon/globe.png"><span>3D View</span></li>*/
/*                                 <li class="satview" data-options="polar"><img src="images/ribbon/polar.png"><span>Polar View</span></li>*/
/*                                 <li class="satview" data-options="sky"><img src="images/ribbon/sky.png"><span>Sky View</span></li>*/
/*                                 <li class="satview" data-options="timeline"><img src="images/ribbon/timeline.png"><span>Timeline View</span></li>*/
/*                                 <li class="satview" data-options="dx"><img src="/js/ribbon/icons/normal/dx-16.png"><span>Dx View</span></li>*/
/*                             </ul>*/
/*                         </div>*/
/*                     </div>*/
/*                     <div class="ribbon-button ribbon-button-large view-reset">*/
/*                         <span class="button-title">Reset</span>*/
/*                         <span class="button-help"><strong>Reset view.</strong><br /><br />Resets the current view to its defaults.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for mor information</span></span>                        */
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/reset.png" /> */
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/reset.png" /> */
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/reset.png" />*/
/*                     </div>*/
/*                 </div>*/
/* */
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">Satellites</span>*/
/*                     */
/*                     <div class="ribbon-fl">*/
/*                         <div class="ribbon-button ribbon-button-large" id="sat-group-selector"  data-type="dropdownmenu">*/
/*                             <span class="button-title">Groups <img src="js/ribbon/arrow_down.png"></span> */
/*                             <span class="button-help"><strong>Select Satellite Group.</strong><br /><br />Selects the group of satellites.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for mor information</span></span>                        */
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/group.png" /> */
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/group.png" /> */
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/group.png" />*/
/*                             <div class="ribbon-menu ribbon-menu-closed">*/
/*                                 <div class="title">Select Group</div>*/
/*                                 <div id="sat-group-selector-listbox"></div>*/
/*                             </div>*/
/*                         </div>*/
/*                         <div class="ribbon-button ribbon-button-large" id="sat-selector" data-type="dropdownmenustay">*/
/*                             <span class="button-title">Select <img src="js/ribbon/down.png" /></span> */
/*                             <span class="button-help"><strong>Select Satellites.</strong><br /><br />Selects the satellites to display and show orbits for.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for mor information</span></span>                        */
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/satellite.png" /> */
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/satellite.png" /> */
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/satellite.png" />*/
/*                             <div class="ribbon-menu ribbon-menu-closed">*/
/*                                 <div class="title">Select Satellite</div>*/
/*                                 <div id="ag-satselector"> </div>*/
/*                             </div>                        */
/*                         </div>*/
/*                     </div>*/
/*                     <div class="ribbon-fl">*/
/*                         <div class="ribbon-button ribbon-button-small" id="sat-display-all">*/
/*                             <span class="button-title"></span>*/
/*                             <span class="button-help"><strong>Display All Satellites.</strong><br /><br />Display all satellites in the current group.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for mor information</span></span>                        */
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/satellite_all.png" /> */
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/satellite_all.png" /> */
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/satellite_all.png" />*/
/*                         </div>*/
/*                         <div class="ribbon-button ribbon-button-small" id="sat-display-none">*/
/*                             <span class="button-title"></span> */
/*                             <span class="button-help"><strong>Remove All Satellites.</strong><br /><br />Remove all satellites from display.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for mor information</span></span>                        */
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/satellite_delete_all.png" /> */
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/satellite_delete_all.png" /> */
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/satellite_delete_all.png" />*/
/*                         </div>                     */
/*                     </div>*/
/*                     <div class="ribbon-button ribbon-button-large disabled" id="home-update-elements" data-event="agsattrack.updategroup">*/
/*                         <span class="button-title">Update <br />Elements</span>*/
/*                         <span class="button-help"><strong>Update Elements.</strong><br /><br />Update the elements for this satellite group.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/download.png" /> */
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/download.png" /> */
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/download.png" />*/
/*                     </div>                                      */
/*                 </div>*/
/* */
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">Settings</span>*/
/*                     <div style="float:left">*/
/*                         <div class="ribbon-button ribbon-button-large" id="options">*/
/*                             <span class="button-title">Options</span> */
/*                             <span class="button-help"></span> */
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/settings.png" />*/
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/settings.png" /> */
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/settings.png" />*/
/*                         </div>*/
/*                         <div class="ribbon-button ribbon-button-large" id="options" data-event="agsattrack.resetoptions">*/
/*                             <span class="button-title">Reset All<br />Options</span> */
/*                             <span class="button-help"></span> */
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/reset.png" />*/
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/reset.png" /> */
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/reset.png" />*/
/*                         </div>                        */
/*                     </div>*/
/*                     <div style="float:left">                    */
/*                         <div class="ribbon-button ribbon-button-small disabled" id="options-save" unselectable="on">*/
/*                             <span class="button-help" unselectable="on"></span>*/
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/save.png" />*/
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/save.png" />*/
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/save.png" />*/
/*                             <span class="button-title" unselectable="on">Save</span>*/
/*                         </div>*/
/*                     </div>*/
/*                 </div>*/
/* */
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">Help</span>*/
/*                     <div style="float:left">*/
/*                         <div class="ribbon-button ribbon-button-large" id="help-help">*/
/*                             <span class="button-title">Help</span> */
/*                                 <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/help.png" /> */
/*                                 <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/help.png" /> */
/*                                 <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/help.png" />*/
/*                         </div>*/
/*                     </div>*/
/*                     <div style="float:left">                    */
/*                         <div class="ribbon-button ribbon-button-small" id="help-tour" unselectable="on">*/
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/tour.png" />*/
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/tour.png" />*/
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/tour.png" />*/
/*                             <span class="button-title" unselectable="on">Tour</span>*/
/*                         </div>*/
/*                         <div class="ribbon-button ribbon-button-small" id="help-contact" unselectable="on">*/
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/email.png" />*/
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/email.png" />*/
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/email.png" />*/
/*                             <span class="button-title" unselectable="on">Contact</span>*/
/*                         </div>*/
/*                         <div class="ribbon-button ribbon-button-small disabled" id="help-forum" unselectable="on">*/
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/forum.png" />*/
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/forum.png" />*/
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/forum.png" />*/
/*                             <span class="button-title" unselectable="on">Community</span>*/
/*                         </div>                                                  */
/*                     </div>*/
/*                 </div>                                        */
/*             </div>*/
/*             */
/*             <div class="ribbon-tab" id="list-tab">*/
/*                 <span class="ribbon-title" data-tab="list">List View</span>*/
/*                 */
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">View Options</span>*/
/*                     */
/*                     <div class="ribbon-fl" unselectable="on">            */
/*                         */
/*                         <div class="ribbon-button ribbon-button-large view-reset" id="list-view-reset">*/
/*                             <span class="button-title">Reset</span> */
/*                             <span class="button-help"><strong>Reset view.</strong><br /><br />Resets the list view to its defaults.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/reset.png" /> */
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/reset.png" /> */
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/reset.png" />*/
/*                         </div>*/
/*                             */
/*                         <div class="ribbon-button ribbon-button-large" id="list-view-show-mutual" data-type="togglebutton" data-event="agsattrack.listviewshowmutuallocations">*/
/*                             <span class="button-title">Show<br/>Mutual</span> */
/*                             <span class="button-help"><strong>Show Mutual.</strong><br /><br />Adds a column to the table which indicates if the satellite is visible from both your location and the mutual observer.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/mutual.png" /> */
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/mutual.png" /> */
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/mutual.png" />*/
/*                         </div>                                                 */
/*                     </div>*/
/*                 </div>*/
/*             </div>*/
/* */
/*             <div class="ribbon-tab" id="3d-tab">*/
/*                 <span class="ribbon-title" data-tab="3d">3D View</span>*/
/*                 */
/*                 <div class="ribbon-section">                */
/* */
/*                 </div>*/
/*                                                     */
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">View Options</span>*/
/* */
/*                     <div class="ribbon-fl">*/
/* */
/*                         <div class="ribbon-button ribbon-button-large" id="3d-projection" data-type="dropdownmenu">*/
/*                             <span class="button-title">Views <img src="js/ribbon/arrow_down.png"></span> <span class="button-help"></span>*/
/*                             <span class="button-help"><strong>Select view.</strong><br /><br />Choose from 3d, 2d or 2.5d views.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/viewselect.png" /> */
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/viewselect.png" /> */
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/viewselect.png" />*/
/*                             <div class="ribbon-menu ribbon-menu-closed">*/
/*                                 <div class="title">Select View</div>*/
/*                                 <ul>*/
/*                                     <li class="3dview" data-options="twod"><img src="images/ribbon/list.png"><span>2D View</span></li>*/
/*                                     <li class="3dview" data-options="twopointfived"><img src="images/ribbon/table.png"><span>2.5D View</span></li>*/
/*                                     <li class="3dview" data-options="threed"><img src="images/ribbon/globe.png"><span>3D View</span></li>*/
/*                                 </ul>*/
/*                             </div>*/
/*                         </div>*/
/*                         */
/*                         <div class="ribbon-button ribbon-button-large" id="3d-provider" data-type="dropdownmenu" style="width:95px;">*/
/*                             <span class="button-title">Provider <img src="js/ribbon/arrow_down.png"></span> */
/*                             <span class="button-help"><strong>Map Provider.</strong><br /><br />Select the provider for the globe rendering.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>*/
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/tile.png" /> */
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/tile.png" />*/
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/tile.png" />*/
/*                             <div class="ribbon-menu ribbon-menu-closed">*/
/*                                 <div class="title">Select Provider</div>*/
/*                                 <ul>*/
/*                                     <li class="tile" data-options="staticimage"><img src="js/ribbon/icons/normal/image.png"><span>Static Image</span></li>*/
/*                                     <li class="tile" data-options="bing"><img src="js/ribbon/icons/normal/bing.png"><span>Bing maps</span></li>*/
/*                                     <li class="tile" data-options="osm"><img src="js/ribbon/icons/normal/openstreetmap.png"><span>Open StreetMap</span></li>*/
/*                                     <li class="tile" data-options="arcgis"><img src="js/ribbon/icons/normal/arcgis.png"><span>Arc Gis</span></li>*/
/* */
/*                                 </ul>*/
/*                             </div>*/
/*                         </div>                    */
/*                                             */
/*                         <div class="ribbon-button ribbon-button-large view-reset" id="3d-view-reset" style="width:60px;">*/
/*                             <span class="button-title">Reset</span> */
/*                             <span class="button-help"><strong>Reset view.</strong><br /><br />Resets the 3d view to its defaults.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/reset.png" /> */
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/reset.png" /> */
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/reset.png" />*/
/*                         </div>*/
/*                                             */
/*                     </div>*/
/*                     <div class="ribbon-fl" style="width:30px;">*/
/*                         <div class="ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl" unselectable="on" data-type="togglebutton" data-event="agsattrack.showatmosphere" id="3d-atmosphere">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/atmoshpere-16.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/atmoshpere-16.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/atmoshpere-16.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Show Atmoshpere.</strong><br /><br />Toggle displaying the atmoshpere.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for mor information</span></span>                        */
/*                         </div>*/
/*                         <div class="ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl" unselectable="on" data-type="togglebutton" data-event="agsattrack.showskybox" id="3d-skybox">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/cube.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/cube.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/cube.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Show Skybox.</strong><br /><br />Toggle displaying the skybox.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                         </div>                                             */
/*                         <div class="ribbon-button ribbon-button-small ribbon-fl" unselectable="on" data-type="togglebutton" data-event="agsattrack.showfps">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/fps.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/fps.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/fps.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Show FrameRate.</strong><br /><br />Display the frame rate.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                         </div>                                             */
/* */
/*                     </div>*/
/*                     <div class="ribbon-fl" style="width:30px;">*/
/*                         <div class="ribbon-button ribbon-button-small ribbon-fl" unselectable="on" data-type="togglebutton" data-event="agsattrack.showmousepos">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/mousepos.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/mousepos.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/mousepos.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Show Mouse Pos.</strong><br /><br />Toggle displaying the lat and lon of the mouse position.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>*/
/*                         </div>*/
/*                         */
/*                         <div class="ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl" unselectable="on" data-type="togglebutton" data-event="agsattrack.showterrain" id="3d-show-terrain">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/terrain.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/terrain.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/terrain.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Show Terrain.</strong><br /><br />Toggle displaying terrain data<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                         </div>*/
/*                         */
/*                         <div class="ribbon-button ribbon-button-small ribbon-button-small ribbon-fl" unselectable="on" data-type="togglebutton" data-event="agsattrack.showcities" id="3d-show-cities">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/citybutton.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/citybutton.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/citybutton.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Show Cities.</strong><br /><br />Toggle displaying Cities<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                         </div>                                                 */
/*                     </div>*/
/*                     <div class="ribbon-fl" style="width:30px;">*/
/*                         <div class="ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl" unselectable="on" data-type="togglebutton" data-event="agsattrack.show3dmodels">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/3dmodels.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/3dmodels.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/3dmodels.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Show 3D Models.</strong><br /><br />Toggle displaying 3D models (Only available in globe view).<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>*/
/*                         </div>*/
/*                         <div class="ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl" unselectable="on" data-type="togglebutton" data-event="agsattrack.showlighting">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/light.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/light.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/light.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Enable Lighting.</strong><br /><br />Enable Sun Lighting (Only available in globe view).<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>*/
/*                         </div>                                               */
/*                     </div>                                                            */
/*                 </div>*/
/* */
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">Satellite Options</span>*/
/*                     */
/*                     <div class="ribbon-button ribbon-button-large" id="3d-view-sat-info-locations" data-type="togglebutton" data-event="agsattrack.showmutuallocations">*/
/*                         <span class="button-title">Show<br/>Mutual</span> */
/*                         <span class="button-help"><strong>Show Mutual Locations.</strong><br /><br />Show Mutual locations visible from the selected satellite.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/mutual.png" /> */
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/mutual.png" /> */
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/mutual.png" />*/
/*                     </div>   */
/*                                         */
/*                     <div class="ribbon-fl" style="width:30px;">*/
/*                         <div class="ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl" unselectable="on" data-type="togglebutton" data-event="agsattrack.showsatlabels">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/label.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/label.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/label.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Show Satellite Labels.</strong><br /><br />Toggle displaying the name of the satellites.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                                 </div>                    */
/*                     </div>*/
/*                     <div class="ribbon-fl" style="width:30px;">*/
/*                         <div class="ribbon-button ribbon-button-small ribbon-fl" unselectable="on" data-type="togglebutton" data-event="agsattrack.setfootprinttype">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/filledfootprint.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/filledfootprint.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/filledfootprint.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Show footprints as filled circles.</strong><br /><br />Toggle displaying the  footprint as a filled circle.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>*/
/*                         </div>  */
/*                         <div class="ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl" unselectable="on" data-type="togglebutton" data-event="agsattrack.setssp">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/ssp.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/ssp.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/ssp.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Show Satellite ssp.</strong><br /><br />Toggle displaying the sub satellite points for a pass.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>*/
/*                         </div>  */
/*                     </div>*/
/*                 </div>*/
/*                 */
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">Information</span>*/
/*                     <div class="ribbon-button ribbon-button-large" id="3d-view-sat-info-locations" data-type="button" data-event="agsattrack.show3dlocationinfo" style="width:60px;">*/
/*                         <span class="button-title">Visible<br/>Locations</span> */
/*                         <span class="button-help"><strong>Visible Locations.</strong><br /><br />Show locations visible from the selected satellite.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/earth.png" /> */
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/earth.png" /> */
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/earth.png" />*/
/*                     </div>                    */
/*                 </div>*/
/*                 */
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">Follow</span>*/
/*                     <div class="ribbon-button ribbon-button-large" id="3d-follow-sat" data-type="grouptogglebutton" data-event="agsattrack.followsatellite" data-group="follow">*/
/*                         <span class="button-title">From<br />Satellite</span> */
/*                         <span class="button-help"><strong>Follow Satellite.</strong><br /><br />Follows the selected satellite, looking at your location.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                         <img class="ribbon-icon ribbon-normal" src="/js/ribbon/icons/normal/orbit.png" />*/
/*                         <img class="ribbon-icon ribbon-hot" src="/js/ribbon/icons/hot/orbit.png" />*/
/*                         <img class="ribbon-icon ribbon-disabled" src="/js/ribbon/icons/disabled/orbit.png" />*/
/*                     </div>*/
/*                     <div class="ribbon-button ribbon-button-large" id="3d-follow-obs" data-type="grouptogglebutton" data-event="agsattrack.followsatelliteobs" data-group="follow">*/
/*                         <span class="button-title">From<br />Home</span> */
/*                         <span class="button-help"><strong>Follow Satellite.</strong><br /><br />Follows the selected satellite, looking from your location. This will ONLY work when the satellite is visible.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                         <img class="ribbon-icon ribbon-normal" src="/js/ribbon/icons/normal/follow-obs.png" />*/
/*                         <img class="ribbon-icon ribbon-hot" src="/js/ribbon/icons/hot/follow-obs.png" />*/
/*                         <img class="ribbon-icon ribbon-disabled" src="/js/ribbon/icons/disabled/follow-obs.png" />*/
/*                     </div>*/
/*                     <div class="ribbon-button ribbon-button-large" id="3d-follow-view" data-type="grouptogglebutton" data-event="agsattrack.followsatelliteview" data-group="follow">*/
/*                         <span class="button-title">Satellite<br/>View</span> */
/*                         <span class="button-help"><strong>Satellite View.</strong><br /><br />Shows the view of the earth from the satellites perspective.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                         <img class="ribbon-icon ribbon-normal" src="/js/ribbon/icons/normal/follow-view.png" />*/
/*                         <img class="ribbon-icon ribbon-hot" src="/js/ribbon/icons/hot/follow-view.png" />*/
/*                         <img class="ribbon-icon ribbon-disabled" src="/js/ribbon/icons/disabled/follow-view.png" />*/
/*                     </div>  */
/*                 </div>*/
/* */
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">Select And Fly To Satellite</span>*/
/*                     <select class="easyui-combobox" id="3d-sat-finder" style="width:200px;">*/
/*                     </select>                    */
/*                 </div>                */
/*                 */
/*                 <div style="float:right;">*/
/*                     <a href="http://cesium.agi.com/" target="_blank"><img src="/images/cesium_logo.svg" width="300" /></a>*/
/*                     <div id="camera-pos">POS</div>*/
/*                 </div>*/
/*                 */
/*             </div>*/
/* */
/*             <div class="ribbon-tab" id="passes-tab">*/
/*                 <span class="ribbon-title" data-tab="passes">Passes View</span>*/
/*                 */
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">View Options</span>*/
/*                     <div class="ribbon-button ribbon-button-large view-reset">*/
/*                         <span class="button-title">Reset</span>*/
/*                         <span class="button-help"></span> */
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/reset.png" /> */
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/reset.png" /> */
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/reset.png" />*/
/*                     </div>  */
/* */
/*                     <div class="ribbon-button ribbon-button-large" id="passes-view-show-mutual" data-type="togglebutton" data-event="agsattrack.passesshowmutuallocations">*/
/*                         <span class="button-title">Show<br/>Mutual</span> */
/*                         <span class="button-help"><strong>Show Mutual.</strong><br /><br />Adds a column to the passes grid indicating if the selected satellite is visible from your home location and the mutual observers location.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/mutual.png" /> */
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/mutual.png" /> */
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/mutual.png" />*/
/*                     </div> */
/*                                         */
/*                     <div style="width: 100px; float:left;">*/
/*                         <table width="100%">*/
/*                             <tr>*/
/*                                 <td colspan="2" style="border:1px solid #ccc" align="center">Pass Table</td>*/
/*                             </tr>*/
/*                             <tr>*/
/*                                 <td width="50%" style="border:1px solid #ccc">*/
/*                                 */
/*                                     <div class="ribbon-button ribbon-button-small" id="passes-bl-view-select" data-type="dropdownmenu" data-event="agsattrack.passesblview">*/
/*                                         <span class="button-title"><img src="/js/ribbon/arrow_down-16.png"></span> */
/*                                         <img class="ribbon-icon ribbon-normal" src="/images/ribbon/polar.png" /> */
/*                                         <img class="ribbon-icon ribbon-hot" src="/images/ribbon/polar.png" /> */
/*                                         <img class="ribbon-icon ribbon-disabled" src="/images/ribbon/polar.png" />*/
/*                                         <div class="ribbon-menu ribbon-menu-wide ribbon-menu-closed">*/
/*                                             <div class="title">Select Bottom left View</div>*/
/*                                             <ul>*/
/*                                                 <li class="passesbl" data-event-param="3d" data-icon="/images/ribbon/globe.png"><img src="/images/ribbon/globe.png"><span>3D View</span></li>*/
/*                                                 <li class="passesbl" data-event-param="polar" data-icon="/images/ribbon/polar.png"><img src="/images/ribbon/polar.png"><span>Polar View</span></li>*/
/*                                                 <li class="passesbl" data-event-param="sky" data-icon="/images/ribbon/sky.png"><img src="/images/ribbon/sky.png"><span>Sky View</span></li>*/
/*                                                 <li class="passesbl" data-event-param="azel" data-icon="/images/ribbon/azel-16.png"><img src="/images/ribbon/azel-16.png"><span>Az/El View</span></li>*/
/*                                             </ul>*/
/*                                         </div>*/
/*                                     </div>                                */
/*                                 </td>*/
/*                                 <td style="border:1px solid #ccc">*/
/*                                     <div class="ribbon-button ribbon-button-small" id="passes-br-view-select" data-type="dropdownmenu" data-event="agsattrack.passesbrview">*/
/*                                         <span class="button-title"><img src="/js/ribbon/arrow_down-16.png"></span> */
/*                                         <img class="ribbon-icon ribbon-normal" src="/images/ribbon/sky.png" /> */
/*                                         <img class="ribbon-icon ribbon-hot" src="/images/ribbon/sky.png" /> */
/*                                         <img class="ribbon-icon ribbon-disabled" src="/images/ribbon/sky.png" />*/
/*                                         <div class="ribbon-menu ribbon-menu-wide ribbon-menu-closed">*/
/*                                             <div class="title">Select Bottom Right View</div>*/
/*                                             <ul>*/
/*                                                 <li class="passesbl" data-event-param="3d" data-icon="/images/ribbon/globe.png"><img src="/images/ribbon/globe.png"><span>3D View</span></li>*/
/*                                                 <li class="passesbl" data-event-param="polar" data-icon="/images/ribbon/polar.png"><img src="/images/ribbon/polar.png"><span>Polar View</span></li>*/
/*                                                 <li class="passesbl" data-event-param="sky" data-icon="/images/ribbon/sky.png"><img src="/images/ribbon/sky.png"><span>Sky View</span></li>*/
/*                                                 <li class="passesbl" data-event-param="azel" data-icon="/images/ribbon/azel-16.png"><img src="/images/ribbon/azel-16.png"><span>Az/El View</span></li>*/
/*                                             </ul>*/
/*                                         </div>*/
/*                                     </div>                                 */
/*                                 </td>*/
/*                             </tr>*/
/*                         </table>*/
/*                     </div>*/
/*                 </div>*/
/*                      */
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">Date And Time</span>*/
/*                     <div class="ribbon-button ribbon-button-large ribbon-fl ribbon-button-large-active" id="passes-view-24" unselectable="on" data-type="togglebutton" data-event="agsattrack.toggle24">*/
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/disabled/clock.png" />*/
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/disabled/clock.png" />*/
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/clock.png" />*/
/*                         <span class="button-title" unselectable="on">Show Next<br/>24 Hours</span>*/
/*                     </div>                    */
/*                     <div class="ribbon-button ribbon-button-large disabled" id="passes-view-start" data-type="dropdownmenustay">*/
/*                         <span class="button-title">Start Date <img src="js/ribbon/arrow_down.png"></span> */
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/calendar.png" /> */
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/calendar.png" /> */
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/calendar.png" />*/
/*                         <div class="ribbon-menu ribbon-menu-closed">*/
/*                             <div class="title">Select Start date</div>*/
/*                             <input class="easyui-datetimebox" id="passes-view-start-cal" style="width:150px" data-options="showSeconds:false">*/
/*                         </div>*/
/*                     </div>*/
/*                     <div class="ribbon-button ribbon-button-large disabled" id="passes-view-end" data-type="dropdownmenustay">*/
/*                         <span class="button-title">End Date <img src="js/ribbon/arrow_down.png"></span> */
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/calendar.png" /> */
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/calendar.png" /> */
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/calendar.png" />*/
/*                         <div class="ribbon-menu ribbon-menu-closed">*/
/*                             <div class="title">Select End date</div>*/
/*                             <input class="easyui-datetimebox" id="passes-view-end-cal" style="width:150px" data-options="showSeconds:false">*/
/*                         </div>*/
/*                     </div>                                     */
/*                     <div class="ribbon-button ribbon-button-large disabled" id="passes-view-calc" data-type="button" data-event="agsattrack.passescalc">*/
/*                         <span class="button-title">Find<br/>Passes</span> */
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/calc.png" /> */
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/calc.png" /> */
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/calc.png" />*/
/*                     </div> */
/*                 </div>*/
/*                                                */
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">Satellite</span>*/
/*                     <select id="passes-sat"></select>*/
/*                 </div>*/
/*                 */
/*                 <div class="ribbon-section" id="passes-available" style="display: none">*/
/*                     <span class="section-title">Available Passes</span>*/
/*                     <select id="passes-passes"></select>*/
/*                 </div>                */
/*                 */
/*             </div>*/
/* */
/*             <div class="ribbon-tab" id="polar-tab">*/
/*                 <span class="ribbon-title" data-tab="polar">Polar View</span>*/
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">View Options</span>*/
/*                     */
/*                     <div class="ribbon-fl">*/
/*                         <div class="ribbon-button ribbon-button-large view-reset">*/
/*                             <span class="button-title">Reset</span> */
/*                             <span class="button-help"></span> */
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/reset.png" /> */
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/reset.png" /> */
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/reset.png" />*/
/*                         </div>*/
/*                     </div>*/
/*                     <div class="ribbon-fl" style="width:30px;">*/
/*                         <div class="ribbon-button ribbon-button-small ribbon-fl" unselectable="on" data-type="togglebutton" data-event="agsattrack.showplanets">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/show-planets-16.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/show-planets-16.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/show-planets-16.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Show Planets</strong><br /><br />Toggle displaying planets.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for mor information</span></span>                        */
/*                         </div>*/
/*                     </div>                        */
/*                                         */
/*                  </div>                */
/*             </div>*/
/* */
/*             <div class="ribbon-tab" id="sky-tab">*/
/*                 <span class="ribbon-title" data-tab="sky">Sky View</span>*/
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">View Options</span>*/
/* */
/*                     <div class="ribbon-fl">*/
/*                         <div class="ribbon-button ribbon-button-large view-reset">*/
/*                             <span class="button-title">Reset</span> */
/*                             <span class="button-help"></span> */
/*                             <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/reset.png" /> */
/*                             <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/reset.png" /> */
/*                             <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/reset.png" />*/
/*                         </div>  */
/*                     </div>*/
/*                     <div class="ribbon-fl" style="width:30px;">*/
/*                         <div class="ribbon-button ribbon-button-small ribbon-fl" unselectable="on" data-type="togglebutton" data-event="agsattrack.showplanets">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/show-planets-16.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/show-planets-16.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/show-planets-16.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Show Planets</strong><br /><br />Toggle displaying planets.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for mor information</span></span>                        */
/*                         </div>*/
/*                         <div class="ribbon-button ribbon-button-small ribbon-button-small-active ribbon-fl" unselectable="on" data-type="togglebutton" data-event="agsattrack.showcity">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/show-city-16.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/show-city-16.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/show-city-16.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Show City</strong><br /><br />Toggle displaying the city.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for mor information</span></span>                        */
/*                         </div>                        */
/*                     </div>                                         */
/*                  </div>                */
/*             </div>*/
/* */
/*             <div class="ribbon-tab" id="timeline-tab">*/
/*                 <span class="ribbon-title" data-tab="timeline">Timeline View</span>*/
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">View Options</span>*/
/*                     <div class="ribbon-button ribbon-button-large view-reset" unselectable="on" data-type="button" id="timline-reset" data-event="agsattrack.timeline-reset">*/
/*                         <span class="button-title">Reset</span> */
/*                         <span class="button-help"></span> */
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/reset.png" /> */
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/reset.png" /> */
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/reset.png" />*/
/*                     </div>  */
/*                     <div class="ribbon-button ribbon-button-large" id="timeline-view-show-mutual" data-type="togglebutton" data-event="agsattrack.timelineviewshowmutuallocations">*/
/*                         <span class="button-title">Show<br/>Mutual</span> */
/*                         <span class="button-help"><strong>Show Mutual.</strong><br /><br />Displays mutal visibility in the timeline view.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for more information</span></span>                        */
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/mutual.png" /> */
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/mutual.png" /> */
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/mutual.png" />*/
/*                     </div>*/
/*                     <div class="ribbon-fl" style="width:30px;">*/
/*                         <div class="ribbon-button ribbon-button-small ribbon-fl" unselectable="on" data-type="button" id="timline-zoom-in" data-event="agsattrack.timeline-zoom-in">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/zoom_in.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/zoom_in.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/zoom_in.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Zoom In</strong><br /><br />Zoom In.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for mor information</span></span>                        */
/*                         </div>*/
/*                         <div class="ribbon-button ribbon-button-small ribbon-fl" unselectable="on" data-type="button" id="timline-zoom-out" data-event="agsattrack.timeline-zoom-out">*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-normal" src="js/ribbon/icons/normal/zoom_out.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-hot" src="js/ribbon/icons/normal/zoom_out.png" />*/
/*                             <img class="ribbon-icon ribbon-button-small-no-title ribbon-disabled" src="js/ribbon/icons/normal/zoom_out.png" />*/
/*                             <span class="button-title" unselectable="on"></span>*/
/*                             <span class="button-help"><strong>Zoom Out</strong><br /><br />Zoom Out.<br /><hr><img src="js/ribbon/help-16.png" class="ribbon-help-small"/><span> See Help for mor information</span></span>                        */
/*                         </div>                        */
/*                     </div>                                                              */
/*                  </div>                */
/*             </div> */
/* */
/*             <div class="ribbon-tab" id="dx-tab">*/
/*                 <span class="ribbon-title" data-tab="dx">DX View</span>*/
/*                 */
/*                                 */
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">View Options</span>*/
/*                     <div class="ribbon-button ribbon-button-large view-reset">*/
/*                         <span class="button-title">Reset</span> */
/*                         <span class="button-help"></span> */
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/reset.png" /> */
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/reset.png" /> */
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/reset.png" />*/
/*                     </div>  */
/*                  </div>              */
/*                 */
/*             </div>*/
/*                             */
/*             <div class="ribbon-tab" id="debug-tab">*/
/*                 <span class="ribbon-title" data-tab="debug">Debug View</span>*/
/*                 <div class="ribbon-section">*/
/*                     <span class="section-title">View Options</span>*/
/*                     <div class="ribbon-button ribbon-button-large view-reset">*/
/*                         <span class="button-title">Reload<br />Data*/
/*                         </span> <span class="button-help"></span> */
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/reset.png" /> */
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/reset.png" /> */
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/reset.png" />*/
/*                     </div>  */
/*                  </div>*/
/*                 <div class="ribbon-section" style="min-width: 80px;">*/
/*                     <span class="section-title">Cache Options</span>*/
/*                     <div class="ribbon-button ribbon-button-large ribbon-fl disabled" id="debug-clear-cache" data-type="button" data-event="agsattrack.deletesatcache">*/
/*                         <span class="button-title">Clear</span> */
/*                         <img class="ribbon-icon ribbon-normal" src="js/ribbon/icons/normal/trash.png" /> */
/*                         <img class="ribbon-icon ribbon-hot" src="js/ribbon/icons/hot/trash.png" /> */
/*                         <img class="ribbon-icon ribbon-disabled" src="js/ribbon/icons/disabled/trash.png" />*/
/*                     </div>*/
/*                  </div>                                      */
/*             </div>*/
/*                                    */
/*         </div>*/
