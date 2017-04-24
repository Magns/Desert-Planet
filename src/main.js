var width = window.innerWidth;
var height = window.innerHeight;
var renderer = new PIXI.autoDetectRenderer(width, height, {
  antialias: true
});
var res = PIXI.loader.resources;
var stage = new PIXI.Container();
document.body.appendChild(renderer.view);

var state = function() {};
var vertical_center = 0.5;
var cX = width/2;
var cY = height*vertical_center;
var radius = 160;
var bg;
var planet;
var player;
var items = new Array();
var bottle;
var spawner;
var key = {
  left: false,
  right: false,
  up: false,
  down: false,
  space: false,
  e: false,
  p: false,
  enter: false
};
var textStyle = new PIXI.TextStyle({
  fontFamily: 'Ranga',
  fontSize: 24,
  fill: ['#ffffff', '#cccccc']
});
var pauseGUI = new PIXI.Text('Paused', textStyle);
pauseGUI.x = 40;
pauseGUI.y = 40;

/*-------- Load resources --------*/
PIXI.loader
    .add("img/man.png")
    .add("img/man_walk.png")
    .add("img/planet.png")
    .add("img/big_planet.png")
    .add("img/projectile.png")
    .add("img/bottle.png")
 // .add("img/arrow.png")
    .add("img/power_bar_empty.png")
    .add("img/power_bar_fill.png")
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

function gravity_accl(x,y) {
  var dy = cY - y;
  var dx = cX - x;
  var dist = Math.floor(dy*dy+dx*dx);

  var gravity_angle = Math.atan2(dy, dx);
  var gravity = 8;

  var gravityX = Math.cos(gravity_angle)*gravity;
  var gravityY = Math.sin(gravity_angle)*gravity;
  return {
    x: gravityX,
    y: gravityY
  }
}

function distance(x1,y1,x2,y2) {
  var dx = x2-x1;
  var dy = y2-y1;
  return Math.sqrt(dx*dx+dy*dy);
}

function onPlanet(x,y) {
    var planet_dist = distance(cX,cY,x,y);
    return planet_dist < radius;
}

/*-------------------------------------------
                                        SETUP

Everything is loaded. Get things ready!
-------------------------------------------*/
function setup() {
  /*-------- Background --------*/
  bg = new PIXI.Sprite(res["img/space.png"].texture);
  stage.addChild(bg);

  /*-------- Sun --------*/
  sun = new PIXI.Graphics();
  sun.rotation = Math.PI/1.5;
  sun.update = function () {
    this.x = radius*Math.sin(this.rotation)+cX;
    this.y = radius*1.2*Math.cos(this.rotation)+cY - radius*0.6;
    this.rotation += 0.02*delta;
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
  planet.width = radius*2.7;
  planet.height = radius*2.7;
  planet.update = function () {
    this.x = cX;
    this.y = cY;
  };
  stage.addChild(planet);

  // Create player
  player = new Player();

  // Spawn bottles
  spawner = new Spawner();

  // Start game
  state = playing;
}

/*-------------------------------------------
                                   START GAME
Reset everything needed and start the game.
-------------------------------------------*/
function startGame() {

}

/*-------------------------------------------
                                    GAME LOOP

Where the magic happens.
-------------------------------------------*/
var now;
var delta;
var previous = new Date().getTime();
var totaltime = 0;
function loop () {
  now   = new Date().getTime();
  delta = Math.min(0.8, (now-previous)/1000);
  previous = now;
  window.requestAnimationFrame(loop);

  cY = height*vertical_center + Math.sin(totaltime/3)*10
  cX = width/2;

  state(delta);

  renderer.render(stage);
}

/*-------------------------------------------
                                      PLAYING
Handle all player actions and gameplay.
Called if var state == playing.
-------------------------------------------*/
function playing(delta) {
  if(key["p"]) {
    key["p"] = false;
    return startPause();
  }

  totaltime += delta;

  sun.update(delta);
  moon.update(delta);
  planet.update(delta);
  spawner.update(delta);
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
}

/*-------------------------------------------
                                       PAUSED
Simple... Don't do anything.
-------------------------------------------*/
function startPause() {
  state = pause;
  stage.addChild(pauseGUI);
}

function endPause() {
  state = playing;
  stage.removeChild(pauseGUI);
}

function pause(delta) {
  if(key["p"]) {
    key["p"] = false;
    endPause();
  }
}

/*-------------------------------------------

              LET THE GAMES BEGIN!

-------------------------------------------*/
startGame();
loop();
