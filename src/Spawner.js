var Spawner = function () {
  this.time = 0;
  this.minTime = 2;
  this.maxTime = 5;
  this.targetTime;
  this.set();
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


    items.push(new Bottle({
      x: startx,
      y: starty,
      xvel: xvel,
      yvel: yvel
    }));
    this.set();
  }
};
