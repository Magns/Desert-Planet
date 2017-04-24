var width = window.innerWidth;
var height = window.innerHeight;
var renderer = new PIXI.autoDetectRenderer(width, height, {
  antialias: true
});
var res = PIXI.loader.resources;
var bg = new PIXI.Container();
var stage = new PIXI.Container();
var fg = new PIXI.Container();
var container = new PIXI.Container();
container.addChild(bg);
container.addChild(stage);
container.addChild(fg);
document.body.appendChild(renderer.view);

var state = function() {};
var vertical_center = 0.5;
var cX = width/2;
var cY = height*vertical_center;
var radius = 160;
var background;
var planet;
var player;
var sun;
var moon;
var items = new Array();
var bottle;
var letter;
var spawner;
var key = {
  left: false,
  right: false,
  up: false,
  down: false,
  space: false,
  e: false,
  p: false,
  enter: false,
  esc: false
};

/*-------------------------------------------
                                          GUI

All menus, text and buttons.
-------------------------------------------*/

var textStyle = new PIXI.TextStyle({
  fontFamily: 'Ranga',
  fontSize: 24,
  fill: ['#ffffff', '#cccccc']
});

var letterStyle = new PIXI.TextStyle({
  fontFamily: 'Ranga',
  fontSize: 22,
  fill: ['#550077', '#000000']
});

// PAUSED
var pauseGUI = new PIXI.Text('Paused ', textStyle);
pauseGUI.x = 40;
pauseGUI.y = 40;

// MAIN MENU
var mainMenuGUI = new PIXI.Container();

var titleText = new PIXI.Text('-- TITLE --', textStyle);
titleText.anchor.x = 0.5;
mainMenuGUI.addChild(titleText);

var btn_start = new PIXI.Text('Start game', textStyle);
btn_start.anchor.x = 0.5;
btn_start.y = 30;
btn_start.interactive = true;
btn_start.buttonMode = true;
btn_start.on('pointerup', function() {
  fg.removeChild(mainMenuGUI);
  startGame();
});
mainMenuGUI.addChild(btn_start);

var el = renderer.view;
var reqFullScreen = el.requestFullScreen ||
                    el.webkitRequestFullscreen ||
                    el.mozRequestFullScreen ||
                    el.msRequestFullscreen ||
                    false;
if(reqFullScreen) {
  var btn_fullscreen = new PIXI.Text('Fullscreen', textStyle);
  btn_fullscreen.anchor.x = 0.5;
  btn_fullscreen.y = 60;
  btn_fullscreen.interactive = true;
  btn_fullscreen.buttonMode = true;
  btn_fullscreen.on('pointerup', function() {
    if(el.requestFullScreen) {
      el.requestFullScreen()
    } else if (el.webkitRequestFullscreen) {
      el.webkitRequestFullscreen();
    } else if (el.mozRequestFullscreen) {
      el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullScreen();
    } else {
      console.log("I probably messed something up... Use F11 instead.");
    }
  });
  mainMenuGUI.addChild(btn_fullscreen);
}

// Letters and other paper stuff.
var PaperMenu = function(options) {
  this.container = new PIXI.Container();
  this.container.x = width/2;
  this.container.y = height/2;

  var img = options.customBG || "img/note.png";

  this.bg = new PIXI.Sprite(res[img].texture);
  this.bg.anchor.set(0.5, 0.5);

  this.text = new PIXI.Text(options.message, letterStyle);
  this.text.anchor.set(0, 0);
  this.text.x = -128;
  this.text.y = -140;

  this.btn_close = new PIXI.Text(options.closeText, letterStyle);
  this.btn_close.anchor.x = 1;
  this.btn_close.x = 122;
  this.btn_close.y = 122;
  this.btn_close.interactive = true;
  this.btn_close.buttonMode = true;
  this.btn_close.on('pointerup', function() {
    // Ooh, that's dirty
    letter.close();
    options.onRead();
  });

  this.container.addChild(this.bg);
  this.container.addChild(this.text);
  this.container.addChild(this.btn_close);
  stage.addChild(this.container);

  state = reading;
};
PaperMenu.prototype.update = function() {
  this.container.x = width/2;
  this.container.y = height/2;
};
PaperMenu.prototype.close = function() {
  this.container.removeChildren();
  stage.removeChild(this.container);
  state = playing;
};


/*-------- Load resources --------*/
PIXI.loader
    .add("img/man.png")
    .add("img/man_walk.png")
    .add("img/planet_crash.png")
    .add("img/big_planet.png")
    .add("img/projectile.png")
    .add("img/bottle.png")
    .add("img/note.png")
    .add("img/handwritten.png")
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
  // Create background
  background = new PIXI.Sprite(res["img/space.png"].texture);
  bg.addChild(background);

  showMenu();
  // startGame();
  loop();
}

/*-------------------------------------------
                                   START GAME

Reset everything needed and start the game.
-------------------------------------------*/
function startGame() {
  /*-------- Remove things --------*/
  items = [];
  stage.removeChildren();

  /*-------- Start adding things back in --------*/
  // Sun
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

  // Moon
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

  // Planet
  planet = new PIXI.Sprite(res["img/planet_crash.png"].texture);
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

  // Start spawning things
  spawner = new Spawner();

  // Start game
  state = playing;
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

  renderer.render(container);
}

/*-------------------------------------------
                                      PLAYING
Handle all player actions and gameplay.
Called if var state == playing.
-------------------------------------------*/
function playing(delta) {
  if(key["p"] || key["esc"]) {
    key["p"] = false;
    key["esc"] = false;
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
  fg.addChild(pauseGUI);
}

function endPause() {
  state = playing;
  fg.removeChild(pauseGUI);
}

function pause(delta) {
  if(key["p"] || key["esc"]) {
    key["p"] = false;
    key["esc"] = false;
    endPause();
  }
}

/*-------------------------------------------
                                    MAIN MENU

-------------------------------------------*/
function showMenu() {
  state = mainMenu;
  fg.addChild(mainMenuGUI);
}

function mainMenu(delta) {
  mainMenuGUI.x = Math.floor(width/2);
  mainMenuGUI.y = Math.floor(height/2 - mainMenuGUI.height/2);
}

/*-------------------------------------------
                                    MAIN MENU

-------------------------------------------*/
function showLetter (id) {
  letter = new PaperMenu(messages[id]);
}

function hideLetter() {
  letter.close();
}

function reading (delta) {
  letter.update();
}
