///
///  Name: Node.js, Ogre3D, Mouse & Keyboard input using OIS, generating a maze, Demo
///  File: demo.js
///  Date: 2013-01-13
///  Author: Christian Westman 
///  Web: http://techny.tumblr.com
///  Email: creamdog@creamdog.se
///  Twitter: @westmaaan
///
///  Description: mouse & keyboard input using OIS and maze generation.
///
///

try
{
	ogre = require('./modules/OgreToNode');
	root = ogre.createRoot("", "", "test.log");
	// load plugins
	root.loadPlugin("./modules/RenderSystem_GL");
	root.loadPlugin("./modules/RenderSystem_Direct3D9");
	root.loadPlugin("./modules/Plugin_ParticleFX");
	root.loadPlugin("./modules/Plugin_CgProgramManager");
	root.loadPlugin("./modules/Plugin_OctreeSceneManager");
	// load resources
	root.addResourceLocation('./media','FileSystem');
	root.addResourceLocation('./materials','FileSystem');
	// set opengl as the render system
	root.setRenderSystemByName(root.getRenderSystemNames()[0]);
	// create the window
	window = root.createRenderWindow(
	{
		title: "Ogre To Node", 
		width: 1024, 
		height: 768, 
		fullscreen: false, 
		params: {"FSAA":"1", "vsync":"true", "border":"fixed"}
	});
	window.setActive(true);
	window.setAutoUpdated(false);
	// get scene manager
	sceneManager = root.createSceneManager({name: "FirstSceneManager"});
	rootSceneNode = sceneManager.getRootSceneNode();
	// create camera and attach it to a scene node
	camera = sceneManager.createCamera({name: "FirstCamera"})
	cameraNode = rootSceneNode.createChildSceneNode({name: "FirstCameraNode"});
	cameraNode.attachCamera(camera);
	// create viewport
	viewPort = window.addViewPort(
	{
		camera: camera, 
		zorder:100, 
		top:0.0, 
		left:0.0, 
		width:1.0, 
		height:1.0
	});
	viewPort.setAutoUpdated(true);
	viewPort.setBackgroundColour(0.0,0,0.0,1.0);
	// configure camera aspect ratio and set clipping
	var ratio = viewPort.getActualWidth() / viewPort.getActualHeight() * 1.25;
	camera.setAspectRatio(ratio);
	camera.setNearClipDistance(0.5);
	camera.setFarClipDistance(3000);
	// initialize all resource groups
	var resourceManager = root.getResourceGroupManager();
	resourceManager.initializeAllResourceGroups();
	// initialize OIS
	ois = require('./modules/ois');
	oisInputManager = ois.createInputSystem(window.getHandle());
	keyboard = oisInputManager.getKeyboard();
	mouse = oisInputManager.getMouse();
	mouse.setHeight(window.getHeight());
	mouse.setWidth(window.getWidth());
	// generate maze
	var mGen = require('./mazeGenerator.js');
	var maze = mGen.generate(25,25);
	mGen.print(maze);
	mGen.createMesh(maze, "MazeMesh");
	// load maze instance
	mazeMesh = sceneManager.createEntity("MazeMesh");
	mazeMesh.setCastsShadows(false);
	mazeNode = rootSceneNode.createChildSceneNode("MazeMeshNode");
	mazeNode.attachEntity(mazeMesh);
	mazeNode.translate(-25*2,0,-25*2);
	// create a light source
	light = sceneManager.createLight();
	light.setAttenuation(100, 1.0, 0.045, 0.0075);
	light.setDiffuseColour(1.0, 1.0, 1.0);
	light.setSpecularColour(1.0, 1.0, 0.0);
	lightNode = rootSceneNode.createChildSceneNode("lightNode");
	lightNode.attachLight(light);
	// set a sky dome
	sceneManager.setSkyDome('sky');
	sceneManager.setAmbientLight(0.25, 0.25, 0.50);
	// load some music
	fmod = require('./modules/fmod');
	fmodSystem = fmod.createFmodSystem();
	fmodSystem.init();
	fmodChannel = fmod.createChannel();
	fmodSound = fmodSystem.createSound('./media/ambient2.it');
	fmodSystem.playSound({sound:fmodSound, channel:fmodChannel});
	// clear all event times before entering the 'main loop'
	root.clearEventTimes();
	// variable used for head bopping
	boppr = 0
	// the following is the programs 'main loop'
	var interval = 0;
	function mainLoop() {
		keyboard.capture();
		mouse.capture();
		if(window.isClosed() || keyboard.isKeyDown(1)) {
			clearInterval(interval);
			if(keyboard.isKeyDown(1)) {
				console.log("used pressed ESC, shutting down");
			} else { 
				console.log("window has been closed, shutting down");
			}
			return;
		}
		// move around using the keyboard
		if(keyboard.isKeyDown(17)) {
			cameraNode.translate(0,0,-0.15, 0);
		} else if(keyboard.isKeyDown(31)) {
			cameraNode.translate(0,0, 0.15, 0);
		}
		if(keyboard.isKeyDown(30)) {
			cameraNode.translate(-0.15, 0, 0.0, 0);
		} else if(keyboard.isKeyDown(32)) {
			cameraNode.translate( 0.15, 0, 0.0, 0);
		}
		// look around using the mouse
		var mx = mouse.getXRel() / window.getWidth();
		var my = mouse.getYRel() / window.getHeight();
		cameraNode.yaw(mx*-10, 2);
		cameraNode.pitch(my*-10, 0);
		// simulate "head bopping" when player is moving
		var boppy = 0;
		var r = boppr;
		if(keyboard.isKeyDown(17) || keyboard.isKeyDown(31) || keyboard.isKeyDown(30) || keyboard.isKeyDown(32)) {
			boppr += Math.PI / 10;
			if(boppr>Math.PI)
				boppr = Math.PI - boppr;
		} else {
			boppr = 0;
		}
		boppy = Math.sin(boppr)*0.2;
		// adjust camera y-position to simulate "head bopping"
		cameraNode.setPosition(cameraNode.getPosition().x, boppy, cameraNode.getPosition().z);
		// move light along with the player
		lightNode.setPosition(cameraNode.getPosition().x, cameraNode.getPosition().y, cameraNode.getPosition().z);

		window.update(false);
		window.swapBuffers(true);
		root.renderOneFrame();
		window.messagePump();
	}
	interval = setInterval(mainLoop, 1);

} catch(e) {
	console.log(e);
}