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


function alive(character) {
  character.dead = false;
  character.image = character.sprites.idle.image;
  character.framesMax = character.sprites.idle.framesMax;
  character.framesCurrent = 0;
  character.switchSprite("idle");
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



//*************************************************************/
function playerRestrictions(character) {
  if (character.position.x < 0) {
    character.position.x = 0;
  } else if (character.position.x + character.width > canvas.width) {
    character.position.x = canvas.width - character.width;
  }
}
//*************************************************************/


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
  let isMuted = true;
  
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

document.getElementById("btn").addEventListener("click", resetGame);

function resetGame() {
    console.log("Restarting...");
    playFightSound();
  
    // Hiding final score visual representation due to starting new game
    document.querySelector("#result-container").style.display = "none";
  
    // In order to start game as "not dead", we're switching sprite to starting sprite; idle and dead to false
    alive(player);
    alive(enemy);
  
    // Reseting starting positions
    player.position.x = 200;
    player.position.y = 0;
    enemy.position.x = 700;
    enemy.position.y = 100;
  
    player.naturalDirection = true;
    enemy.naturalDirection = true;
  
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



