var width = window.innerWidth;
var height = window.innerHeight;
var renderer = new PIXI.autoDetectRenderer(width, height, {
  antialias: true
});
var stage = new PIXI.Container();
document.body.appendChild(renderer.view);

var state = function() {};
var cX = width/2;
var cY = height*0.6;
var radius = 200;
var bg;
// var big;
var planet;
var player;
var items = new Array();
var player_speed = 0.01;
var key = {
  left: false,
  right: false,
  up: false,
  down: false,
  space: false,
  e: false,
  enter: false
};

/*-------- Load resources --------*/
PIXI.loader
    .add("img/man.png")
    .add("img/man_walk.png")
    .add("img/planet.png")
    .add("img/big_planet.png")
    .add("img/projectile.png")
    .add("img/space.png")
    .add("img/sunflower.png")
    .load(setup);

/*-------------------------------------------
                             HELPER FUNCTIONS
-------------------------------------------*/
function pos_from_rotation(rot, offset) {
  var offset = offset || 0;
  return {
    x: Math.cos(rot) * (radius-offset)+cX,
    y: Math.sin(rot) * (radius-offset)+cY
  }
}

/*-------------------------------------------
                                        SETUP

Everything is loaded. Get things ready!
-------------------------------------------*/
function setup() {
  var res = PIXI.loader.resources;

  /*-------- Background --------*/
  bg = new PIXI.Sprite(res["img/space.png"].texture);
  stage.addChild(bg);

  /*-------- Sun --------*/
  sun = new PIXI.Graphics();
  sun.rotation = Math.PI/1.5;
  sun.update = function () {
    this.x = radius*Math.sin(this.rotation)+cX;
    this.y = radius*1.2*Math.cos(this.rotation)+cY - radius*0.6;
    this.rotation += 0.04*delta;
    this.clear();
    this.lineStyle(0);
    this.beginFill(0xEEDD00, 1);
    this.drawCircle(0, 0, 20);
    this.endFill();
  };
  stage.addChild(sun);

  /*-------- Moon --------*/
  moon = new PIXI.Graphics();
  moon.update = function () {
    this.rotation = sun.rotation+Math.PI;
    this.x = radius*Math.sin(this.rotation)+cX;
    this.y = radius*Math.cos(this.rotation)+cY - radius*0.6;
    this.clear();
    this.lineStyle(0);
    this.beginFill(0x999999, 1);
    this.drawCircle(0, 0, 20);
    this.endFill();
  };
  stage.addChild(moon);


  /*-------- Planet --------*/
  planet = new PIXI.Sprite(res["img/planet.png"].texture);
  planet.anchor.set(0.5, 0.5);
  planet.width = radius*2+150;
  planet.height = radius*2+150;
  planet.update = function () {
    this.x = cX;
    this.y = cY;
  };
  stage.addChild(planet);

  /*-------- Player --------*/
  player = new PIXI.Sprite(res["img/man.png"].texture);
  player.speed = 0;
  player.accl = 0.5;
  player.friction = 0.25;
  player.planet_offset = 8;
  player.anchor.set(0.5, 1);
  player.update = function(delta) {
    if(key.left) {
      this.speed -= this.accl;
      this.texture = PIXI.loader.resources["img/man_walk.png"].texture;
    } else if(key.right) {
      this.speed += this.accl;
      this.texture = PIXI.loader.resources["img/man_walk.png"].texture;
    } else {
      this.texture = PIXI.loader.resources["img/man.png"].texture;
    }
    this.speed *= 1-this.friction;
    this.rotation += (this.speed)*delta;

    var coords = pos_from_rotation(this.rotation-Math.PI/2,
                                   this.planet_offset);
    this.x = coords.x;
    this.y = coords.y;

  }
  stage.addChild(player);

  /*-------- Start game --------*/
  state = playing;
}


/*-------------------------------------------
                                    GAME LOOP

Where the magic happens.
-------------------------------------------*/
var now;
var delta;
var previous = new Date().getTime();
function loop () {
  now   = new Date().getTime();
  delta = Math.min(0.8, (now-previous)/1000);
  previous = now;

  window.requestAnimationFrame(loop);
  state(delta);
  renderer.render(stage);
}

// Game is active
function playing(delta) {
  cY = height*0.6 + Math.sin(new Date().getTime()/2000)*8
  cX = width/2;


  sun.update(delta);
  moon.update(delta);
  planet.update(delta);
  // big.update(delta);

  player.update(delta);

  for(var i = 0; i<items.length; i++) {
    items[i].update(delta);
  }

  var i = items.length;
  while (i--) {
    if(items[i].dead) {
      items.splice(i, 1);
    }
  }

  /*
  ------- Move in and out on planet -------
  if(key.up) {
    player.planet_offset--;
    player.height += 0.3;
  } else if(key.down) {
    player.planet_offset++;
    player.height -= 0.3;
  }
  */
}

// Start loop
loop();


/*-------------------------------------------
                              EVENT LISTENERS
Window resized, or keys were pressed. Do
something about it.
-------------------------------------------*/
window.addEventListener("resize", function () {
  width = window.innerWidth;
  height = window.innerHeight;
  if(width > 1920) bg.width = width;
  if(height > 1080) bg.height = height;
  renderer.resize(width, height);
});

window.addEventListener("keydown", function(e) {
  console.log(e.keyCode);
  if(e.keyCode == 37) key["left"] = true;
  if(e.keyCode == 39) key["right"] = true;
  if(e.keyCode == 38) key["up"] = true;
  if(e.keyCode == 40) {
    items.push(new Flower(player.rotation-Math.PI/2, items.length));
  }
  if(e.keyCode == 32) {
    items.push(new Projectile(player.rotation-Math.PI/2, items.length));
  }
});

window.addEventListener("keyup", function(e) {
  if(e.keyCode == 37) key["left"] = false;
  if(e.keyCode == 39) key["right"] = false;
  if(e.keyCode == 38) key["up"] = false;
  if(e.keyCode == 40) key["down"] = false;
});
