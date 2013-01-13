///
///  Name: Node.js, Ogre, Textures Demo
///  File: graphics.js
///  Date: 2013-01-04
///  Author: Christian Westman 
///  Web: http://techny.tumblr.com
///  Email: creamdog@creamdog.se
///  Twitter: @westmaaan
///
///  Description: textures and basic terrain generator
///
///

ogre = require('./modules/OgreToNode');
logfile= 'demo.log';
root= null;
var window= null;
windowTitle= 'Node.js, Ogre, Materials & Lighting';
windowWidth= 800;
windowHeight= 600;
sceneManager= null;
rootSceneNode= null;
camera= null;
cameraNode= null;
viewPort=null;
cubeEntity= null;
cubeNode= null;
plugins= [	
	'./RenderSystem_GL',
	'./Plugin_ParticleFX',
	'./Plugin_CgProgramManager',
	'./Plugin_OctreeSceneManager'
];
function initialize() {
	console.log("intializing ogre...");

	ogre = require('./modules/OgreToNode');

	root = ogre.createRoot("", "", logfile);
	loadPlugins();
	intitializeResources();

	root.setRenderSystemByName(root.getRenderSystemNames()[0]);
	createWindow();
	sceneManager = root.createSceneManager({name : "TheSceneManager"});
	rootSceneNode = sceneManager.getRootSceneNode();
	createCamera();
	createViewport();		
	//configure the camera
	var ratio = viewPort.getActualWidth() / viewPort.getActualHeight();
	camera.setAspectRatio(ratio);
	camera.setNearClipDistance(0.5);
	camera.setFarClipDistance(3000);
	//configure window
	window.setActive(true);
	window.setAutoUpdated(false);

	//set the mood
	createLights();

	//generate some terrain
	terrain = require('./terrain.js');
	terrain.createTerrainMesh('TerrainObject', 'TerrainMesh');

	//create a terrain instance and position it
	var entity = sceneManager.createEntity("TerrainMesh");
	entity.setCastsShadows(false);
	var node = rootSceneNode.createChildSceneNode("TerrainNode");
	node.attachEntity(entity);
	node.translate(0,-10,-10.0);
	node.pitch(0.35);
	cubeNode = node;
	cubeEntity = entity;

	//create a sky using the 'sky' material
	sceneManager.setSkyDome('sky');

	root.clearEventTimes();
};
function intitializeResources() {
	root.addResourceLocation('./resources','FileSystem');
	resourceManager = root.getResourceGroupManager();
	resourceManager.initializeAllResourceGroups();
};
function createLights() {

	sceneManager.setAmbientLight(0.15, 0.1, 0.125);

	light = sceneManager.createLight();
	light.setAttenuation(100, 1.0, 0.045, 0.0075);
	light.setDiffuseColour(1.0, 0.8, 0.3);
	light.setSpecularColour(1.0, 1.0, 0.0);
	lightNode = rootSceneNode.createChildSceneNode("lightNode");
	lightNode.attachLight(light);
	lightNode.translate(5,5,-10.0);

	light2 = sceneManager.createLight();
	light2.setAttenuation(100, 1.0, 0.045, 0.0075);
	light2.setDiffuseColour(0.0, 0.0, 1.0);
	lightNode2 = rootSceneNode.createChildSceneNode("lightNode2");
	lightNode2.attachLight(light2);
	lightNode2.translate(-10,5,-10.0);
}
function createCamera() {
	console.log("creating ogre camera...");
	camera = sceneManager.createCamera({name : "TheCamera"});
	cameraNode = rootSceneNode.createChildSceneNode({name : "TheCameraNode"});
	cameraNode.attachCamera(camera);
};
function createViewport() {
	console.log("creating ogre viewport...");
	var viewPortWidth = 1.0;
	var viewPortHeight = 1.0;
	var viewPortLeft = (1.0 - viewPortWidth) * 0.5;
	var viewPortTop = (1.0 - viewPortHeight) * 0.5;
	viewPort = window.addViewPort(
	{
		camera: camera, 
		zorder: 100, 
		top: viewPortTop, 
		left: viewPortLeft, 
		width: viewPortWidth, 
		height: viewPortHeight
	});
	viewPort.setAutoUpdated(true);
	viewPort.setBackgroundColour(0.0,0,0.0,1.0);
};
function createWindow() {
	console.log("creating ogre window...");
	window = root.createRenderWindow(
	{
		title: windowTitle, 
		width: windowWidth, 
		height: windowHeight, 
		fullscreen: false, 
		params: {"FSAA":"0", "vsync":"true"}
	});
};
function loadPlugins() {
	console.log("loading ogre plugins...");
	for(var i=0;i<plugins.length;i++) {
		root.loadPlugin(plugins[i]);	
	}
};
function isClosed()
{
	return window.isClosed();
}
cubeBackTranslation = 0;
function update() {
	
	cubeNode.yaw(0.001);

	window.update(false);
	window.swapBuffers(true);
	root.renderOneFrame();
	window.messagePump();
}

module.exports.initialize = initialize;
module.exports.isClosed = isClosed;
module.exports.update = update;