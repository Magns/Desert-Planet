var Bottle = function(options) {
  this.message = options.message;
  this.state = "floating"; // floating || falling || landed || opened
  this.xvel = options.xvel;
  this.yvel = options.yvel;
  this.x = options.x;
  this.y = options.y;
  this.relativex = this.x - cX;
  this.relativey = this.y - cY;
  this.friction = 0.99;
  this.rotSpeed = 5*Math.random();

  this.age = 0;
  this.lifetime = 180; // How long should it live floating around space?

  this.sprite = new PIXI.Sprite(res["img/bottle.png"].texture);
  this.sprite.anchor.set(0.5, 0.65);
  this.sprite.rotation = Math.random()*Math.PI*2;

  // this.hitbox = new PIXI.Graphics();
  // this.hitbox.lineStyle(0);
  // this.hitbox.beginFill(0xff00ff, 0.2);
  // this.hitbox.drawCircle(0, 0, 14);
  // this.hitbox.endFill();
  // this.sprite.addChild(this.hitbox);

  if(options.special) {
    this.special = options.special;
    if(this.special == "pizza") {
      this.sprite.texture = res["img/pizza.png"].texture;
      this.sprite.anchor.set(0.5, 0.5);
    }

    if(this.special == "glue") {
      this.sprite.texture = res["img/glue.png"].texture;
    }

    if(this.special == "parts") {
      this.sprite.texture = res["img/computerchip.png"].texture;
    }
  }

  stage.addChild(this.sprite);
};

Bottle.prototype.update = function(delta) {
  this.age += delta;

  if(this.state == "falling") {
    var gravity = gravity_accl(this.x, this.y);
    this.xvel *= this.friction;
    this.yvel *= this.friction;
    this.xvel += gravity.x;
    this.yvel += gravity.y;
  }

  if(onPlanet(this.x, this.y) && this.state != "landed") {
    this.land();
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

Bottle.prototype.land = function() {
  this.state = "landed";
  this.xvel = 0;
  this.yvel = 0;
  this.rotSpeed = 0;
  // this.relativex = this.x - cX;
  // this.relativey = this.y - cY;

  this.interact = function() {
    if(messages[this.message] && messages[this.message].message === false) {
      // This is getting rediculous
      this.message = false;
      // I have completely lost track of messages.
      // Coding at the speed of spaghetti!
    }
    if(this.message !== false) {
      showLetter(this.message);
    }

    if(this.special == "parts") {
      player.inventory.parts++;
      if(player.inventory.parts >= quest.parts) {
        spawner.spawners[5] = 0;
      }
    }

    if(this.special == "glue") {
      player.inventory.glue++;
      if(player.inventory.glue >= quest.glue) {
        spawner.spawners[6] = 0;
      }
    }

    if(this.special == "map") {
      player.inventory.map++;
      if(player.inventory.map >= quest.map) {
        spawner.spawners[7] = 0;
      }
    }

    this.kill();
  }

  if(this.state == "floating" && this.age > this.lifetime) {
    this.kill();
  }
}

Bottle.prototype.hit = function () {
  this.state = "falling";
}

Bottle.prototype.kill = function () {
  stage.removeChild(this.sprite);
  this.dead = true;
};
