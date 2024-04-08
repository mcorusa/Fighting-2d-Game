// 1. Project Setup
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 200,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    idleBack: {
      imageSrc: "./img/samuraiMack/IdleB.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    runBack: {
      imageSrc: "./img/samuraiMack/RunB.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    jumpBack: {
      imageSrc: "./img/samuraiMack/JumpB.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    fallBack: {
      imageSrc: "./img/samuraiMack/FallB.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    attack1Back: {
      imageSrc: "./img/samuraiMack/Attack1B.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    takeHitBack: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouetteB.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
    deathBack: {
      imageSrc: "./img/samuraiMack/DeathB.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 155,
    height: 50,
  },
  dead: false,
  //naturalDirection: true,
});

const enemy = new Fighter({
  position: {
    x: 700,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    idleBack: {
      imageSrc: "./img/kenji/Idleb.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    runBack: {
      imageSrc: "./img/kenji/RunB.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    jumpBack: {
      imageSrc: "./img/kenji/JumpB.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    fallBack: {
      imageSrc: "./img/kenji/FallB.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    attack1Back: {
      imageSrc: "./img/kenji/Attack1Bak.png",
      framesMax: 4,
    },

    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    takeHitBack: {
      imageSrc: "./img/kenji/Take hitB.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
    deathBack: {
      imageSrc: "./img/kenji/DeathB.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
  dead: false,
  //naturalDirection : true
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};
decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255, 255, 255, .16)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();
  playerRestrictions(player);
  playerRestrictions(enemy);

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player Mack movements
  if (keys.a.pressed && player.lastKey === "a") {
    player.naturalDirection = false;
    player.run();

  } else if (keys.d.pressed && player.lastKey === "d") {
    player.naturalDirection = true;
    player.run();
  }
  else{
    player.idle();
  }
  

  if (player.velocity.y < 0) {
    player.jump();
  }

  if (player.velocity.y > 0) {
    player.fall();
  }

  //player Kenji movements
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.naturalDirection = true;
    enemy.run();

  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.naturalDirection = false;
    enemy.run();
  }

  else {
    enemy.idle();
  }
  // if (enemy.velocity.x === 0) {
  //   enemy.idle();
  // }

  if (enemy.velocity.y < 0) {
    enemy.jump();
  }

  if (enemy.velocity.y > 0) {
    enemy.fall();
  }

  
  // detect for collision & Kenji (enemy) gets hit
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    gsap.to("#enemyHealth", {
      width: `${enemy.health}%`,
    });
    console.log("player hits enemy");
  }
  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

// detect for collision & Mack gets hit
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    //document.querySelector("#playerHealth").style.width = `${player.health}%`;
    gsap.to("#playerHealth", {
      width: `${player.health}%`,
    });
    console.log("enemy attack successfull");
  }

  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  // end game based on player's health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate();


window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        //player.velocity.x = 1;// move for 1px for each frame
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        if (player.position.y + player.height >= canvas.height - 96) {
          player.velocity.y = -20;
          playJumpSound();
        }
        break;
      case "s":
        player.attack();
        playAttackSound();
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;

      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;

      case "ArrowUp":
        if (enemy.position.y + enemy.height >= canvas.height - 96) {
          enemy.velocity.y = -20;
          playJumpSound();
        }
        break;

      case "ArrowDown":
        enemy.attack();
        playAttackSound();
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      break;
  }
  //enemy
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});
