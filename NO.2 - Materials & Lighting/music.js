///
///  Name: Node.js, Ogre, Textures Demo
///  File: music.js
///  Date: 2013-01-04
///  Author: Christian Westman 
///  Web: http://techny.tumblr.com
///  Email: creamdog@creamdog.se
///  Twitter: @westmaaan
///
///  Description: textures and basic terrain generator
///
///

fmod = require('./modules/fmod');
fmodSystem = null;
channel = null;
sound = null;
mediafile = './resources/birds_in_the_woods.mod';
function initialize() {
	fmodSystem = fmod.createFmodSystem();
	fmodSystem.init();
	var version = fmodSystem.getVersion();
	console.log("fmod intialized, version = "+version);
	channel = fmod.createChannel();
	console.log("loading sound from "+mediafile);
	sound = fmodSystem.createSound(mediafile);
}
function play() {
	console.log('playing '+mediafile+' ('+sound.getLength()+'ms)');
	fmodSystem.playSound({sound:sound, channel:channel});
}

module.exports.initialize = initialize;
module.exports.play = play;