// 1. Project Setup

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// resize canvas 16:9
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

// 2. Create Player and Enemy

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
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
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
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
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
});


//playFightSound();
// kad imamo objekte koji ce se pomjerati onda obicno za svojstvo dodamo velocity i gravity (idemo napraviti funkciju animate)

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

//*************************************************************/
function playerRestrictions(character) {
  if (character.position.x < 0) {
    character.position.x = 0;
  } else if (character.position.x + character.width > canvas.width) {
    character.position.x = canvas.width - character.width;
  }

  if (character.position.y < -145) {
    character.position.y = -145;
  }
}

//*************************************************************/




function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255, 255, 255, .15)";
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  enemy.update();

  playerRestrictions(player);
  playerRestrictions(enemy);

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  //jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
  //jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  // detect for collision & enemy gets hit

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
    //enemy.health -= 20;
    //enemy.health -= 10;
    //document.querySelector("#enemyHealth").style.width = `${enemy.health}%`;
    gsap.to("#enemyHealth", {
      width: `${enemy.health}%`,
    });
    console.log("player go");
  }
  // if player misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false;
  }

  //this is where our player gets hit

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

// beskonacna petlja funkcija poziva samu sebe
animate();

// 3. Move Characters with Event Listeners

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
    switch (event.key) {
      case "d":
        //player.velocity.x = 1;// pomjera se za 1px za svaki frame u animate petlji
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        //player.velocity.x = -1;
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        if (player.position.y + player.height >= canvas.height - 96)
          player.velocity.y = -20;
          playJumpSound();
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
        if (enemy.position.y + enemy.height >= canvas.height - 96)
          enemy.velocity.y = -20;
          playJumpSound();
        break;
      case "ArrowDown":
        //enemy.isAttacking = true;
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

// 4. Atacks

// 5. Health bar

// 6. Game timers and game over

function resetGame() {
  console.log("Restarting...");
  playFightSound();

  // Hiding final score visual representation due to starting new game
  document.querySelector("#result-container").style.display = "none";

  // In order to start game as "not dead", we're switching sprite to starting sprite; idle and dead to false
  aliveAll();

  // Reseting starting positions
  player.position.x = 200;
  player.position.y = 0;
  enemy.position.x = 700;
  enemy.position.y = 100;

  // Reseting health and HTML Health bar
  player.health = 100;
  enemy.health = 100;
  document.querySelector("#playerHealth").style.width = "100%";
  document.querySelector("#enemyHealth").style.width = "100%";

  player.update();
  enemy.update();

  // Reseting timer and HTML timer representation
  clearTimeout(timerId);
  timer = 60;
  document.querySelector("#timer").innerHTML = timer;
  decreaseTimer();
}

document.getElementById("btn").addEventListener("click", resetGame);




