///
///  Name: Node.js, Ogre, FMOD demo 
///  Date: 2012-12-31
///  Author: Christian Westman 
///  Web: http://techny.tumblr.com
///  Email: creamdog@creamdog.se
///  Twitter: @westmaaan
///
///  Description: demo using ogre and fmod in node.js
///
///


//lets have some music
music = {
	fmod: require('./modules/fmod'),
	fmodSystem: null,
	channel: null,
	sound: null,
	mediafile: './media/music.mod',
	initialize: function() {
		music.fmodSystem = music.fmod.createFmodSystem();
		music.fmodSystem.init();
		var version = music.fmodSystem.getVersion();
		console.log("fmod intialized, version = "+version);
		music.channel = music.fmod.createChannel();
		console.log("loading sound from "+music.mediafile);
		music.sound = music.fmodSystem.createSound(music.mediafile);
	},
	play: function() {
		console.log('playing '+music.mediafile+' ('+music.sound.getLength()+'ms)');
		music.fmodSystem.playSound({sound:music.sound, channel:music.channel});
	}
}
music.initialize();

//lets make an awesome spinning cube or something
graphics = {
	ogre : require('./modules/OgreToNode'),
	logfile: 'demo.log',
	root: null,
	window: null,
	windowTitle: 'Node.js Ogre/Fmod Demo',
	windowWidth: 800,
	windowHeight: 600,
	sceneManager: null,
	rootSceneNode: null,
	camera: null,
	cameraNode: null,
	viewPort:null,
	cubeEntity: null,
	cubeNode: null,
	plugins: [	
		'./modules/RenderSystem_GL_d',
		'./modules/Plugin_ParticleFX_d',
		'./modules/Plugin_CgProgramManager_d',
		'./modules/Plugin_OctreeSceneManager_d'
	],
	initialize: function() {
		console.log("intializing ogre...");
		graphics.root = graphics.ogre.createRoot("", "", graphics.logfile);
		graphics.loadPlugins();
		graphics.root.setRenderSystemByName(graphics.root.getRenderSystemNames()[0]);
		graphics.createWindow();
		graphics.sceneManager = graphics.root.createSceneManager({name: "TheSceneManager"});
		graphics.rootSceneNode = graphics.sceneManager.getRootSceneNode();
		graphics.createCamera();
		graphics.createViewport();		
		//configure the camera
		var ratio = graphics.viewPort.getActualWidth() / graphics.viewPort.getActualHeight();
		graphics.camera.setAspectRatio(ratio);
		graphics.camera.setNearClipDistance(0.5);
		graphics.camera.setFarClipDistance(3000);
		//configure window
		graphics.window.setActive(true);
		graphics.window.setAutoUpdated(false);
		graphics.root.clearEventTimes();
		//generate and load the spinning cube
		graphics.generateCubeMesh();
		graphics.loadCubeMesh();
	},
	createCamera: function() {
		console.log("creating ogre camera...");
		graphics.camera = graphics.sceneManager.createCamera({name: "TheCamera"});
		graphics.cameraNode = graphics.rootSceneNode.createChildSceneNode({name: "TheCameraNode"});
		graphics.cameraNode.attachCamera(graphics.camera);
	},
	createViewport: function() {
		console.log("creating ogre viewport...");
		var viewPortWidth = 0.98;
		var viewPortHeight = 0.98;
		var viewPortLeft = (1.0 - viewPortWidth) * 0.5;
		var viewPortTop = (1.0 - viewPortHeight) * 0.5;
		graphics.viewPort = graphics.window.addViewPort(
		{
			camera: graphics.camera, 
			zorder: 100, 
			top: viewPortTop, 
			left: viewPortLeft, 
			width: viewPortWidth, 
			height: viewPortHeight
		});
		graphics.viewPort.setAutoUpdated(true);
		graphics.viewPort.setBackgroundColour(0.0,0,0.0,1.0);
	},
	createWindow: function() {
		console.log("creating ogre window...");
		graphics.window = graphics.root.createRenderWindow(
		{
			title: graphics.windowTitle, 
			width: graphics.windowWidth, 
			height: graphics.windowHeight, 
			fullscreen: false, 
			params: {"FSAA":"0", "vsync":"true"}
		});
	},
	loadPlugins: function() {
		console.log("loading ogre plugins...");
		for(var i=0;i<graphics.plugins.length;i++) {
			graphics.root.loadPlugin(graphics.plugins[i]);	
		}
	},
	loadCubeMesh: function() {
		var entity = graphics.sceneManager.createEntity("CubeMesh");
		var node = graphics.rootSceneNode.createChildSceneNode("CubeNode");
		node.attachEntity(entity);
		node.translate(0,0,-5.0);
		graphics.cubeNode = node;
		graphics.cubeEntity = entity;
	},
	generateCubeMesh: function() {
		// Example taken from "MadMarx Tutorial 4 - ManualObject to Mesh"
		// http://www.ogre3d.org/tikiwiki/tiki-index.php?page=MadMarx+Tutorial+4&structure=Tutorials
		console.log("generating cube mesh...");
		var size = 0.7;
		var object = graphics.sceneManager.createManualObject("CubeMeshObject");
		object.setDynamic(false);
		object.begin({material:"BaseWhiteNoLighting",renderOperation:4});
		{
			var cp = 1.0 * size ;
			var cm = -1.0 * size;

			object.position(cm, cp, cm);// a vertex
			object.colour(0.0,1.0,0.0,1.0);
			object.position(cp, cp, cm);// a vertex
			object.colour(1.0,1.0,0.0,1.0);
			object.position(cp, cm, cm);// a vertex
			object.colour(1.0,0.0,0.0,1.0);
			object.position(cm, cm, cm);// a vertex
			object.colour(0.0,0.0,0.0,1.0);

			object.position(cm, cp, cp);// a vertex
			object.colour(0.0,1.0,1.0,1.0);
			object.position(cp, cp, cp);// a vertex
			object.colour(1.0,1.0,1.0,1.0);
			object.position(cp, cm, cp);// a vertex
			object.colour(1.0,0.0,1.0,1.0);
			object.position(cm, cm, cp);// a vertex
			object.colour(0.0,0.0,1.0,1.0);

			// face behind / front
			object.triangle(0,1,2);
			object.triangle(2,3,0);
			object.triangle(4,6,5);
			object.triangle(6,4,7);

			// face top / down
			object.triangle(0,4,5);
			object.triangle(5,1,0);
			object.triangle(2,6,7);
			object.triangle(7,3,2);

			// face left / right
			object.triangle(0,7,4);
			object.triangle(7,0,3);
			object.triangle(1,5,6);
			object.triangle(6,2,1);			
		}
		object.end();
		object.convertToMesh("CubeMesh");
	}
}
graphics.initialize();

//play some music
music.play();

cubeBackTranslation = 0;
loopInterval = null;
function mainLoop() {

	if(graphics.window.isClosed()) {
		console.log("shutting down");
		clearInterval(loopInterval);	
		graphics.root.shutdown();
		return;
	}

	//get left side spectrum, where the drums are
	var spectrum = music.channel.getSpectrum(0);

	//calculate median value and amplify
	var median = 0;
	for(var i=0;i<spectrum.length-1;i++) {
		median += spectrum[i];
	}
	median = median / spectrum.length;
	median *= 300;

	//spinn the cube
	graphics.cubeNode.yaw(Math.random()*0.02);
	graphics.cubeNode.pitch(Math.random()*0.03);

	//pulsate the cube along the z-axis
	graphics.cubeNode.translate(0,0,median+cubeBackTranslation);
	cubeBackTranslation = -median;

	graphics.window.update(false);
	graphics.window.swapBuffers(true);
	graphics.root.renderOneFrame();
	graphics.window.messagePump();
}
loopInterval = setInterval(mainLoop, 1);