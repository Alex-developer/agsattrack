# AgSatTrack #
  
Around 2001 I developed a windows based satellite tracking program mainly to assist me with the use of Amateur radio satellites. The program can still be found [here](http://hamsoftware.co.uk/agsattrack/).

Shortly after its release I started to look at cross platform technology which would allow me to port the program to both Linux and OSX. At the time I could not find anything that would make the port easy so left it!

In late 2012 I stumbled across the [Satellite Orbit Tracker](https://github.com/koansys/isat) project on GitHub which had a very nice rendering of a globe. I started to dig around and found that it was using another open source project on GitHub called [Cesium](https://github.com/AnalyticalGraphicsInc/cesium).

The Cesium engine looked like it could help form the basis of an online version of agsattrack and I started to experiment. By early Feb 2013 the first version of [agsattrack.com](http://www.agsattrack.com/) went live.

The code is still very much being developed and there are a lot of bugs that need fixing and new features that need adding.

Below are some screen shots to give you some idea of what it looks like.

![ScreenShot](https://raw.github.com/Alex-developer/agsattrack/master/screenshots/3d.png)

The 3d view. This is using Cesium to render the Earth and Cesium API functions to plot the satellites and draw the orbits.

![ScreenShot](https://raw.github.com/Alex-developer/agsattrack/master/screenshots/small/polar.png)

The Polar (Radar) view. This is a pretty standard Polar view implemented using an HTML5 canvas.

![ScreenShot](https://raw.github.com/Alex-developer/agsattrack/master/screenshots/small/skyview.png)

The Skyview. This is as if you are looking at the horizon. if the horizon image gets in the way you can either turn it off or drag it up and down. Again this view uses an HTML 5 canvas.

![ScreenShot](https://raw.github.com/Alex-developer/agsattrack/master/screenshots/small/timeline.png)

The Timeline View shows all of the passes for the selected satellites within the next 24 hours.

![ScreenShot](https://raw.github.com/Alex-developer/agsattrack/master/screenshots/small/passes.png)

The Passes view shows details of a pass in tabular, Polar and Skyview form. Different views can be selected for the bottom views from the toolbar.


## Requirements ##

- A Mysql database
- PHP 5.3 or higher
- A web server such as Apache
- An HTML5 compliant browser that supports WebGL (For non WebGL browsers the 3D view will not be available but the rest of the views will work).

### Available Views ###

- List View. A straight listing of all satellites. The view contains a paged list of satellites.
- 3D View. An Interactive 3d visualisation of the satellites. This view utilises the [Cesium](http://http://cesium.agi.com/) project 
- Polar View, or radar view. 
- Sky View. This view shows the sky looking south to give you a better idea of where to look for a satellite should it be visible. 
- Passes View. This comprises three different elements, the pass details list and two visual views that can be changed.

## Notes ##

This is VERY MUCH work in progress at the moment, far from stable and is changing constantly .......
For bug reports or general comments visit www.facebook.com/agsattrack
