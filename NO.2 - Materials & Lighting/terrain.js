///
///  Name: Node.js, Ogre, Textures Demo
///  File: terrain.js
///  Date: 2013-01-04
///  Author: Christian Westman 
///  Web: http://techny.tumblr.com
///  Email: creamdog@creamdog.se
///  Twitter: @westmaaan
///
///  Description: textures and basic terrain generator
///
///

function createTerrainMesh(name, meshName) {

	var object = sceneManager.createManualObject(name);
	object.setDynamic(false);

	var d = 128;
	var t = [];

	for(var x=0;x<d;x++) {
		t[x] = [];
		for(var y=0;y<d;y++) {
			t[x][y] = [];
			for(var z=0;z<d;z++) {
				t[x][y][z] = false;
			}
		}
	}

	for(var y=0;y<d;y++) {
	for(var x=0;x<d;x++) {
	for(var z=0;z<d;z++) {
		if(y==0) {
			t[x][y][z] = true;
			continue;
		}
		t[x][y][z] = Math.random() < 0.5 && t[x][y-1][z] == true;
	}
	}
	}

	function count(x,z) {
		for(var y=0;y<d;y++) {
			if(t[x][y][z] == false)
				return y-1;
		}
		return d-1;
	}

	function set(a,x,z,h) {
		for(var y=0;y<d;y++) {
			if(y <= h) {
				a[x][y][z] = true;
			} else {
				a[x][y][z] = false;
			}
		}
	}


	for(var i=0;i<1;i++) {
		var a = [];
		for(var x=0;x<d;x++) {
			a[x] = [];
			for(var y=0;y<d;y++) {
				a[x][y] = [];
				for(var z=0;z<d;z++) {
					a[x][y][z] = false;
				}
			}
		}
		for(var x=0;x<d;x++) {
		for(var z=0;z<d;z++) {
			var n = 1;
			var val = count(x,z);
			if(x > 0) {
				n++;
				val += count(x-1,z);
			}
			if(x < d-1) {
				n++;
				val += count(x+1,z);
			}
			if(z > 0) {
				n++;
				val += count(x,z-1);
			}
			if(z < d-1) {
				n++;
				val += count(x,z+1);
			}
			val = Math.ceil(val / n);

			if(val == Number.NaN)
				console.log('number is NAN');
			set(a,x,z,val);
		}
		}
		t = a;
	}

	console.log(t.length, t[0].length, t[0][0].length);

	console.log("generating terrain..");


	object.begin({material:"textures",renderOperation:4});
	

	for(var y=0;y<d;y++) {
	for(var x=0;x<d;x++) {
	for(var z=0;z<d;z++) {

		if(typeof(t[x][y][z]) == 'undefined')
		{
			console.log("undefined");
		}
		if(t[x][y][z] == false)
			continue;
		//console.log(x,y,z);
		createCubeMesh2(object, x*2-(d), y*2 ,z*2-(d), y < d-1 && t[x][y+1][z] == true);
	}
	}
	}




	console.log("generating terrain triangles..");

	var i=0;
	for(var y=0;y<d;y++) {
	for(var x=0;x<d;x++) {
	for(var z=0;z<d;z++) {

		if(t[x][y][z] == false)
			continue;

		//bottom
		if((y>0 && t[x][y-1][z] == false) || y == 0) {
			object.triangle(i+0,i+1,i+2);
			object.triangle(i+2,i+3,i+0);
		}
		i+=4;
		//top
		if(y<d-1 && t[x][y+1][z] == false) {
			object.triangle(i+2,i+1,i+0);
			object.triangle(i+0,i+3,i+2);
		}
		i+=4;
		//front
		if(z < d-1 && t[x][y][z+1] == false) {
			object.triangle(i+0,i+1,i+2);
			object.triangle(i+2,i+3,i+0);
		}
		i+=4;
		//back
		if(z > 0 && t[x][y][z-1] == false) {
			object.triangle(i+2,i+1,i+0);
			object.triangle(i+0,i+3,i+2);
		}
		i+=4;
		//left
		if(x > 0 && t[x-1][y][z] == false) {
			object.triangle(i+0,i+1,i+2);
			object.triangle(i+2,i+3,i+0);
		}
		i+=4;
		//right
		if(x < d-1 && t[x+1][y][z] == false) {
			object.triangle(i+2,i+1,i+0);
			object.triangle(i+0,i+3,i+2);
		}
		i+=4;
	}
	}
	}


	object.end();

	console.log("generating terrain.. done!");

	object.convertToMesh(meshName);
}

function createCubeMesh2(object, x, y, z, t) {

	//magic texture offsets
	var tx = 0.004;
	var ty = 0.004;
	var xs = 0.120;
	var ys = 0.120;

	//BOTTOM
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

	//TOP
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

	ty += 0.126;

	if(t == false)
	tx += 0.126;


	//FRONT
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

	//BACK
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

	//LEFT
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

	//RIGHT
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
}

module.exports.createTerrainMesh = createTerrainMesh;