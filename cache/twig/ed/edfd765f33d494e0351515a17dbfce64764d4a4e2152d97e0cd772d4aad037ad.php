<?php

/* home/parts/center/center.twig */
class __TwigTemplate_10e8d3a309cffd0d4e4c87c26ce8e183b776e91ccac8f132de1f079fad1ef2f9 extends Twig_Template
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
        echo "        <div id=\"viewtabs\" class=\"easyui-tabs\" data-options=\"fit:true\">
            <div title=\"List\" style=\"overflow: hidden;\" id=\"list\">
                <table id=\"sat-list-grid\"></table>
            </div>
            <div title=\"3D View\" id=\"3d\"></div>
            <div title=\"Passes\" style=\"overflow: hidden\" id=\"passes\">
                
                <div id=\"pass-info-geostationary\" class=\"hidden\">
                    <h1>The selected satellite is Geostationary</h1>
                    <p>A geostationary orbit, or Geostationary Earth Orbit (GEO), is a circular orbit 35,786 kilometres (22,236 mi) above the Earth's equator and following the direction of the Earth's rotation. An object in such an orbit has an orbital period equal to the Earth's rotational period (one sidereal day), and thus appears motionless, at a fixed position in the sky, to ground observers. Communications satellites and weather satellites are often given geostationary orbits, so that the satellite antennas that communicate with them do not have to move to track them, but can be pointed permanently at the position in the sky where they stay.</p>
                    <img src=\"/images/orbits.png \"/>
                </div>

                <table width=\"98%\" height=\"100%\" id=\"pass-info-table\">
                    <tr>
                        <td height=\"50%\" width=\"100%\" colspan=\"2\" valign=\"top\">                    
                            <table id=\"passesgrid\" class=\"easyui-datagrid\" title=\"Passes\" data-options=\"rownumbers:true, singleSelect:true, autoRowHeight:false, pagination:true, pageSize:20\">
                                <thead>
                                    <tr>
                                        <th field=\"date\" width=\"170\">Date</th>
                                        <th field=\"az\" width=\"70\">Azimuth</th>
                                        <th field=\"el\" width=\"70\">Elevation</th>
                                        <th field=\"viz\" width=\"70\">Visibility</th>
                                        <th field=\"range\" width=\"60\" align=\"right\">Range</th>
                                        <th field=\"footprint\" width=\"60\" align=\"right\">Footprint</th>
                                        <th field=\"doppler\" width=\"105\" align=\"right\">Doppler Shift (Hz)</th>
                                        <th field=\"loss\" width=\"105\" align=\"right\">Signal Loss (dB)</th>
                                        <th field=\"delay\" width=\"105\" align=\"right\">Signal Delay (ms)</th>
                                        <th field=\"mv\" width=\"105\" align=\"right\">Mutual Visible</th>
                                    </tr>
                                </thead>
                            </table>                        
                        </td>
                    </tr>
                    <tr>
                        <td height=\"50%\" width=\"50%\" class=\"backblack\"><div id=\"passbottomleft\"></div></td>
                        <td height=\"50\" width=\"50%\" class=\"backblack\"><div id=\"passbottomright\"></div></td>
                    </tr>                    
                </table>




            </div>
            <div title=\"Polar View\" id=\"polar\" style=\"overflow: hidden;\"></div>
            <div title=\"Sky View\" id=\"sky\" style=\"overflow: hidden;\"></div>
            
            <div title=\"Timeline View\" id=\"timeline\" style=\"overflow: hidden;\">
                <div id=\"timelinelegend\" style=\"float: left;width:200px\"></div>                
                <div id=\"timelineview\" style=\"float: left;overflow: auto;\"></div>                
            </div>            
            
            <div title=\"Settings\" width=1000 height=600 id=\"options\">
                <div id=\"window-preferences-tabs\" class=\"easyui-tabs\" data-options=\"fit:true\">
                    <div title=\"General\" data-options=\"\" style=\"padding: 20px;\">
                        <div class=\"icon32\" id=\"icon-options-general\"><br></div>
                        <h2>General Options</h2>
                        
                        <h3>Debugging</h3>
                        <table class=\"form-table\">
                            <tr valign=\"top\">
                                <th>Enable Debug View</th>
                                <td>
                                    <input type=\"checkbox\" id=\"debugger-show\" value=\"on\" class=\"options-cb\">
                                    <p class=\"description\"><strong>NOTE:</strong> This is only intended for developers to examine internal data from the SPM engines.</p>
                                </td>
                            </tr>                          
                        </table>
                                                
                    </div>
                    
                    <div title=\"Observer\" data-options=\"\" style=\"padding: 20px;\">
                    
                    
                        <div class=\"icon32\" id=\"icon-options-general\"><br></div>
                        <h2>Observer Options</h2>
                        
                        <h3>Home Location</h3>
                        <table class=\"form-table\">
                            <tr valign=\"top\">
                                <th>Use Browser To Find Location</th>
                                <td>
                                    <input type=\"checkbox\" id=\"observergelocate\" value=\"on\">
                                    <p class=\"description\">Selecting this option will attempt to use the browsers inbuilt Geo Location. If you do not select this option you can manually specify your location below.</p>
                                </td>
                            </tr>                          
                            <tr valign=\"top\">
                                <th>Location name</th>
                                <td>
                                    <input size=15 id=\"observername\" class=\"observerhome\">
                                    <button type=\"submit\" id=\"geoshow\"><img src=\"/images/geo.png\" width=16> Select On Map</button>
                                </td>
                            </tr>
                            <tr valign=\"top\">
                                <th>Location Latitude</th>
                                <td>
                                    <input size=20 id=\"observerlatitude\" class=\"observerhome\">
                                </td>
                            </tr>
                            <tr valign=\"top\">
                                <th>Location Longitude</th>
                                <td>
                                    <input size=20 id=\"observerlongitude\" class=\"observerhome\">
                                </td>
                            </tr>
                            <tr valign=\"top\">
                                <th>Location Altitude</th>
                                <td>
                                    <input size=10 id=\"observeraltitude\" class=\"observerhome\">
                                </td>
                            </tr>                                                       
                        </table>
                        
                        <h3>Mutual Location</h3>
                        <table class=\"form-table\">
                            <tr valign=\"top\">
                                <th>Enable Mutual Observer</th>
                                <td>
                                    <input type=\"checkbox\" id=\"mutualobserver\" value=\"on\">
                                    <p class=\"description\">Selecting this option will enable certain features allowing indicating when a satellite is visible to both your location ansd a mutual observers location.</p>
                                </td>
                            </tr>    
                            <tr valign=\"top\">
                                <th>Location name</th>
                                <td>
                                    <input size=15 id=\"mutualobservername\" class=\"observerhome\">
                                    <button type=\"submit\" id=\"mutualgeoshow\"><img src=\"/images/geo.png\" width=16> Select On Map</button>
                                </td>
                            </tr>
                            <tr valign=\"top\">
                                <th>Location Latitude</th>
                                <td>
                                    <input size=20 id=\"mutualobserverlatitude\" class=\"observerhome\">
                                </td>
                            </tr>
                            <tr valign=\"top\">
                                <th>Location Longitude</th>
                                <td>
                                    <input size=20 id=\"mutualobserverlongitude\" class=\"observerhome\">
                                </td>
                            </tr>
                            <tr valign=\"top\">
                                <th>Location Altitude</th>
                                <td>
                                    <input size=10 id=\"mutualobserveraltitude\" class=\"observerhome\">
                                </td>
                            </tr>                                                       
                        </table>
                                                                    
                    </div>
                    <div title=\"Satellites\" data-options=\"\" style=\"padding: 20px;\">
                        <div class=\"icon32\" id=\"icon-options-general\"><br></div>
                        <h2>Satellite Options</h2>
                        
                        <h3>Position Calculations</h3>
                        <table class=\"form-table\">
                            <tr valign=\"top\">
                                <th>Calculate Every (Seconds)</th>
                                <td>
                                    <input id=\"window-preferences-calc-timer\" class=\"easyui-numberspinner\" style=\"width: 60px;\" required=\"required\" data-options=\"min:1,max:50,editable:false\">
                                    <p class=\"description\">If you have a slower PC then try increasing this value to improve performance.</p>
                                    </td>
                            </tr>
                            <tr valign=\"top\">
                                <th>AoS When Above (In Degrees)</th>
                                <td>
                                    <input id=\"window-preferences-aos\" class=\"easyui-numberspinner\" style=\"width: 60px;\" required=\"required\" data-options=\"min:-10,max:100,editable:false\">
                                </td>
                            </tr>
                        </table>
                        
                        <h3>Satellite Groups</h3>
                        <table class=\"form-table\">
                            <tr valign=\"top\">
                                <th>Default TLE Group</th>
                                <td>
                                    <select id=\"options-sat-group-selector-listbox\"></select>
                                    <p class=\"description\">Select the satellite group to load at startup.</p>
                                </td>
                            </tr>                          
                            <tr valign=\"top\">
                                <th>Auto Add From TLE Group</th>
                                <td>
                                    <input type=\"checkbox\" id=\"sats-autoadd\" value=\"on\">
                                    <p class=\"description\">Automatically add all of the satellites in a group when its selected. <strong>NOTE:</strong> This will also add all of the satellites from the default group when the page is loaded.</p>
                                </td>
                            </tr>                          
                        </table>
                    </div>
                    
                    <div title=\"Views\" data-options=\"\" style=\"padding: 0px;\">
                        <div id=\"window-preferences-tabs-views\" class=\"easyui-tabs\" data-options=\"fit:true\">
                            <div title=\"Polar View\" data-options=\"\" style=\"padding: 5px;\">
                                <div class=\"icon32\" id=\"icon-options-general\"><br></div>
                                <h2>Polar View Options</h2>
                                
                                <table width=\"100%\">
                                    <tr>
                                        <td rowspan=\"2\" width=\"50%\" valign=\"top\">
                                            <h3>View Colours</h3>
                                            <table width=\"100%\">
                                                <tr>
                                                    <th width=\"50%\">Background Colour</th>
                                                    <td width=\"50%\"><input class=\"jscolor polarcolour\" id=\"polar-background-color\" type=\"text\" value=\"\" /></td>
                                                </tr>
                                                <tr>
                                                    <th width=\"50%\">Border Colour</th>
                                                    <td width=\"50%\"><input class=\"jscolor polarcolour\" id=\"polar-border-color\" type=\"text\" value=\"\" /></td>
                                                </tr>                                                
                                                <tr>
                                                    <th width=\"50%\">Gradient Start</th>
                                                    <td width=\"50%\"><input class=\"jscolor polarcolour\" id=\"polar-gradient-start\" type=\"text\" value=\"\" /></td>
                                                </tr>
                                                <tr>
                                                    <th width=\"50%\">Gradient End</th>
                                                    <td width=\"50%\"><input class=\"jscolor polarcolour\" id=\"polar-gradient-end\" type=\"text\" value=\"\" /></td>
                                                </tr>
                                                <tr>
                                                    <th width=\"50%\">Grid Colour</th>
                                                    <td width=\"50%\"><input class=\"jscolor polarcolour\" id=\"polar-grid\" type=\"text\" value=\"\" /></td>
                                                </tr>
                                                <tr>
                                                    <th width=\"50%\">Text Colour</th>
                                                    <td width=\"50%\"><input class=\"jscolor polarcolour\" id=\"polar-text\" type=\"text\" value=\"\" /></td>
                                                </tr>
                                                <tr>
                                                    <th width=\"50%\">Degree Text Colour</th>
                                                    <td width=\"50%\"><input class=\"jscolor polarcolour\" id=\"polar-degrees-text\" type=\"text\" value=\"\" /></td>
                                                </tr>
                                                <tr>
                                                    <th width=\"50%\">Reset Colours To Defaults</th>
                                                    <td width=\"50%\"><button id=\"polar-reset-colours\">Default</button></td>
                                                </tr>                                                  
                                            </table>

                                        </td>
                                        <td width=\"50%\">
                                            <div id=\"polar-preview\" style=\"width:400px; height:400px\"></div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                    </tr>
                                </table>
                                
                            </div>
                            <div title=\"Passes View\" data-options=\"\" style=\"padding: 5px;\">
                                <div class=\"icon32\" id=\"icon-options-general\"><br></div>
                                <h2>Passes View Options</h2>
                                <h3>Default views</h3>
                                <p>The passes view has two views that can be set by default. Select the default views to be shown below. The views can be altered on the passes ribbon tab. <strong>NOTE:</strong> You will need to refresh the page for these settinsg to take effect.</p>
                                <table class=\"form-table\">
                                    <tr valign=\"top\">
                                        <th>Bottom Left View</th>
                                        <td>
                                            <select class=\"options-cb\" id=\"options-passes-view-bottomleft\">
                                                <option value=\"3d\">3D View</option>
                                                <option value=\"polar\">Polar View</option>
                                                <option value=\"sky\">Sky View</option>
                                                <option value=\"azel\">Az/El View</option>
                                            </select>
                                        </td>
                                    </tr>                          
                                    <tr valign=\"top\">
                                        <th>Bottom Right View</th>
                                        <td>
                                            <select class=\"options-cb\" id=\"options-passes-view-bottomright\">
                                                <option value=\"3d\">3D View</option>
                                                <option value=\"polar\">Polar View</option>
                                                <option value=\"sky\">Sky View</option>
                                                <option value=\"azel\">Az/El View</option>                                               
                                            </select>
                                        </td>
                                    </tr>                          
                                </table>                                
                            </div>
                            <div title=\"3D View\" data-options=\"\" style=\"padding: 5px;\">
                                <div class=\"icon32\" id=\"icon-options-general\"><br></div>
                                <h2>3D View Options</h2>
                                <h3>Static Map Image</h3>
                                <table class=\"form-table\">
                                    <tr valign=\"top\">
                                        <th>Static Map Image
                                        </th>
                                        <td>
                                            <select class=\"options-cb\" id=\"options-3d-view-staticimage\">
                                                <option value=\"land_ocean_ice_lights_2048.jpg\">Land Ocean Ice Lights 2048</option>
                                                <option value=\"land_ocean_ice_lights_512.jpg\">Land Ocean Ice Lights 512</option>
                                                <option value=\"NE2_50M_SR_W_2048.jpg\">NE2 50M SR W 2048</option>
                                                <option value=\"NE2_50M_SR_W_4096.jpg\">NE2 50M SR W 4096</option>
                                            </select>
                                            <p class=\"description\">Select the static map image to use in the 3D view.</p>

                                        </td>
                                        <td>
                                            <img src=\"\" id=\"options-3d-view-staticimage-image\" width=\"200\">
                                        </td>
                                    </tr>                                                    
                                </table>
                                
                                <h3>Views and providers</h3>
                                <table class=\"form-table\">
                                    <tr valign=\"top\">
                                        <th>Default View</th>
                                        <td>
                                            <select class=\"options-cb\" id=\"options-3d-view\">
                                                <option value=\"threed\">3D View</option>
                                                <option value=\"twod\">2D View</option>
                                                <option value=\"twopointfived\">2.5D View</option>
                                            </select>                                            
                                        </td>
                                        <th>Default Provider</th>
                                        <td>
                                            <select class=\"options-cb\" id=\"options-3d-provider\">
                                                <option value=\"staticimage\">Static Image</option>
                                                <option value=\"bing\">Bing Maps</option>
                                                <option value=\"osm\">Open Street Map</option>
                                                <option value=\"arcgis\">Arc Gis</option>
                                            </select>                                            
                                        </td>                                        
                                    </tr>
                                    <tr valign=\"top\">
                                        <th>Use Terrain Provider</th>
                                        <td>
                                            <input type=\"checkbox\" id=\"options-3d-terrainprovider\" value=\"on\" class=\"options-cb\">
                                            <p class=\"description\">The Terrain Provider will show elevation data on the 3D view.</p>
                                        </td>
                                        <th></th>
                                        <td></td>                                        
                                    </tr>
                                </table>                                
                                
                                
                                <h3>Satellites</h3>
                                <table class=\"form-table\">
                                    <tr valign=\"top\">
                                        <th width=\"30%\" colspan=\"2\"><strong>Unselected</strong></th>
                                        <th colspan=\"1\">Selected</th>
                                    </tr>
                                    <tr valign=\"top\">
                                        <th>Icon</th>
                                        <td>
                                            <select class=\"options-cb\" id=\"options-3d-sat-icon-unselected\">
                                                <option value=\"1\" data-imagesrc=\"/images/satellites/satellite0-32.png\">Icon 1</option>
                                                <option value=\"2\" data-imagesrc=\"/images/satellites/satellite1-32.png\">Icon 2</option>
                                            </select>                                            
                                        </td>
                                        <td>
                                            <select class=\"options-cb\" id=\"options-3d-sat-icon-selected\">
                                                <option value=\"1\" data-imagesrc=\"/images/satellites/satellite0-32.png\">Icon 1</option>
                                                <option value=\"2\" data-imagesrc=\"/images/satellites/satellite1-32.png\">Icon 2</option>
                                            </select>                                            
                                        </td>
                                    </tr>
                                    <tr valign=\"top\">
                                        <th>Icon Size</th>
                                        <td>
                                            <select class=\"options-cb\" id=\"options-3d-sat-icon-unselected-size\">
                                                <option value=\"16\">16 Pixels</option>
                                                <option value=\"24\">24 Pixels</option>
                                                <option value=\"32\">32 Pixels</option>
                                                <option value=\"64\">64 Pixels</option>
                                                <option value=\"128\">128 Pixels</option>
                                                <option value=\"256\">256 Pixels</option>
                                            </select>                                          
                                        </td>
                                        <td>
                                            <select class=\"options-cb\" id=\"options-3d-sat-icon-selected-size\">
                                                <option value=\"16\">16 Pixels</option>
                                                <option value=\"24\">24 Pixels</option>
                                                <option value=\"32\">32 Pixels</option>
                                                <option value=\"64\">64 Pixels</option>
                                                <option value=\"128\">128 Pixels</option>
                                                <option value=\"256\">256 Pixels</option>
                                            </select>                                          
                                        </td>
                                    </tr>
                                    <tr valign=\"top\">
                                        <th>Label Size</th>
                                        <td>
                                            <select class=\"options-cb\" id=\"options-3d-sat-label-unselected-size\">
                                                <option value=\"8\">8 Pixels</option>
                                                <option value=\"10\">10 Pixels</option>
                                                <option value=\"12\">12 Pixels</option>
                                                <option value=\"14\">14 Pixels</option>
                                                <option value=\"16\">16 Pixels</option>
                                                <option value=\"18\">18 Pixels</option>
                                                <option value=\"20\">20 Pixels</option>
                                                <option value=\"22\">22 Pixels</option>
                                                <option value=\"24\">24 Pixels</option>
                                            </select>                                          
                                        </td>
                                        <td>
                                            <select class=\"options-cb\" id=\"options-3d-sat-label-selected-size\">
                                                <option value=\"8\">8 Pixels</option>
                                                <option value=\"10\">10 Pixels</option>
                                                <option value=\"12\">12 Pixels</option>
                                                <option value=\"14\">14 Pixels</option>
                                                <option value=\"16\">16 Pixels</option>
                                                <option value=\"18\">18 Pixels</option>
                                                <option value=\"20\">20 Pixels</option>
                                                <option value=\"22\">22 Pixels</option>
                                                <option value=\"24\">24 Pixels</option>
                                            </select>                                         
                                        </td>
                                    </tr>
                                    <tr valign=\"top\">
                                        <th>Label Colour</th>
                                        <td><input class=\"jscolor polarcolour\" id=\"3d-label-colour-unselected\" type=\"text\" value=\"\" /></td>
                                        <td><input class=\"jscolor polarcolour\" id=\"3d-label-colour-selected\" type=\"text\" value=\"\" /></td>
                                    </tr>
                                </table>  
                                
                                
                                
                                                              
                                <h3>Following Options</h3>
                                <table class=\"form-table\">
                                    <tr valign=\"top\">
                                        <th>Height Above Observer Location</th>
                                        <td>
                                            <input id=\"options-3d-view-followobs-height\" class=\"easyui-numberspinner\" style=\"width: 60px;\" required=\"required\" data-options=\"min:0,max:1000,editable:false\" value=\"1\">                                        
                                            <p class=\"description\">Select the height above the observer location, this is in meters.</p>
                                        </td>
                                        <th>Height Above Satellite</th>
                                        <td>
                                            <input id=\"options-3d-view-followsat-height\" class=\"easyui-numberspinner\" style=\"width: 60px;\" required=\"required\" data-options=\"min:0,max:10000,editable:false\">                                        
                                            <p class=\"description\">Select the height above the satellite location, this is in meters.</p>
                                        </td>                                        
                                    </tr>
                                </table>
                                
                                <h3>Cities</h3>
                                <table class=\"form-table\">
                                    <tr valign=\"top\">
                                        <th>Show Cities</th>
                                        <td>
                                            <input id=\"options-3d-view-show-cities\" type=\"checkbox\" class=\"options-cb\" value=\"on\">                                      
                                            <p class=\"description\">Enable this option to show cities on the 3d view.</p>
                                        </td>
                                        <th>Font Size</th>
                                        <td>
                                            <input id=\"options-3d-view-city-font-size\" type=\"text\" size=\"3\" class=\"options-spinner\"> px                                      
                                            <p class=\"description\">The font size for the city labels in pixels</p>
                                        </td>                                        
                                    </tr>
                                    <tr valign=\"top\">
                                        <th>Population Limit</th>
                                        <td>
                                            <input id=\"options-3d-view-city-pop-limit\" class=\"easyui-numberspinner\" style=\"width: 30px;\" required=\"required\" data-options=\"min:0,max:10,increment:0.1,editable:true\"> Million                                      
                                            <p class=\"description\">Cities will only be displayed if their population is above or equal to this limit.</p>
                                        </td>
                                        <th>Label Colour</th>
                                        <td>
                                            <input id=\"options-3d-view-city-font-colour\" type=\"text\" class=\"jscolor\">                                      
                                            <p class=\"description\">The label colour</p>
                                        </td>                                         
                                    </tr>                                                                                         
                                </table>
                                
                                                                                                                         
                            </div>                            
                        </div>
                    </div>                    
                    
                </div>
            </div>
            
            <div title=\"Debug View\" width=1000 height=600 id=\"debug\">   
                <table id=\"debuggrid\" class=\"easyui-treegrid\" style=\"width:600px;height:400px\"  
                        data-options=\"idField:'id',treeField:'satellite',title:'Satellite Data',fit:true\">  
                    <thead>  
                        <tr>  
                            <th data-options=\"field:'satellite',width:250\">Satellite</th>  
                            <th data-options=\"field:'orbits',width:60,align:'right'\">Orbits</th>  
                            <th data-options=\"field:'orbitno',width:80\">Orbit Number</th>  
                            <th data-options=\"field:'aos',width:120\">AoS</th>  
                            <th data-options=\"field:'los',width:120\">LoS</th>  
                            <th data-options=\"field:'points',width:80\">Points</th>  
                            <th data-options=\"field:'calctime',width:110\">Calc Time (ms)</th>  
                        </tr>  
                    </thead>  
                </table>                      
            </div>    
            
            <div title=\"Home View\" id=\"home\">   
                <div><img src=\"/images/logo-128-noborder.png\" class=\"vertical\" /><span class=\"heading\">Welcome to AGSatTrack - Online</span></div>
                
                <h2>Basic Concepts</h2>
                <p><strong>Your Location.</strong> When first started the browser will ask you if the site is allowed to use your location. if you answer yes then the browser will attempt to determine your approximate location. <strong>note</strong> this is not generally that accurate. Under options->observer you can select your exact location.</p>
                <p><strong>Satellites</strong> are loaded from groups, these match the standard groups available on sites like celestrak. A default group is loaded at startup, unless you have changed this the 'amateur' group is loaded. To load a group select the 'Groups' dropdown from the Home ribbon menu. You can also specify the default group to load in the options, under satellites.</p>
                <p>Once a group is loaded you need to add satellites to display. When a satellite is displayed its data is calculated. Those satellites not being displayed will not have any data calculated for them. By default all satellites in the loaded group are automatically added. You can disable this in Options->satellites.</p>
                <p>Satellites can be 'selected', this can be done from the list viewe, Satellite Selector or generally by clicking on a satellite in any view. Once a satellite is selected more data will be displayed, generally its orbit and passes. The Satellite info pannel on the left will also show more information. If multiple satellites are selected then a drop down will appear allowing you to select the satellite to show more detailed information for.</p>
                <h2>Views</h2>
                <p>There are 7 main views available.</p>
                <ul>
                    <li><strong>List View.</strong> This is a basic list of all satellites loaded and is updated to reflect current data. For large groups of satellites the list is paged. The page size can be set at the botom of the view.</li>
                    <li><strong>3D View.</strong> This is a rotatable, zoomable view of the earth. satellites will be displayed, along with their orbits of there are selected. if the current orbit has a pass over your location this will be shown in green on the orbit path. The imagry for the earth can be selected in the 'provider' drop down. You can follow a selected satellite either from your location or from the satellite. The 'View' option also allows for a 2D and 2.5D view.</li>
                    <li><strong>Passes View.</strong> This view displays pass information for a satellite. The satellite and pass can be selected in the ribbon menu. The two bottom views can be selected in the ribbon menu. the default for these two views can be specified in the options.</li>
                    <li><strong>Polar View.</strong> This displays a Polar, or radar, view.</li>
                    <li><strong>Sky View.</strong> This displays a view looking South from your location. This can be handy for visual satellite observation. The horizon image can be dragged up and down if its in the way or turned off in the ribbon menu.</li>
                    <li><strong>Timeline View.</strong> This will show all passes for the selectedd satellites within the next 24 hours.</li>
                    <li><strong>Az/El View.</strong> This is <strong>only</strong> available in the passes view. It shows a graph of Azimuth and elevation for a selected pass.</li>
                </ul>
                <h4>Debug View</h4>
                <p>This must be enabled in the options. This view is primarily intended to debug issues. It shows all of the available satellites along with information about the internal calculation engine.</p>
            </div>
            
            <div title=\"DX View\" id=\"dx\">
            </div>                                  
            
        </div>";
    }

    public function getTemplateName()
    {
        return "home/parts/center/center.twig";
    }

    public function getDebugInfo()
    {
        return array (  19 => 1,);
    }
}
/*         <div id="viewtabs" class="easyui-tabs" data-options="fit:true">*/
/*             <div title="List" style="overflow: hidden;" id="list">*/
/*                 <table id="sat-list-grid"></table>*/
/*             </div>*/
/*             <div title="3D View" id="3d"></div>*/
/*             <div title="Passes" style="overflow: hidden" id="passes">*/
/*                 */
/*                 <div id="pass-info-geostationary" class="hidden">*/
/*                     <h1>The selected satellite is Geostationary</h1>*/
/*                     <p>A geostationary orbit, or Geostationary Earth Orbit (GEO), is a circular orbit 35,786 kilometres (22,236 mi) above the Earth's equator and following the direction of the Earth's rotation. An object in such an orbit has an orbital period equal to the Earth's rotational period (one sidereal day), and thus appears motionless, at a fixed position in the sky, to ground observers. Communications satellites and weather satellites are often given geostationary orbits, so that the satellite antennas that communicate with them do not have to move to track them, but can be pointed permanently at the position in the sky where they stay.</p>*/
/*                     <img src="/images/orbits.png "/>*/
/*                 </div>*/
/* */
/*                 <table width="98%" height="100%" id="pass-info-table">*/
/*                     <tr>*/
/*                         <td height="50%" width="100%" colspan="2" valign="top">                    */
/*                             <table id="passesgrid" class="easyui-datagrid" title="Passes" data-options="rownumbers:true, singleSelect:true, autoRowHeight:false, pagination:true, pageSize:20">*/
/*                                 <thead>*/
/*                                     <tr>*/
/*                                         <th field="date" width="170">Date</th>*/
/*                                         <th field="az" width="70">Azimuth</th>*/
/*                                         <th field="el" width="70">Elevation</th>*/
/*                                         <th field="viz" width="70">Visibility</th>*/
/*                                         <th field="range" width="60" align="right">Range</th>*/
/*                                         <th field="footprint" width="60" align="right">Footprint</th>*/
/*                                         <th field="doppler" width="105" align="right">Doppler Shift (Hz)</th>*/
/*                                         <th field="loss" width="105" align="right">Signal Loss (dB)</th>*/
/*                                         <th field="delay" width="105" align="right">Signal Delay (ms)</th>*/
/*                                         <th field="mv" width="105" align="right">Mutual Visible</th>*/
/*                                     </tr>*/
/*                                 </thead>*/
/*                             </table>                        */
/*                         </td>*/
/*                     </tr>*/
/*                     <tr>*/
/*                         <td height="50%" width="50%" class="backblack"><div id="passbottomleft"></div></td>*/
/*                         <td height="50" width="50%" class="backblack"><div id="passbottomright"></div></td>*/
/*                     </tr>                    */
/*                 </table>*/
/* */
/* */
/* */
/* */
/*             </div>*/
/*             <div title="Polar View" id="polar" style="overflow: hidden;"></div>*/
/*             <div title="Sky View" id="sky" style="overflow: hidden;"></div>*/
/*             */
/*             <div title="Timeline View" id="timeline" style="overflow: hidden;">*/
/*                 <div id="timelinelegend" style="float: left;width:200px"></div>                */
/*                 <div id="timelineview" style="float: left;overflow: auto;"></div>                */
/*             </div>            */
/*             */
/*             <div title="Settings" width=1000 height=600 id="options">*/
/*                 <div id="window-preferences-tabs" class="easyui-tabs" data-options="fit:true">*/
/*                     <div title="General" data-options="" style="padding: 20px;">*/
/*                         <div class="icon32" id="icon-options-general"><br></div>*/
/*                         <h2>General Options</h2>*/
/*                         */
/*                         <h3>Debugging</h3>*/
/*                         <table class="form-table">*/
/*                             <tr valign="top">*/
/*                                 <th>Enable Debug View</th>*/
/*                                 <td>*/
/*                                     <input type="checkbox" id="debugger-show" value="on" class="options-cb">*/
/*                                     <p class="description"><strong>NOTE:</strong> This is only intended for developers to examine internal data from the SPM engines.</p>*/
/*                                 </td>*/
/*                             </tr>                          */
/*                         </table>*/
/*                                                 */
/*                     </div>*/
/*                     */
/*                     <div title="Observer" data-options="" style="padding: 20px;">*/
/*                     */
/*                     */
/*                         <div class="icon32" id="icon-options-general"><br></div>*/
/*                         <h2>Observer Options</h2>*/
/*                         */
/*                         <h3>Home Location</h3>*/
/*                         <table class="form-table">*/
/*                             <tr valign="top">*/
/*                                 <th>Use Browser To Find Location</th>*/
/*                                 <td>*/
/*                                     <input type="checkbox" id="observergelocate" value="on">*/
/*                                     <p class="description">Selecting this option will attempt to use the browsers inbuilt Geo Location. If you do not select this option you can manually specify your location below.</p>*/
/*                                 </td>*/
/*                             </tr>                          */
/*                             <tr valign="top">*/
/*                                 <th>Location name</th>*/
/*                                 <td>*/
/*                                     <input size=15 id="observername" class="observerhome">*/
/*                                     <button type="submit" id="geoshow"><img src="/images/geo.png" width=16> Select On Map</button>*/
/*                                 </td>*/
/*                             </tr>*/
/*                             <tr valign="top">*/
/*                                 <th>Location Latitude</th>*/
/*                                 <td>*/
/*                                     <input size=20 id="observerlatitude" class="observerhome">*/
/*                                 </td>*/
/*                             </tr>*/
/*                             <tr valign="top">*/
/*                                 <th>Location Longitude</th>*/
/*                                 <td>*/
/*                                     <input size=20 id="observerlongitude" class="observerhome">*/
/*                                 </td>*/
/*                             </tr>*/
/*                             <tr valign="top">*/
/*                                 <th>Location Altitude</th>*/
/*                                 <td>*/
/*                                     <input size=10 id="observeraltitude" class="observerhome">*/
/*                                 </td>*/
/*                             </tr>                                                       */
/*                         </table>*/
/*                         */
/*                         <h3>Mutual Location</h3>*/
/*                         <table class="form-table">*/
/*                             <tr valign="top">*/
/*                                 <th>Enable Mutual Observer</th>*/
/*                                 <td>*/
/*                                     <input type="checkbox" id="mutualobserver" value="on">*/
/*                                     <p class="description">Selecting this option will enable certain features allowing indicating when a satellite is visible to both your location ansd a mutual observers location.</p>*/
/*                                 </td>*/
/*                             </tr>    */
/*                             <tr valign="top">*/
/*                                 <th>Location name</th>*/
/*                                 <td>*/
/*                                     <input size=15 id="mutualobservername" class="observerhome">*/
/*                                     <button type="submit" id="mutualgeoshow"><img src="/images/geo.png" width=16> Select On Map</button>*/
/*                                 </td>*/
/*                             </tr>*/
/*                             <tr valign="top">*/
/*                                 <th>Location Latitude</th>*/
/*                                 <td>*/
/*                                     <input size=20 id="mutualobserverlatitude" class="observerhome">*/
/*                                 </td>*/
/*                             </tr>*/
/*                             <tr valign="top">*/
/*                                 <th>Location Longitude</th>*/
/*                                 <td>*/
/*                                     <input size=20 id="mutualobserverlongitude" class="observerhome">*/
/*                                 </td>*/
/*                             </tr>*/
/*                             <tr valign="top">*/
/*                                 <th>Location Altitude</th>*/
/*                                 <td>*/
/*                                     <input size=10 id="mutualobserveraltitude" class="observerhome">*/
/*                                 </td>*/
/*                             </tr>                                                       */
/*                         </table>*/
/*                                                                     */
/*                     </div>*/
/*                     <div title="Satellites" data-options="" style="padding: 20px;">*/
/*                         <div class="icon32" id="icon-options-general"><br></div>*/
/*                         <h2>Satellite Options</h2>*/
/*                         */
/*                         <h3>Position Calculations</h3>*/
/*                         <table class="form-table">*/
/*                             <tr valign="top">*/
/*                                 <th>Calculate Every (Seconds)</th>*/
/*                                 <td>*/
/*                                     <input id="window-preferences-calc-timer" class="easyui-numberspinner" style="width: 60px;" required="required" data-options="min:1,max:50,editable:false">*/
/*                                     <p class="description">If you have a slower PC then try increasing this value to improve performance.</p>*/
/*                                     </td>*/
/*                             </tr>*/
/*                             <tr valign="top">*/
/*                                 <th>AoS When Above (In Degrees)</th>*/
/*                                 <td>*/
/*                                     <input id="window-preferences-aos" class="easyui-numberspinner" style="width: 60px;" required="required" data-options="min:-10,max:100,editable:false">*/
/*                                 </td>*/
/*                             </tr>*/
/*                         </table>*/
/*                         */
/*                         <h3>Satellite Groups</h3>*/
/*                         <table class="form-table">*/
/*                             <tr valign="top">*/
/*                                 <th>Default TLE Group</th>*/
/*                                 <td>*/
/*                                     <select id="options-sat-group-selector-listbox"></select>*/
/*                                     <p class="description">Select the satellite group to load at startup.</p>*/
/*                                 </td>*/
/*                             </tr>                          */
/*                             <tr valign="top">*/
/*                                 <th>Auto Add From TLE Group</th>*/
/*                                 <td>*/
/*                                     <input type="checkbox" id="sats-autoadd" value="on">*/
/*                                     <p class="description">Automatically add all of the satellites in a group when its selected. <strong>NOTE:</strong> This will also add all of the satellites from the default group when the page is loaded.</p>*/
/*                                 </td>*/
/*                             </tr>                          */
/*                         </table>*/
/*                     </div>*/
/*                     */
/*                     <div title="Views" data-options="" style="padding: 0px;">*/
/*                         <div id="window-preferences-tabs-views" class="easyui-tabs" data-options="fit:true">*/
/*                             <div title="Polar View" data-options="" style="padding: 5px;">*/
/*                                 <div class="icon32" id="icon-options-general"><br></div>*/
/*                                 <h2>Polar View Options</h2>*/
/*                                 */
/*                                 <table width="100%">*/
/*                                     <tr>*/
/*                                         <td rowspan="2" width="50%" valign="top">*/
/*                                             <h3>View Colours</h3>*/
/*                                             <table width="100%">*/
/*                                                 <tr>*/
/*                                                     <th width="50%">Background Colour</th>*/
/*                                                     <td width="50%"><input class="jscolor polarcolour" id="polar-background-color" type="text" value="" /></td>*/
/*                                                 </tr>*/
/*                                                 <tr>*/
/*                                                     <th width="50%">Border Colour</th>*/
/*                                                     <td width="50%"><input class="jscolor polarcolour" id="polar-border-color" type="text" value="" /></td>*/
/*                                                 </tr>                                                */
/*                                                 <tr>*/
/*                                                     <th width="50%">Gradient Start</th>*/
/*                                                     <td width="50%"><input class="jscolor polarcolour" id="polar-gradient-start" type="text" value="" /></td>*/
/*                                                 </tr>*/
/*                                                 <tr>*/
/*                                                     <th width="50%">Gradient End</th>*/
/*                                                     <td width="50%"><input class="jscolor polarcolour" id="polar-gradient-end" type="text" value="" /></td>*/
/*                                                 </tr>*/
/*                                                 <tr>*/
/*                                                     <th width="50%">Grid Colour</th>*/
/*                                                     <td width="50%"><input class="jscolor polarcolour" id="polar-grid" type="text" value="" /></td>*/
/*                                                 </tr>*/
/*                                                 <tr>*/
/*                                                     <th width="50%">Text Colour</th>*/
/*                                                     <td width="50%"><input class="jscolor polarcolour" id="polar-text" type="text" value="" /></td>*/
/*                                                 </tr>*/
/*                                                 <tr>*/
/*                                                     <th width="50%">Degree Text Colour</th>*/
/*                                                     <td width="50%"><input class="jscolor polarcolour" id="polar-degrees-text" type="text" value="" /></td>*/
/*                                                 </tr>*/
/*                                                 <tr>*/
/*                                                     <th width="50%">Reset Colours To Defaults</th>*/
/*                                                     <td width="50%"><button id="polar-reset-colours">Default</button></td>*/
/*                                                 </tr>                                                  */
/*                                             </table>*/
/* */
/*                                         </td>*/
/*                                         <td width="50%">*/
/*                                             <div id="polar-preview" style="width:400px; height:400px"></div>*/
/*                                         </td>*/
/*                                     </tr>*/
/*                                     <tr>*/
/*                                         <td></td>*/
/*                                     </tr>*/
/*                                 </table>*/
/*                                 */
/*                             </div>*/
/*                             <div title="Passes View" data-options="" style="padding: 5px;">*/
/*                                 <div class="icon32" id="icon-options-general"><br></div>*/
/*                                 <h2>Passes View Options</h2>*/
/*                                 <h3>Default views</h3>*/
/*                                 <p>The passes view has two views that can be set by default. Select the default views to be shown below. The views can be altered on the passes ribbon tab. <strong>NOTE:</strong> You will need to refresh the page for these settinsg to take effect.</p>*/
/*                                 <table class="form-table">*/
/*                                     <tr valign="top">*/
/*                                         <th>Bottom Left View</th>*/
/*                                         <td>*/
/*                                             <select class="options-cb" id="options-passes-view-bottomleft">*/
/*                                                 <option value="3d">3D View</option>*/
/*                                                 <option value="polar">Polar View</option>*/
/*                                                 <option value="sky">Sky View</option>*/
/*                                                 <option value="azel">Az/El View</option>*/
/*                                             </select>*/
/*                                         </td>*/
/*                                     </tr>                          */
/*                                     <tr valign="top">*/
/*                                         <th>Bottom Right View</th>*/
/*                                         <td>*/
/*                                             <select class="options-cb" id="options-passes-view-bottomright">*/
/*                                                 <option value="3d">3D View</option>*/
/*                                                 <option value="polar">Polar View</option>*/
/*                                                 <option value="sky">Sky View</option>*/
/*                                                 <option value="azel">Az/El View</option>                                               */
/*                                             </select>*/
/*                                         </td>*/
/*                                     </tr>                          */
/*                                 </table>                                */
/*                             </div>*/
/*                             <div title="3D View" data-options="" style="padding: 5px;">*/
/*                                 <div class="icon32" id="icon-options-general"><br></div>*/
/*                                 <h2>3D View Options</h2>*/
/*                                 <h3>Static Map Image</h3>*/
/*                                 <table class="form-table">*/
/*                                     <tr valign="top">*/
/*                                         <th>Static Map Image*/
/*                                         </th>*/
/*                                         <td>*/
/*                                             <select class="options-cb" id="options-3d-view-staticimage">*/
/*                                                 <option value="land_ocean_ice_lights_2048.jpg">Land Ocean Ice Lights 2048</option>*/
/*                                                 <option value="land_ocean_ice_lights_512.jpg">Land Ocean Ice Lights 512</option>*/
/*                                                 <option value="NE2_50M_SR_W_2048.jpg">NE2 50M SR W 2048</option>*/
/*                                                 <option value="NE2_50M_SR_W_4096.jpg">NE2 50M SR W 4096</option>*/
/*                                             </select>*/
/*                                             <p class="description">Select the static map image to use in the 3D view.</p>*/
/* */
/*                                         </td>*/
/*                                         <td>*/
/*                                             <img src="" id="options-3d-view-staticimage-image" width="200">*/
/*                                         </td>*/
/*                                     </tr>                                                    */
/*                                 </table>*/
/*                                 */
/*                                 <h3>Views and providers</h3>*/
/*                                 <table class="form-table">*/
/*                                     <tr valign="top">*/
/*                                         <th>Default View</th>*/
/*                                         <td>*/
/*                                             <select class="options-cb" id="options-3d-view">*/
/*                                                 <option value="threed">3D View</option>*/
/*                                                 <option value="twod">2D View</option>*/
/*                                                 <option value="twopointfived">2.5D View</option>*/
/*                                             </select>                                            */
/*                                         </td>*/
/*                                         <th>Default Provider</th>*/
/*                                         <td>*/
/*                                             <select class="options-cb" id="options-3d-provider">*/
/*                                                 <option value="staticimage">Static Image</option>*/
/*                                                 <option value="bing">Bing Maps</option>*/
/*                                                 <option value="osm">Open Street Map</option>*/
/*                                                 <option value="arcgis">Arc Gis</option>*/
/*                                             </select>                                            */
/*                                         </td>                                        */
/*                                     </tr>*/
/*                                     <tr valign="top">*/
/*                                         <th>Use Terrain Provider</th>*/
/*                                         <td>*/
/*                                             <input type="checkbox" id="options-3d-terrainprovider" value="on" class="options-cb">*/
/*                                             <p class="description">The Terrain Provider will show elevation data on the 3D view.</p>*/
/*                                         </td>*/
/*                                         <th></th>*/
/*                                         <td></td>                                        */
/*                                     </tr>*/
/*                                 </table>                                */
/*                                 */
/*                                 */
/*                                 <h3>Satellites</h3>*/
/*                                 <table class="form-table">*/
/*                                     <tr valign="top">*/
/*                                         <th width="30%" colspan="2"><strong>Unselected</strong></th>*/
/*                                         <th colspan="1">Selected</th>*/
/*                                     </tr>*/
/*                                     <tr valign="top">*/
/*                                         <th>Icon</th>*/
/*                                         <td>*/
/*                                             <select class="options-cb" id="options-3d-sat-icon-unselected">*/
/*                                                 <option value="1" data-imagesrc="/images/satellites/satellite0-32.png">Icon 1</option>*/
/*                                                 <option value="2" data-imagesrc="/images/satellites/satellite1-32.png">Icon 2</option>*/
/*                                             </select>                                            */
/*                                         </td>*/
/*                                         <td>*/
/*                                             <select class="options-cb" id="options-3d-sat-icon-selected">*/
/*                                                 <option value="1" data-imagesrc="/images/satellites/satellite0-32.png">Icon 1</option>*/
/*                                                 <option value="2" data-imagesrc="/images/satellites/satellite1-32.png">Icon 2</option>*/
/*                                             </select>                                            */
/*                                         </td>*/
/*                                     </tr>*/
/*                                     <tr valign="top">*/
/*                                         <th>Icon Size</th>*/
/*                                         <td>*/
/*                                             <select class="options-cb" id="options-3d-sat-icon-unselected-size">*/
/*                                                 <option value="16">16 Pixels</option>*/
/*                                                 <option value="24">24 Pixels</option>*/
/*                                                 <option value="32">32 Pixels</option>*/
/*                                                 <option value="64">64 Pixels</option>*/
/*                                                 <option value="128">128 Pixels</option>*/
/*                                                 <option value="256">256 Pixels</option>*/
/*                                             </select>                                          */
/*                                         </td>*/
/*                                         <td>*/
/*                                             <select class="options-cb" id="options-3d-sat-icon-selected-size">*/
/*                                                 <option value="16">16 Pixels</option>*/
/*                                                 <option value="24">24 Pixels</option>*/
/*                                                 <option value="32">32 Pixels</option>*/
/*                                                 <option value="64">64 Pixels</option>*/
/*                                                 <option value="128">128 Pixels</option>*/
/*                                                 <option value="256">256 Pixels</option>*/
/*                                             </select>                                          */
/*                                         </td>*/
/*                                     </tr>*/
/*                                     <tr valign="top">*/
/*                                         <th>Label Size</th>*/
/*                                         <td>*/
/*                                             <select class="options-cb" id="options-3d-sat-label-unselected-size">*/
/*                                                 <option value="8">8 Pixels</option>*/
/*                                                 <option value="10">10 Pixels</option>*/
/*                                                 <option value="12">12 Pixels</option>*/
/*                                                 <option value="14">14 Pixels</option>*/
/*                                                 <option value="16">16 Pixels</option>*/
/*                                                 <option value="18">18 Pixels</option>*/
/*                                                 <option value="20">20 Pixels</option>*/
/*                                                 <option value="22">22 Pixels</option>*/
/*                                                 <option value="24">24 Pixels</option>*/
/*                                             </select>                                          */
/*                                         </td>*/
/*                                         <td>*/
/*                                             <select class="options-cb" id="options-3d-sat-label-selected-size">*/
/*                                                 <option value="8">8 Pixels</option>*/
/*                                                 <option value="10">10 Pixels</option>*/
/*                                                 <option value="12">12 Pixels</option>*/
/*                                                 <option value="14">14 Pixels</option>*/
/*                                                 <option value="16">16 Pixels</option>*/
/*                                                 <option value="18">18 Pixels</option>*/
/*                                                 <option value="20">20 Pixels</option>*/
/*                                                 <option value="22">22 Pixels</option>*/
/*                                                 <option value="24">24 Pixels</option>*/
/*                                             </select>                                         */
/*                                         </td>*/
/*                                     </tr>*/
/*                                     <tr valign="top">*/
/*                                         <th>Label Colour</th>*/
/*                                         <td><input class="jscolor polarcolour" id="3d-label-colour-unselected" type="text" value="" /></td>*/
/*                                         <td><input class="jscolor polarcolour" id="3d-label-colour-selected" type="text" value="" /></td>*/
/*                                     </tr>*/
/*                                 </table>  */
/*                                 */
/*                                 */
/*                                 */
/*                                                               */
/*                                 <h3>Following Options</h3>*/
/*                                 <table class="form-table">*/
/*                                     <tr valign="top">*/
/*                                         <th>Height Above Observer Location</th>*/
/*                                         <td>*/
/*                                             <input id="options-3d-view-followobs-height" class="easyui-numberspinner" style="width: 60px;" required="required" data-options="min:0,max:1000,editable:false" value="1">                                        */
/*                                             <p class="description">Select the height above the observer location, this is in meters.</p>*/
/*                                         </td>*/
/*                                         <th>Height Above Satellite</th>*/
/*                                         <td>*/
/*                                             <input id="options-3d-view-followsat-height" class="easyui-numberspinner" style="width: 60px;" required="required" data-options="min:0,max:10000,editable:false">                                        */
/*                                             <p class="description">Select the height above the satellite location, this is in meters.</p>*/
/*                                         </td>                                        */
/*                                     </tr>*/
/*                                 </table>*/
/*                                 */
/*                                 <h3>Cities</h3>*/
/*                                 <table class="form-table">*/
/*                                     <tr valign="top">*/
/*                                         <th>Show Cities</th>*/
/*                                         <td>*/
/*                                             <input id="options-3d-view-show-cities" type="checkbox" class="options-cb" value="on">                                      */
/*                                             <p class="description">Enable this option to show cities on the 3d view.</p>*/
/*                                         </td>*/
/*                                         <th>Font Size</th>*/
/*                                         <td>*/
/*                                             <input id="options-3d-view-city-font-size" type="text" size="3" class="options-spinner"> px                                      */
/*                                             <p class="description">The font size for the city labels in pixels</p>*/
/*                                         </td>                                        */
/*                                     </tr>*/
/*                                     <tr valign="top">*/
/*                                         <th>Population Limit</th>*/
/*                                         <td>*/
/*                                             <input id="options-3d-view-city-pop-limit" class="easyui-numberspinner" style="width: 30px;" required="required" data-options="min:0,max:10,increment:0.1,editable:true"> Million                                      */
/*                                             <p class="description">Cities will only be displayed if their population is above or equal to this limit.</p>*/
/*                                         </td>*/
/*                                         <th>Label Colour</th>*/
/*                                         <td>*/
/*                                             <input id="options-3d-view-city-font-colour" type="text" class="jscolor">                                      */
/*                                             <p class="description">The label colour</p>*/
/*                                         </td>                                         */
/*                                     </tr>                                                                                         */
/*                                 </table>*/
/*                                 */
/*                                                                                                                          */
/*                             </div>                            */
/*                         </div>*/
/*                     </div>                    */
/*                     */
/*                 </div>*/
/*             </div>*/
/*             */
/*             <div title="Debug View" width=1000 height=600 id="debug">   */
/*                 <table id="debuggrid" class="easyui-treegrid" style="width:600px;height:400px"  */
/*                         data-options="idField:'id',treeField:'satellite',title:'Satellite Data',fit:true">  */
/*                     <thead>  */
/*                         <tr>  */
/*                             <th data-options="field:'satellite',width:250">Satellite</th>  */
/*                             <th data-options="field:'orbits',width:60,align:'right'">Orbits</th>  */
/*                             <th data-options="field:'orbitno',width:80">Orbit Number</th>  */
/*                             <th data-options="field:'aos',width:120">AoS</th>  */
/*                             <th data-options="field:'los',width:120">LoS</th>  */
/*                             <th data-options="field:'points',width:80">Points</th>  */
/*                             <th data-options="field:'calctime',width:110">Calc Time (ms)</th>  */
/*                         </tr>  */
/*                     </thead>  */
/*                 </table>                      */
/*             </div>    */
/*             */
/*             <div title="Home View" id="home">   */
/*                 <div><img src="/images/logo-128-noborder.png" class="vertical" /><span class="heading">Welcome to AGSatTrack - Online</span></div>*/
/*                 */
/*                 <h2>Basic Concepts</h2>*/
/*                 <p><strong>Your Location.</strong> When first started the browser will ask you if the site is allowed to use your location. if you answer yes then the browser will attempt to determine your approximate location. <strong>note</strong> this is not generally that accurate. Under options->observer you can select your exact location.</p>*/
/*                 <p><strong>Satellites</strong> are loaded from groups, these match the standard groups available on sites like celestrak. A default group is loaded at startup, unless you have changed this the 'amateur' group is loaded. To load a group select the 'Groups' dropdown from the Home ribbon menu. You can also specify the default group to load in the options, under satellites.</p>*/
/*                 <p>Once a group is loaded you need to add satellites to display. When a satellite is displayed its data is calculated. Those satellites not being displayed will not have any data calculated for them. By default all satellites in the loaded group are automatically added. You can disable this in Options->satellites.</p>*/
/*                 <p>Satellites can be 'selected', this can be done from the list viewe, Satellite Selector or generally by clicking on a satellite in any view. Once a satellite is selected more data will be displayed, generally its orbit and passes. The Satellite info pannel on the left will also show more information. If multiple satellites are selected then a drop down will appear allowing you to select the satellite to show more detailed information for.</p>*/
/*                 <h2>Views</h2>*/
/*                 <p>There are 7 main views available.</p>*/
/*                 <ul>*/
/*                     <li><strong>List View.</strong> This is a basic list of all satellites loaded and is updated to reflect current data. For large groups of satellites the list is paged. The page size can be set at the botom of the view.</li>*/
/*                     <li><strong>3D View.</strong> This is a rotatable, zoomable view of the earth. satellites will be displayed, along with their orbits of there are selected. if the current orbit has a pass over your location this will be shown in green on the orbit path. The imagry for the earth can be selected in the 'provider' drop down. You can follow a selected satellite either from your location or from the satellite. The 'View' option also allows for a 2D and 2.5D view.</li>*/
/*                     <li><strong>Passes View.</strong> This view displays pass information for a satellite. The satellite and pass can be selected in the ribbon menu. The two bottom views can be selected in the ribbon menu. the default for these two views can be specified in the options.</li>*/
/*                     <li><strong>Polar View.</strong> This displays a Polar, or radar, view.</li>*/
/*                     <li><strong>Sky View.</strong> This displays a view looking South from your location. This can be handy for visual satellite observation. The horizon image can be dragged up and down if its in the way or turned off in the ribbon menu.</li>*/
/*                     <li><strong>Timeline View.</strong> This will show all passes for the selectedd satellites within the next 24 hours.</li>*/
/*                     <li><strong>Az/El View.</strong> This is <strong>only</strong> available in the passes view. It shows a graph of Azimuth and elevation for a selected pass.</li>*/
/*                 </ul>*/
/*                 <h4>Debug View</h4>*/
/*                 <p>This must be enabled in the options. This view is primarily intended to debug issues. It shows all of the available satellites along with information about the internal calculation engine.</p>*/
/*             </div>*/
/*             */
/*             <div title="DX View" id="dx">*/
/*             </div>                                  */
/*             */
/*         </div>*/
