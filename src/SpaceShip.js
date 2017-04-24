var SpaceShip = function() {
  this.sprite = new PIXI.Sprite(res["img/ship.png"].texture);
  this.sprite.x = cX+100;
  this.sprite.y = cY+100;
  this.sprite.width *= 0.6;
  this.sprite.height *= 0.6;
  this.sprite.anchor.set(0.5, 0.5);
  this.vx = 0;
  this.vy = 0;
  stage.addChild(this.sprite);
  this.age = 0;
  this.gone = false;
};
SpaceShip.prototype.update = function(delta) {
  this.sprite.x -= this.vx;
  this.sprite.y -= this.vy;
  this.vx += 1*delta*1.5;
  this.vy += 0.4*delta*1.5;
  this.age+= delta;

  if(this.age > 6) {
    this.gone = true;
  }
};
