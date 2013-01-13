///
///  Name: Node.js, Ogre, Textures Demo
///  File: demo.js
///  Date: 2013-01-04
///  Author: Christian Westman 
///  Web: http://techny.tumblr.com
///  Email: creamdog@creamdog.se
///  Twitter: @westmaaan
///
///  Description: textures and basic terrain generator
///
///


//lets have some music
music = require('./music.js');
music.initialize();

//initilize Ogre, generate some terrain and set up the scene
graphics = require('./graphics.js');
graphics.initialize();

//play the music
music.play();

//main loop here
loopInterval = null;
function mainLoop() {
	if(graphics.isClosed()) {
		console.log("window closed, shutting down");
		clearInterval(loopInterval);	
		return;
	}
	graphics.update();
}
loopInterval = setInterval(mainLoop, 1);