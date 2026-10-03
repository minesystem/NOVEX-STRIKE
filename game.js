/* =========================
   NØV3X STRIKE
   V5 MULTI-ENEMY GAME
========================= */

const playBtn = document.getElementById("playBtn");
const menu = document.getElementById("menu");
const game = document.getElementById("game");

const shootBtn = document.getElementById("shootBtn");
const reloadBtn = document.getElementById("reloadBtn");

const healthText = document.getElementById("health");
const armorText = document.getElementById("armor");
const scoreText = document.getElementById("score");
const ammoText = document.getElementById("ammo");

const message = document.getElementById("message");
const muzzleFlash = document.getElementById("muzzleFlash");
const hitMarker = document.getElementById("hitMarker");
const damageOverlay = document.getElementById("damageOverlay");

const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");


/* =========================
   PLAYER
========================= */

let health = 100;
let armor = 100;

let score = 0;

let ammo = 30;

let playing = false;
let reloading = false;


/* =========================
   MOVEMENT
========================= */

let joystickActive = false;

let joystickX = 0;
let joystickY = 0;

let playerX = 50;
let playerY = 50;


/* =========================
   GAME LOOP
========================= */

let gameLoop;

let enemyAttackTimer;


/* =========================
   START GAME
========================= */

playBtn.addEventListener(
  "click",
  startGame
);


function startGame() {

  menu.classList.add("hidden");

  game.classList.remove("hidden");


  health = 100;

  armor = 100;

  score = 0;

  ammo = 30;


  playerX = 50;

  playerY = 50;


  playing = true;

  reloading = false;


  updateHUD();


  /*
    Start the new
    multi-enemy system.
  */

  if (
    typeof startMultipleEnemies ===
    "function"
  ) {

    startMultipleEnemies();

  }


  showMessage(
    "MISSION START"
  );


  startGameLoop();


  startEnemyAttackSystem();

}


/* =========================
   HUD
========================= */

function updateHUD() {

  healthText.textContent =
    Math.max(0, health);

  armorText.textContent =
    Math.max(0, armor);

  scoreText.textContent =
    score;

  ammoText.textContent =
    ammo;

}


/* =========================
   GAME LOOP
========================= */

function startGameLoop() {

  cancelAnimationFrame(gameLoop);


  function loop() {

    if (!playing) return;


    movePlayer();

    updateWorld();


    gameLoop =
      requestAnimationFrame(loop);

  }


  loop();

}


/* =========================
   PLAYER MOVEMENT
========================= */

function movePlayer() {

  if (!joystickActive)
    return;


  const speed = 0.10;


  playerX +=
    joystickX * speed;

  playerY +=
    joystickY * speed;


  playerX =
    Math.max(
      5,
      Math.min(
        95,
        playerX
      )
    );


  playerY =
    Math.max(
      5,
      Math.min(
        95,
        playerY
      )
    );

}


/* =========================
   WORLD CAMERA
========================= */

function updateWorld() {

  const battlefield =
    document.getElementById(
      "battlefield"
    );


  if (!battlefield)
    return;


  const cameraX =
    (playerX - 50) * -2;


  const cameraY =
    (playerY - 50) * -1.5;


  battlefield.style.transform =
    `translate(
      ${cameraX}px,
      ${cameraY}px
    )`;

}


/* =========================
   MESSAGE
========================= */

function showMessage(text) {

  message.textContent =
    text;


  setTimeout(() => {

    if (
      message.textContent ===
      text
    ) {

      message.textContent =
        "";

    }

  }, 1000);

}


/* =========================
   SHOOT
========================= */

function shoot(event) {

  if (event) {

    event.preventDefault();

  }


  if (!playing)
    return;


  if (reloading)
    return;


  if (ammo <= 0) {

    showMessage(
      "RELOAD!"
    );

    return;

  }


  ammo--;

  updateHUD();


  muzzle();


  /*
    Find the enemy closest
    to the crosshair.
  */

  if (
    typeof getTargetEnemy ===
    "function"
  ) {

    const target =
      getTargetEnemy();


    if (target) {

      /*
        Each shot does
        50 damage.
      */

      damageEnemy(
        target,
        50
      );


      showHitMarker();


    } else {

      showMessage(
        "MISS"
      );

    }

  }

}


/* =========================
   MUZZLE FLASH
========================= */

function muzzle() {

  muzzleFlash.style.opacity =
    "1";


  setTimeout(() => {

    muzzleFlash.style.opacity =
      "0";

  }, 70);

}


/* =========================
   HIT MARKER
========================= */

function showHitMarker() {

  hitMarker.style.opacity =
    "1";


  setTimeout(() => {

    hitMarker.style.opacity =
      "0";

  }, 160);

}


/* =========================
   ENEMY ATTACK SYSTEM
========================= */

function startEnemyAttackSystem() {

  clearInterval(
    enemyAttackTimer
  );


  enemyAttackTimer =
    setInterval(() => {

      if (!playing)
        return;


      if (
        typeof enemiesAttack ===
        "function"
      ) {

        enemiesAttack();

      }

    }, 2600);

}


/* =========================
   DAMAGE EFFECT
========================= */

function showDamageEffect() {

  damageOverlay.style.opacity =
    "1";


  setTimeout(() => {

    damageOverlay.style.opacity =
      "0";

  }, 180);

}


/* =========================
   RELOAD
========================= */

function reload(event) {

  if (event) {

    event.preventDefault();

  }


  if (!playing)
    return;


  if (reloading)
    return;


  if (ammo === 30) {

    showMessage(
      "MAGAZINE FULL"
    );

    return;

  }


  reloading = true;


  showMessage(
    "RELOADING..."
  );


  setTimeout(() => {

    if (!playing)
      return;


    ammo = 30;

    reloading = false;


    updateHUD();


    showMessage(
      "READY"
    );

  }, 1200);

}


/* =========================
   JOYSTICK
========================= */

joystick.addEventListener(
  "touchstart",
  startJoystick,
  { passive: false }
);


joystick.addEventListener(
  "touchmove",
  moveJoystick,
  { passive: false }
);


joystick.addEventListener(
  "touchend",
  stopJoystick,
  { passive: false }
);


function startJoystick(event) {

  event.preventDefault();

  joystickActive = true;

  moveJoystick(event);

}


function moveJoystick(event) {

  if (!joystickActive)
    return;


  event.preventDefault();


  const touch =
    event.touches[0];


  const rect =
    joystick.getBoundingClientRect();


  const centerX =
    rect.left +
    rect.width / 2;


  const centerY =
    rect.top +
    rect.height / 2;


  let dx =
    touch.clientX -
    centerX;


  let dy =
    touch.clientY -
    centerY;


  const maxDistance = 40;


  const distance =
    Math.sqrt(
      dx * dx +
      dy * dy
    );


  if (
    distance >
    maxDistance
  ) {

    dx =
      (dx / distance) *
      maxDistance;

    dy =
      (dy / distance) *
      maxDistance;

  }


  joystickX =
    dx / maxDistance;


  joystickY =
    dy / maxDistance;


  stick.style.transform =
    `translate(
      calc(-50% + ${dx}px),
      calc(-50% + ${dy}px)
    )`;

}


function stopJoystick(event) {

  if (event) {

    event.preventDefault();

  }


  joystickActive = false;


  joystickX = 0;

  joystickY = 0;


  stick.style.transform =
    "translate(-50%, -50%)";

}


/* =========================
   BUTTON EVENTS
========================= */

shootBtn.addEventListener(
  "touchstart",
  shoot,
  { passive: false }
);


reloadBtn.addEventListener(
  "touchstart",
  reload,
  { passive: false }
);


shootBtn.addEventListener(
  "mousedown",
  shoot
);


reloadBtn.addEventListener(
  "mousedown",
  reload
);


/* =========================
   GAME OVER
========================= */

function gameOver() {

  if (!playing)
    return;


  playing = false;


  clearInterval(
    enemyAttackTimer
  );


  cancelAnimationFrame(
    gameLoop
  );


  showMessage(
    "MISSION FAILED"
  );


  setTimeout(() => {

    game.classList.add(
      "hidden"
    );

    menu.classList.remove(
      "hidden"
    );


    message.textContent =
      "";


    /*
      Remove V5 enemies
      before the next match.
    */

    document
      .querySelectorAll(
        ".combatEnemy"
      )
      .forEach(enemy => {

        enemy.remove();

      });

  }, 1800);

   }
