function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function aliveAll() {
  player.dead = false;
  player.image = player.sprites.idle.image;
  player.framesMax = player.sprites.idle.framesMax;
  player.framesCurrent = 0;

  player.switchSprite("idle");

  enemy.dead = false;
  enemy.image = enemy.sprites.idle.image;
  enemy.framesMax = enemy.sprites.idle.framesMax;
  enemy.framesCurrent = 0;
  enemy.switchSprite("idle");
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#result-container").style.display = "flex";
  if (player.health === enemy.health) {
    document.querySelector("#result").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector("#result").innerHTML = "Player 1 Wins";
  } else if (player.health < enemy.health) {
    document.querySelector("#result").innerHTML = "Player 2 Wins";
  }
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

function playFightSound() {
  const soundFilePath = "sound/fight.mp3";
  const fightSound = new Audio(soundFilePath);
  fightSound.currentTime = 0;
  fightSound.play();
}

function playAttackSound() {
  const soundFilePath = "../sound/sword-sound.mp3";
  const attackSound = new Audio(soundFilePath);
  attackSound.currentTime = 0;
  attackSound.play();
}
function playJumpSound() {
  const soundFilePath = "../sound/jump.mp3";
  const jumpSound = new Audio(soundFilePath);
  jumpSound.currentTime = 0;
  jumpSound.play();
}

window.addEventListener('load', function() {
  const playAudioButton = document.getElementById('play-btn');
  const audio = new Audio('../sound/Paths-of-a-Samurai.mp3');
  let isMuted = true; // Postavljamo na true jer želimo da bude "unmuted" prvi put
  
  playAudioButton.addEventListener('click', function() {
      if (isMuted) {
          audio.play();
          playAudioButton.textContent = '🔇';
      } else {
          audio.pause();
          playAudioButton.textContent = '🔈';
      }
      isMuted = !isMuted;
  });
});

