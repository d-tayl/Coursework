Requirements description:
1. Semantics througout pages - sections, articles, nav, headers
2. Spin animation on logo and heart on index page (trigger doesn't work on Firefox).
	Background fade on game over and restart.
3. Contact us form makes use of HTML5 input types and validations.
4. Page resizes appropriately, text resizes when view is small.
5. Heart on index page and logo made using SVG. Offline page contains drawing canvas.
6. Tested and works on IE 11, Chrome, Firefox. 
7. User redirected to offline page when offline. appcache file is present and contains
	the fallback.
8. Favourites stored in local storage. High score stored in both session and local storage.
9. Game is based around use of geolocation to determine user's location from a panorama location.
10. Separation of display, functionality and layout. Comments on JavaScript. Files in 
	appropriate folders. Uses a simple node.js server (simpleServer.js)