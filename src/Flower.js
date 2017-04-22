/*-------- Flower --------*/
var res = PIXI.loader.resources;

var Flower = function(rot) {
  this.rotation = rot;
  this.height = 2;
  this.maxHeight = Math.random()*8 + 40;
  this.stalk = new PIXI.Graphics();
  // Sunflower == 30x30 px
  this.flower = new PIXI.Sprite(res["img/sunflower.png"].texture);
  this.flower.anchor.set(0.5, 0.5);
  stage.addChild(this.stalk);
  stage.addChild(this.flower);
};
Flower.prototype.update = function () {
  if(this.height < this.maxHeight) {
    this.height += 0.2;
  }
  var progress = this.height/this.maxHeight;
  this.flower.width = 30*progress;
  this.flower.height = 30*progress;
  this.x = pos_from_rotation(this.rotation, 2).x;
  this.y = pos_from_rotation(this.rotation, 2).y;
  var toX = pos_from_rotation(this.rotation, -this.height).x;
  var toY = pos_from_rotation(this.rotation, -this.height).y;

  this.flower.x = toX;
  this.flower.y = toY;

  this.stalk.clear();
  this.stalk.lineStyle(2, 0x55bb22, 1);
  this.stalk.moveTo(this.x, this.y);
  this.stalk.lineTo(toX,toY);
  this.stalk.endFill();
};
