About
-----

jQuery officebar is a plugin for jQuery. Read more at the
website:

  http://code.google.com/p/jquery-officebar/
  

Installation
------------

Include the Javascript file after you included jQuery.
Also add the required css files to create the required skin.

All tests where done using jQuery version 1.3.1.


Basic usage
-----------

Create a ribbon div and set the class to "officebar" this will use
the st:

   <div id="testRibbon"></div>

In this div you'll need to create the ul stucture that will hold the
real layout of the bar.
The structure in the example looks quite complex but when break it down
to the different options it is actually quite simple.
Additional markup to make everything look fine is done by the plugin
itself.

When this is done create the officebar
  $("#testRibbon").officebar();
  
You can add additional handlers for user interaction. When I find the
time and the courage I will add some documentation about it.


