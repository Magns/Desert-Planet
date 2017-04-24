var Bottle = function(options) {
  this.state = "floating"; // floating || falling || landed || opened
  this.xvel = options.xvel;
  this.yvel = options.yvel;
  this.x = options.x;
  this.y = options.y;
  this.relativex = this.x - cX;
  this.relativey = this.y - cY;
  this.friction = 0.99;
  this.rotSpeed = 5*Math.random();

  this.sprite = new PIXI.Sprite(res["img/bottle.png"].texture);
  this.sprite.anchor.set(0.5, 0.65);
  this.sprite.height *= 0.4;
  this.sprite.width *= 0.4;
  this.sprite.rotation = Math.random()*Math.PI*2;

  // this.hitbox = new PIXI.Graphics();
  // this.hitbox.lineStyle(0);
  // this.hitbox.beginFill(0xff00ff, 0.2);
  // this.hitbox.drawCircle(0, 0, 14*2.5);
  // this.hitbox.endFill();
  // this.sprite.addChild(this.hitbox);

  stage.addChild(this.sprite);
};

Bottle.prototype.update = function(delta) {
  if(this.state == "falling") {
    var gravity = gravity_accl(this.x, this.y);
    this.xvel *= this.friction;
    this.yvel *= this.friction;
    this.xvel += gravity.x;
    this.yvel += gravity.y;
  }

  if(onPlanet(this.x, this.y) && this.state != "landed") {
    this.state = "landed";
    this.xvel = 0;
    this.yvel = 0;
    this.rotSpeed = 0;
    // this.relativex = this.x - cX;
    // this.relativey = this.y - cY;
  }

  if(this.state == "landed") {
  }

  this.y = cY + this.relativey;
  this.x = cX + this.relativex;

  if(this.x < -50) return this.kill();

  this.relativex += this.xvel*delta;
  this.relativey += this.yvel*delta;

  this.sprite.x = this.x;
  this.sprite.y = this.y;
  this.sprite.rotation += this.rotSpeed*delta;
}

Bottle.prototype.hit = function () {
  this.state = "falling";
}

Bottle.prototype.kill = function () {
  stage.removeChild(this.sprite);
  this.dead = true;
};
