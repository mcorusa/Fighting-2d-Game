class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 6;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold === 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = { offset: {}, width: undefined, height: undefined },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    }); //calls constructor of parent
    

    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 6;
    this.sprites = sprites;
    this.dead = false;
    this.naturalDirection = true;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }
    console.log(this.sprites);
  }

  update() {
    this.draw();
    if (!this.dead) this.animateFrames();
    
    //attack boxes
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    //draw the attack box
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height
    // );

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y; // za svaki frame u loopu na y ce se dodavati 10px

    //gravity function
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
    } else {
      this.velocity.y += gravity;
    }
  }

  run(){
    if (this === player){
      if(player.naturalDirection){
        this.switchSprite("run");
        player.velocity.x = 5
      }
      else{
        this.switchSprite("runBack");
        player.velocity.x = -5
      }
    }
    else if (this === enemy){
      if(enemy.naturalDirection){
        this.switchSprite("run");
        enemy.velocity.x = -5
      }
      else{
        this.switchSprite("runBack");
        enemy.velocity.x = 5
      }
    }
  }

  idle(){
      if (this.naturalDirection) this.switchSprite("idle");
      else this.switchSprite("idleBack");
  }

  jump(){
      if (this.naturalDirection) this.switchSprite("jump");
      else this.switchSprite("jumpBack");
  }

  fall(){
    if (this.naturalDirection) this.switchSprite("fall");
    else this.switchSprite("fallBack");
  }

  attack() {
    if(this === enemy){
      if (enemy.naturalDirection){
        this.switchSprite("attack1");
        this.isAttacking = true;
        this.attackBox.offset.x = -170;
        console.log("Kenji attack");
      }
      else{
        this.switchSprite("attack1Back");
        this.isAttacking = true;
        this.attackBox.offset.x = 70;
        this.attackBox.width = 125;
        console.log("Kenji backwards attack");
      }
    }
    else{
      if(player.naturalDirection){
        this.switchSprite("attack1");
        this.isAttacking = true;
        this.attackBox.offset.x = 100; 
        console.log("mack attacks")
      }
      else{
        this.switchSprite("attack1Back");
        this.isAttacking = true;
        this.attackBox.offset.x = -170; 
        console.log("mack backwards attack");
      }
    }
  }
 

  takeHit() {
    console.log("takes hit")
    this.health -= 10;
    if (this.health <= 0){
      this.naturalDirection ? this.switchSprite("death") : this.switchSprite("deathBack")
      console.log("dead")
    }
    else{
      this.naturalDirection ? this.switchSprite("takeHit") : this.switchSprite("takeHitBack")
    }
  }
  

  switchSprite(sprite) {

    // Don't switch sprite if player is dead
    if (this.image === this.sprites.death.image || this.image === this.sprites.deathBack.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1 ||  this.framesCurrent === this.sprites.deathBack.framesMax - 1)
        this.dead = true;
      return;
    }

    // if (this.isAttacking) {
    //   return; // Don't switch sprite if attacking animation is ongoing
    // }

    if (
      this.sprite === "takeHit" || this.sprite === "takeHitBack" &&
      this.framesCurrent < this.sprites.takeHit.framesMax-1 // Assuming framesMax is known
    ) {
      return;
    }
    //overriding all other animations with the attack animation
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1 || 
      this.image === this.sprites.attack1Back.image &&
      this.framesCurrent < this.sprites.attack1Back.framesMax - 1
    ){
      return;
    }

    // override when fighter gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.framesCurrent < this.sprites.takeHit.framesMax - 1 ||
      this.image === this.sprites.takeHitBack.image &&
      this.framesCurrent < this.sprites.takeHitBack.framesMax - 1
    )
      return;



    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "idleBack":
        if (this.image !== this.sprites.idleBack.image) {
          this.image = this.sprites.idleBack.image;
          this.framesMax = this.sprites.idleBack.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "runBack":
        if (this.image !== this.sprites.runBack.image) {
          this.image = this.sprites.runBack.image;
          this.framesMax = this.sprites.runBack.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "jumpBack":
        if (this.image !== this.sprites.jumpBack.image) {
          this.image = this.sprites.jumpBack.image;
          this.framesMax = this.sprites.jumpBack.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "fallBack":
        if (this.image !== this.sprites.fallBack.image) {
          this.image = this.sprites.fallBack.image;
          this.framesMax = this.sprites.fallBack.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "attack1Back":
        console.log("Switching to attack1Back sprite.");
        if (this.image !== this.sprites.attack1Back.image) {
          this.image = this.sprites.attack1Back.image;
          this.framesMax = this.sprites.attack1Back.framesMax;
          this.framesCurrent = 0;
        }
        break;

      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.framesCurrent = 0;
          // if (this.framesCurrent === this.sprites.takeHit.framesMax) {
          //   this.isAttacking = false;
          // }
          console.log(`${this} takes hit`)
        }
        break;
      case "takeHitBack":
        if (this.image !== this.sprites.takeHitBack.image) {
          this.image = this.sprites.takeHitBack.image;
          this.framesMax = this.sprites.takeHitBack.framesMax;
          this.framesCurrent = 0;
          // if (this.framesCurrent === this.sprites.takeHitBack.framesMax) {
          //      this.isAttacking = false;
          // }
          console.log(`${this} takes backwards hit`)
        }
        break;


    //   case "takeHit":
    //   if (this.image !== this.sprites.takeHit.image) {
    //     // ... existing logic for setting image and frames
    //     console.log(`${this} takes hit`);
    //   }
    //   // Set isAttacking to false only for takeHit animation
    //   if (this.framesCurrent === this.sprites.takeHit.framesMax) {
    //     this.isAttacking = false;
    //   }
    //   break;
    // case "takeHitBack":
    //   // ... existing logic for setting image and frames
    //   console.log(`${this} takes backwards hit`);
    //   // Set isAttacking to false only for takeHitBack animation
    //   if (this.framesCurrent === this.sprites.takeHitBack.framesMax) {
    //     this.isAttacking = false;
    //   }
    //   break;


      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "deathBack":
        if (this.image !== this.sprites.deathBack.image) {
          this.image = this.sprites.deathBack.image;
          this.framesMax = this.sprites.deathBack.framesMax;
          this.framesCurrent = 0;
        }
        break;
      case "alive":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.framesCurrent = 0;
        }
        break;
    
    }
  }
}

