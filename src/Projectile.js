/*-------- Projectile --------*/
var Projectile = function(rotation, force, direction) {
  this.x = pos_from_rotation(rotation, -30).x;
  this.y = pos_from_rotation(rotation, -30).y;
  this.sprite = new PIXI.Sprite(res["img/projectile.png"].texture)
  stage.addChild(this.sprite);
  this.dir = direction;
  this.startVel = 1000*force;
  this.friction = 0.99;
  this.velX = Math.cos(this.dir)*this.startVel;
  this.velY = Math.sin(this.dir)*this.startVel;
  this.age = 0;
  // this.point = new PIXI.Point(this.x, this.y);
};
// Update
Projectile.prototype.update = function(delta) {
  this.age += delta;
  this.velX *= this.friction;
  this.velY *= this.friction;

  var gravity = gravity_accl(this.x, this.y);

  this.velX += gravity.x;
  this.velY += gravity.y;

  this.x += this.velX*delta;
  this.y += this.velY*delta;

  // this.point.x = this.x;
  // this.point.y = this.y;

  for(var i = 0; i<items.length; i++) {
    var t = items[i];
    if(distance(this.x, this.y, t.x, t.y) < 14 && t.hit) {
        t.hit();
    }
  }

  this.sprite.x = this.x;
  this.sprite.y = this.y;

  if(onPlanet(this.x, this.y)) {
    stage.removeChild(this.sprite);
    this.dead = true;
  }
};
