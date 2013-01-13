///
///  Name: Node.js, Ogre3D, Mouse & Keyboard input using OIS, generating a maze, Demo
///  File: rng.js
///  Date: 2013-01-13
///  Author: Christian Westman 
///  Web: http://techny.tumblr.com
///  Email: creamdog@creamdog.se
///  Twitter: @westmaaan
///
///  Description: Linear congruential generator - http://en.wikipedia.org/wiki/Linear_congruential_generator
///

m = (48*2)*(48*2) - 1;
a = 1*7*47 + 1;
c = 100;
state = 0;

function seed(s)
{
  state = s ? s : Math.floor(Math.random() * (m-1));
}

function nextInt() {
  state = (a * state + c) % m;
  return state;
}

function nextFloat() {
  return nextInt() / (m - 1);
}

function nextRange(start, end) {
  var rangeSize = end - start;
  var randomUnder1 = nextInt() / m;
  return start + Math.floor(randomUnder1 * rangeSize);
}

function choice(array) {
  return array[nextRange(0, array.length)];
}

module.exports.seed = seed;
module.exports.nextInt = nextInt;
module.exports.nextFloat = nextFloat;
module.exports.nextRange = nextRange;
module.exports.choice = choice;