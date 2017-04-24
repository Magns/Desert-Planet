var Spawner = function () {
  this.time = 0;
  this.minTime = 2;
  this.maxTime = 5;
  this.targetTime;
  this.set();

  this.spawners = [
    1, // 0 Gzorp 1st letter
    0, // 1 Reply to Gzorp
    0, // 2 Message from Gzorp parents
    0, // 3 Reply to parents
    0, // 4 Request confirmation
    0, // 5 Spare parts
    0, // 6 glue
    0  // 7 map
  ];
};
// Reset timer
Spawner.prototype.set = function() {
  this.time = 0;
  this.targetTime = this.minTime
                  + Math.random()*(this.maxTime-this.minTime);
};
Spawner.prototype.update = function (delta) {
  this.time += delta;

  if(this.time >= this.targetTime) {
    this.spawn();
  }
};

Spawner.prototype.spawn = function (special) {
  var special = special;
  var speed = 50+Math.random()*40;
  var angle = Math.random()*2*Math.PI;
  var offset = (cY-radius)*0.5*Math.random()+(cY-radius)*0.5;
  var intersect = pos_from_rotation(angle, -offset);
  var xvel = Math.cos(angle-Math.PI/2)*speed;
  var yvel = Math.sin(angle-Math.PI/2)*speed;
  var distance = 10;
  var startx = intersect.x-Math.cos(angle-Math.PI/2)*distance;
  var starty = intersect.y-Math.sin(angle-Math.PI/2)*distance;
  while (startx > -20 && startx < width+20
      && starty > -20 && starty < height+20) {
    distance += 20;
    startx = intersect.x-Math.cos(angle-Math.PI/2)*distance;
    starty = intersect.y-Math.sin(angle-Math.PI/2)*distance;
  }

  // Choose random active item/message to send
  var actives = [];
  for(var i=0; i<this.spawners.length; i++) {
    if(this.spawners[i]) {
      actives.push(i);
    }
  }

  var message;
  if(special) {
    message = false;
  } else if (actives.length == 0) {
    message = 0; // Spam if message is marked as expired
  } else {
    message = actives[Math.floor(Math.random()*actives.length)];
  }

  if(message && messages[message].special) {
    special = messages[message].special;
  }

  items.push(new Bottle({
    x: startx,
    y: starty,
    xvel: xvel,
    yvel: yvel,
    message: message,
    special: special
  }));

  this.set();
};
