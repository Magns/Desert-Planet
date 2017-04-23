var Player = function() {
  // Create sprites
  this.container = new PIXI.Container();
  this.character = new PIXI.Sprite(res["img/man.png"].texture);
  this.power_bar = new PIXI.Sprite(res["img/power_bar_empty.png"].texture);
  this.power_bar_fill = new PIXI.Sprite(res["img/power_bar_fill.png"].texture);

  // Set sprite positions
  this.character.anchor.set(0.5, 1);
  this.power_bar.anchor.set(1, 1);
  this.power_bar_fill.anchor.set(1, 1);
  this.power_bar.x = -10;
  this.power_bar_fill.x = -10;

  // Player variables
  this.rotation = 0;
  this.speed = 0;
  this.accl = 0.5;
  this.friction = 0.25;
  this.planet_offset = 8;
  this.charge = 0;

  // Add sprites to stage
  this.container.addChild(this.character);
  this.container.addChild(this.power_bar);
  this.container.addChild(this.power_bar_fill);
  stage.addChild(this.container);
}

/*--------------------------------------------------
                                         UPDATE LOOP
Called on each pass of the game loop. Handle
movement, animation, and actions.
--------------------------------------------------*/
Player.prototype.update = function(delta) {
  if(key.left) {
    this.speed -= this.accl;
    // TODO: OMG BETTER ANIMATION PLEASE
    this.character.texture = Math.random()>0.5 ? res["img/man_walk.png"].texture : res["img/man.png"].texture;
    this.container.scale.x = -1;
  } else if(key.right) {
    this.speed += this.accl;
    this.character.texture = Math.random()>0.5 ? res["img/man_walk.png"].texture : res["img/man.png"].texture;
    this.container.scale.x = 1;
  } else {
    this.character.texture = res["img/man.png"].texture;
  }
  this.speed *= 1-this.friction;
  this.rotation += (this.speed)*delta;

  var coords = pos_from_rotation(this.rotation-Math.PI/2,
                                 this.planet_offset);
  this.container.x = coords.x;
  this.container.y = coords.y;
  this.container.rotation = this.rotation;

  /*--------------------------------------------------
                                              THROWING
  Throwing or shooting whatever it is you do
  to get a hold of those darn bottles.
  --------------------------------------------------*/

  if(key["space"]) {
    this.charge += delta;
    this.power_bar.alpha = 1;
  } else {
    // Hide bar when not charging
    this.power_bar.alpha = 0;
    // Shoot if charged up
    if(this.charge > 0) {
      var angle = this.rotation+this.container.scale.x*Math.PI*0.5-Math.PI/2;
      items.push(new Projectile(this.rotation-Math.PI/2,
                                this.charge,
                                angle)
                );
      this.charge = 0;
    }
  }

  // TODO: Mask out power bar fill
  this.power_bar_fill.scale.y = this.charge;
}
