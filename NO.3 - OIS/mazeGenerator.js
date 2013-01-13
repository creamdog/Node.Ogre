///
///  Name: Node.js, Ogre3D, Mouse & Keyboard input using OIS, generating a maze, Demo
///  File: mazeGenerator.js
///  Date: 2013-01-13
///  Author: Christian Westman 
///  Web: http://techny.tumblr.com
///  Email: creamdog@creamdog.se
///  Twitter: @westmaaan
///
///  Description: generates a depth-first maze using a recursive backtracker
///
///

var r = require('./rng.js');

/// returns a 2 dimensional boolean array of the size width*2+1 x height*2+1
function generate(width, height) {
	
	// initialize walls
	var map = [];
	for(var x=0;x<width;x++) {
		map[x] = [];
		for(var y=0;y<height;y++) {
			map[x][y] = {visited:false, walls: {left:true,right:true,bottom:true,top:true}};
		}
	}

	// generate walls
	var x = r.nextRange(0, width), y = r.nextRange(0, height);
	var stack = [];
	while(true) {
		map[x][y].visited = true;
		// select the next room to visit
		var nextRoomOptions = [];
		if(x>0 && map[x-1][y].visited == false)
			nextRoomOptions.push({x:x-1,y:y});
		if(x<width-1 && map[x+1][y].visited == false)
			nextRoomOptions.push({x:x+1,y:y});
		if(y>0 && map[x][y-1].visited == false)
			nextRoomOptions.push({x:x,y:y-1});
		if(y<width-1 && map[x][y+1].visited == false)
			nextRoomOptions.push({x:x,y:y+1});
		if(nextRoomOptions.length == 0) {
			if(stack.length == 0)
				break;
			var spos = stack.pop();
			x = spos.x;
			y = spos.y;
			continue;
		}
		stack.push({x:x,y:y});
		var nextPosition = r.choice(nextRoomOptions);
		// open up the wall between this and the next room
		if(nextPosition.x < x && y == nextPosition.y) {
			map[x][y].walls.left = false;
			map[nextPosition.x][nextPosition.y].walls.right = false;
		} else if(nextPosition.x > x && y == nextPosition.y) {
			map[x][y].walls.right = false;
			map[nextPosition.x][nextPosition.y].walls.left = false;
		} else if(nextPosition.x == x && nextPosition.y < y) {
			map[x][y].walls.top = false;
			map[nextPosition.x][nextPosition.y].walls.bottom = false;
		} else if(nextPosition.x == x && nextPosition.y > y) {
			map[x][y].walls.bottom = false;
			map[nextPosition.x][nextPosition.y].walls.top = false;
		}

		x = nextPosition.x;
		y = nextPosition.y;
	}
	// initialize blocks
	var blocks = [];
	for(var x=0;x<width*2+1;x++) {
		blocks[x] = [];
		for(var y=0;y<height*2+1;y++) {
			blocks[x][y] = true;
		}
	}
	// populate blocks
	for(var x=0;x<width;x++) {
		for(var y=0;y<height;y++) {
			var m = map[x][y];
			if(m.visited === false)
				continue;
			blocks[x*2+1][y*2+1] = false;
			if(x>0 && m.walls.left == false)
				blocks[(x*2)-1+1][y*2+1] = false;
			if(x<width-1 && m.walls.right == false)
				blocks[(x*2)+1+1][y*2+1] = false;
			if(y>0 && m.walls.top == false)
				blocks[x*2+1][(y*2)-1+1] = false;
			if(y<height-1 && m.walls.bottom == false)
				blocks[x*2+1][(y*2)+1+1] = false;
		}
	}
	// reduce blocks
	// creates more open areas instead of narrow corridors
	// removes blocks that has 3 free sides
	for(var i=0;i<10;i++) {
		for(var x=0;x<blocks.length;x++) {
			for(var y=0;y<blocks[x].length;y++) {

				var sides = 0;

				if(x>0 && blocks[x-1][y] == false)
					sides++;

				if(y>0 && blocks[x][y-1] == false)
					sides++;

				if(x<blocks.length-1 && blocks[x+1][y] == false)
					sides++;

				if(y<blocks.length-1 && blocks[x][y+1] == false)
					sides++;

				if(sides>=3)
					blocks[x][y] = false;
			}
		}
	}

	return blocks;
}

/// prints maze to console
function print(maze) {
	for(var y=0;y<maze.length;y++) {
		var str = "  ";
		for(var x=0;x<maze.length;x++) {
			str += maze[x][y] == true ? "#" : " ";
		}
		console.log(str);
	}
}

/// generates a mesh with supplied name from the given maze
function createMesh(maze, name) {
	var object = sceneManager.createManualObject(name+"Object");
	object.setDynamic(false);
	object.begin({material:"textures",renderOperation:4});
	//create vertices, colors, normals and texture mappings
	for(var x=0;x<maze.length;x++) {
	for(var y=0;y<maze[x].length;y++) {
		if(maze[x][y] == true)
			createSolidCubeVertices(object, x*2, 0, y*2);
		else
			createCeilFloorVertices(object, x*2, 0, y*2);
	}		
	}

	//create polygons
	var i = 0;
	for(var x=0;x<maze.length;x++) {
	for(var y=0;y<maze.length;y++) {

		if(maze[x][y] == false) {
			//bottom
				object.triangle(i+0,i+2,i+1);
				object.triangle(i+0,i+3,i+2);
			
			i+=4;
			//top
				// skip ceiling
				//object.triangle(i+0,i+1,i+2);
				//object.triangle(i+2,i+3,i+0);
			
			i+=4;
			continue;
		}

		//bottom
			// skip bottom as it is never visible
			//object.triangle(i+0,i+1,i+2);
			//object.triangle(i+2,i+3,i+0);
		
		i+=4;
		//top
			// skip top as it is never visible
			//object.triangle(i+2,i+1,i+0);
			//object.triangle(i+0,i+3,i+2);
		
		i+=4;
		//front
			// only create wall if there is no solid block in front of this block
			if(y<maze.length-1 && maze[x][y+1] == false) {
				object.triangle(i+0,i+1,i+2);
				object.triangle(i+2,i+3,i+0);
			}
		i+=4;
		//back
			// only create wall if there is no solid block behind of this block
			if(y>0 && maze[x][y-1] == false) {
				object.triangle(i+2,i+1,i+0);
				object.triangle(i+0,i+3,i+2);
			}
		
		i+=4;
		//left
			// only create wall if there is no solid block on the left side of this block
			if(x>0 && maze[x-1][y] == false) {
				object.triangle(i+0,i+1,i+2);
				object.triangle(i+2,i+3,i+0);
			}

		i+=4;
		//right
			// only create wall if there is no solid block on the right side of this block
			if(x<maze.length-1 && maze[x+1][y] == false) {
				object.triangle(i+2,i+1,i+0);
				object.triangle(i+0,i+3,i+2);
			}
		
		i+=4;
	}
	}

	object.end();
	object.convertToMesh(name);
}

function createCeilFloorVertices(object, x, y, z) {
var tx = 0.002;
	var ty = 0.002;

	var xs = 0.122;
	var ys = 0.121;

	//BOTTOM
	//object.begin({material:"dirt",renderOperation:4});
	//{
		object.position(x-1.0, y-1.0, z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0,  1, 0);
		object.textureCoord(tx+0,ty+0);

		object.position(x+1.0,y-1.0,z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0,  1, 0);
		object.textureCoord(tx+xs,ty+0);

		object.position(x+1.0, y-1.0, z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0,  1, 0);
		object.textureCoord(tx+xs,ty+ys);

		object.position(x-1.0, y-1.0, z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0,  1, 0);
		object.textureCoord(tx+0,ty+ys);


	//}
	//object.end();

	//TOP
	//object.begin({material:"grass",renderOperation:4});
	//{
		object.position(x-1.0, y+1.0, z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0,-1, 0);
		object.textureCoord(tx+0,ty+0);

		object.position(x+1.0, y+1.0, z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0,-1, 0);
		object.textureCoord(tx+xs,ty+0);

		object.position(x+1.0,  y+1.0,  z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0,-1, 0);
		object.textureCoord(tx+xs,ty+ys);

		object.position(x-1.0,  y+1.0, z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0,-1, 0);
		object.textureCoord(tx+0,ty+ys);


	//}
	//object.end();
}

function createSolidCubeVertices(object, x, y, z) {
var tx = 0.002;
	var ty = 0.002;

	var xs = 0.122;
	var ys = 0.121;

	//BOTTOM
	//object.begin({material:"dirt",renderOperation:4});
	//{
		object.position(x-1.0, y-1.0, z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, -1, 0);
		object.textureCoord(tx+0,ty+0);

		object.position(x+1.0,y-1.0,z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, -1, 0);
		object.textureCoord(tx+xs,ty+0);

		object.position(x+1.0, y-1.0, z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, -1, 0);
		object.textureCoord(tx+xs,ty+ys);

		object.position(x-1.0, y-1.0, z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, -1, 0);
		object.textureCoord(tx+0,ty+ys);


	//}
	//object.end();

	//TOP
	//object.begin({material:"grass",renderOperation:4});
	//{
		object.position(x-1.0, y+1.0, z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, 1, 0);
		object.textureCoord(tx+0,ty+0);

		object.position(x+1.0, y+1.0, z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, 1, 0);
		object.textureCoord(tx+xs,ty+0);

		object.position(x+1.0,  y+1.0,  z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, 1, 0);
		object.textureCoord(tx+xs,ty+ys);

		object.position(x-1.0,  y+1.0, z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, 1, 0);
		object.textureCoord(tx+0,ty+ys);


	//}
	//object.end();


	ty += 0.126;
	tx += 0.125 * 2;

	//if(t == false)
	//tx += 0.126;


	//FRONT
	//object.begin({material:"dirt",renderOperation:4});
	//{
		object.position(x-1.0, y-1.0,  z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, 0, 1);
		object.textureCoord(tx+0,ty+ys);

		object.position(x+1.0, y-1.0,  z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, 0, 1);
		object.textureCoord(tx+xs,ty+ys);

		object.position(x+1.0, y+1.0, z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, 0, 1);
		object.textureCoord(tx+xs,ty+0);

		object.position(x-1.0, y+1.0, z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, 0, 1);
		object.textureCoord(tx+0,ty+0);


	//}
	//object.end();

	//BACK
	//object.begin({material:"dirt",renderOperation:4});
	//{
		object.position(x-1.0, y-1.0, z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, 0, -1);
		object.textureCoord(tx+0,ty+ys);

		object.position(x+1.0, y-1.0, z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, 0, -1);
		object.textureCoord(tx+xs,ty+ys);

		object.position(x+1.0, y+1.0, z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, 0, -1);
		object.textureCoord(tx+xs,ty+0);

		object.position(x-1.0, y+1.0, z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(0, 0, -1);
		object.textureCoord(tx+0,ty+0);


	//}
	//object.end();



	//LEFT
	//object.begin({material:"dirt",renderOperation:4});
	//{
		object.position(x-1.0,y-1.0, z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(-1, 0, 0);
		object.textureCoord(tx+0,ty+ys);

		object.position(x-1.0,y-1.0, z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(-1, 0, 0);
		object.textureCoord(tx+xs,ty+ys);

		object.position(x-1.0, y+1.0, z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(-1, 0, 0);
		object.textureCoord(tx+xs,ty+0);

		object.position(x-1.0, y+1.0, z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal(-1, 0, 0);
		object.textureCoord(tx+0,ty+0);


	//}
	//object.end();



	//RIGHT
	//object.begin({material:"dirt",renderOperation:4});
	//{
		object.position(x+1.0, y-1.0, z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal( 1, 0, 0);
		object.textureCoord(tx+0,ty+ys);

		object.position(x+1.0, y-1.0, z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal( 1, 0, 0);
		object.textureCoord(tx+xs,ty+ys);

		object.position(x+1.0,  y+1.0, z+1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal( 1, 0, 0);
		object.textureCoord(tx+xs,ty+0);

		object.position(x+1.0,  y+1.0, z-1.0);
		object.colour(1.0, 1.0, 1.0, 1.0);
		object.normal( 1, 0, 0);
		object.textureCoord(tx+0,ty+0);


	//}
	//object.end();
}


module.exports.createMesh = createMesh;
module.exports.generate = generate;
module.exports.print = print;
