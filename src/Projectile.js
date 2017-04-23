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
};
Projectile.prototype.update = function(delta) {
  this.age += delta;
  this.velX *= this.friction;
  this.velY *= this.friction;

  var dy = cY - this.y;
  var dx = cX - this.x;
  var dist = Math.floor(dy*dy+dx*dx);

  var gravity_angle = Math.atan2(dy, dx);
  var gravity = 40;

  var gravityX = Math.cos(gravity_angle)*gravity;
  var gravityY = Math.sin(gravity_angle)*gravity;

  this.velX += gravityX;
  this.velY += gravityY;

  this.x += this.velX*delta;
  this.y += this.velY*delta;

  this.sprite.x = this.x;
  this.sprite.y = this.y;

  if(this.age>2) {
    stage.removeChild(this.sprite);
    this.dead = true;
  }
};
