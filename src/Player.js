/*--------------------------------------------------
                                              PLAYER

Not a very good pilot.
--------------------------------------------------*/
var Player = function() {
  // Add sprites
  this.container = new PIXI.Container();
  this.character = new PIXI.Sprite(res["img/man.png"].texture);
  this.power_bar = new PIXI.Sprite(res["img/power_bar_empty.png"].texture);
  this.power_bar_fill = new PIXI.Sprite(res["img/power_bar_fill.png"].texture);
  this.power_mask = new PIXI.Graphics();
  this.power_bar_fill.mask = this.power_mask;

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
  this.maxCharge = 2; // In seconds
  this.useDistance = 32; // How far you can interact with objects
  this.reply = false;
  this.inventory = {
    parts: 0,
    glue: 0,
    map: 0
  }

  // Add sprites to stage
  this.container.addChild(this.character);
  this.container.addChild(this.power_bar);
  this.container.addChild(this.power_bar_fill);
  this.container.addChild(this.power_mask);
  stage.addChild(this.container);
}

/*--------------------------------------------------
                                         UPDATE LOOP
Called on each pass of the game loop. Handle
movement, animation, and actions.
--------------------------------------------------*/
Player.prototype.update = function(delta) {
  /*--------------------------------------------------
                                              Walking
  Walk around the planet. Just rotate him around
  the center of the planet.
  --------------------------------------------------*/
  if(key.left && state == playing) {
    this.speed -= this.accl;
    // TODO: OMG BETTER ANIMATION PLEASE
    this.character.texture = Math.random()>0.5 ? res["img/man_walk.png"].texture : res["img/man.png"].texture;
    this.container.scale.x = -1;
  } else if(key.right && state == playing) {
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
                                              INTERACT
  Use objects.
  --------------------------------------------------*/
  if(key["e"] && state == playing) {
    key["e"] = false;
    var nearest = false;
    var nearest_dist = false;
    for(var i=0; i<items.length; i++) {
      var t = items[i];
      if(t.interact) {
        var dist = distance(this.container.x, this.container.y, t.x, t.y);
        if(!nearest || nearest_dist > dist) {
          nearest = t;
          nearest_dist = dist;
        }
      }
    }

    if(nearest_dist && nearest_dist < this.useDistance) {
      nearest.interact();
    }
  }

  /*--------------------------------------------------
                                              THROWING
  Throwing or shooting whatever it is you do
  to get a hold of those darn bottles.
  --------------------------------------------------*/
  var charge_percent = this.charge/this.maxCharge;

  if(key["space"] && state == playing) {
    this.charge += delta;
    if(this.charge > this.maxCharge) {
      this.charge = this.maxCharge;
    }

    this.power_bar.alpha = 1;
  } else {
    // Hide bar when not charging
    this.power_bar.alpha = 0;
    // Shoot if charged up
    if(this.charge > 0) {
      var angle = this.rotation-Math.PI/2 //         <-- UP
          +this.container.scale.x * Math.PI*0.35; // <-- left/right * angle
      items.push(new Projectile(this.rotation-Math.PI/2,
                                charge_percent,
                                angle,
                                this.reply)
                );
      this.reply = false;
      this.charge = 0;
    }
  }

  // Mask out the power meter fill
  this.power_mask.clear();
  this.power_mask.lineStyle(1, 0xFF00FF, 0.8);
  this.power_mask.beginFill(0x00ff00, 0.3);
  this.power_mask.moveTo(0, 0);
  this.power_mask.lineTo(-30, 0);
  this.power_mask.lineTo(-30, -charge_percent*53);
  this.power_mask.lineTo(0, -charge_percent*53);
  this.power_mask.lineTo(0, 0);

}
