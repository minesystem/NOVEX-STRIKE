const playBtn = document.getElementById("playBtn");
const menu = document.getElementById("menu");
const game = document.getElementById("game");

const shootBtn = document.getElementById("shootBtn");
const reloadBtn = document.getElementById("reloadBtn");

const enemy = document.getElementById("enemy");
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

let health = 100;
let armor = 100;
let score = 0;
let ammo = 30;

let playing = false;
let reloading = false;

let joystickActive = false;
let joystickX = 0;
let joystickY = 0;

let enemyX = 50;
let enemyY = 38;

let enemyMoveTimer = null;
let enemyAttackTimer = null;


/* =========================
   START GAME
========================= */

playBtn.addEventListener("click", startGame);

function startGame() {

  menu.classList.add("hidden");
  game.classList.remove("hidden");

  health = 100;
  armor = 100;
  score = 0;
  ammo = 30;

  playing = true;
  reloading = false;

  updateHUD();

  spawnEnemy();

  showMessage("MISSION START");

  startEnemySystems();
}


/* =========================
   HUD
========================= */

function updateHUD() {

  healthText.textContent = health;
  armorText.textContent = armor;
  scoreText.textContent = score;
  ammoText.textContent = ammo;

}


/* =========================
   MESSAGE
========================= */

function showMessage(text) {

  message.textContent = text;

  setTimeout(() => {

    if (message.textContent === text) {
      message.textContent = "";
    }

  }, 1100);

}


/* =========================
   SHOOT
========================= */

function shoot(event) {

  if (event) {
    event.preventDefault();
  }

  if (!playing || reloading) return;

  if (ammo <= 0) {

    showMessage("RELOAD!");

    return;
  }

  ammo--;

  updateHUD();

  muzzle();

  checkHit();

}


/* =========================
   MUZZLE FLASH
========================= */

function muzzle() {

  muzzleFlash.style.opacity = "1";

  setTimeout(() => {
    muzzleFlash.style.opacity = "0";
  }, 70);

}


/* =========================
   CHECK HIT
========================= */

function checkHit() {

  const enemyRect = enemy.getBoundingClientRect();

  const crosshairX = window.innerWidth / 2;
  const crosshairY = window.innerHeight / 2;

  const enemyCenterX =
    enemyRect.left + enemyRect.width / 2;

  const enemyCenterY =
    enemyRect.top + enemyRect.height / 2;

  const distance = Math.sqrt(
    Math.pow(crosshairX - enemyCenterX, 2) +
    Math.pow(crosshairY - enemyCenterY, 2)
  );


  if (distance < 90) {

    hitEnemy();

  } else {

    showMessage("MISS");

  }

}


/* =========================
   HIT ENEMY
========================= */

function hitEnemy() {

  score += 100;

  updateHUD();

  showHitMarker();

  showMessage("+100 ELIMINATION");

  enemy.style.transform =
    "translate(-50%, -50%) scale(1.35)";

  setTimeout(() => {

    if (playing) {
      spawnEnemy();
    }

  }, 180);

}


/* =========================
   HIT MARKER
========================= */

function showHitMarker() {

  hitMarker.style.opacity = "1";

  setTimeout(() => {

    hitMarker.style.opacity = "0";

  }, 160);

}


/* =========================
   SPAWN ENEMY
========================= */

function spawnEnemy() {

  const positions = [

    [18, 34],
    [30, 42],
    [42, 34],
    [55, 40],
    [68, 34],
    [80, 43],
    [25, 52],
    [75, 52]

  ];


  const position =
    positions[Math.floor(Math.random() * positions.length)];


  enemyX = position[0];
  enemyY = position[1];


  enemy.style.left = enemyX + "%";
  enemy.style.top = enemyY + "%";

  enemy.style.transform =
    "translate(-50%, -50%) scale(1)";

}


/* =========================
   ENEMY MOVEMENT
========================= */

function moveEnemy() {

  if (!playing) return;

  const moveX =
    (Math.random() * 20) - 10;

  const moveY =
    (Math.random() * 12) - 6;


  enemyX += moveX;
  enemyY += moveY;


  enemyX =
    Math.max(12, Math.min(88, enemyX));

  enemyY =
    Math.max(25, Math.min(60, enemyY));


  enemy.style.left = enemyX + "%";
  enemy.style.top = enemyY + "%";

}


/* =========================
   ENEMY ATTACK
========================= */

function enemyAttack() {

  if (!playing) return;

  const damage =
    Math.floor(Math.random() * 7) + 4;


  if (armor > 0) {

    armor -= damage;

    if (armor < 0) {

      health += armor;
      armor = 0;

    }

  } else {

    health -= damage;

  }


  if (health < 0) {
    health = 0;
  }


  updateHUD();

  showDamageEffect();


  if (health <= 0) {

    gameOver();

  }

}


/* =========================
   DAMAGE EFFECT
========================= */

function showDamageEffect() {

  damageOverlay.style.opacity = "1";

  setTimeout(() => {

    damageOverlay.style.opacity = "0";

  }, 180);

}


/* =========================
   ENEMY SYSTEMS
========================= */

function startEnemySystems() {

  clearInterval(enemyMoveTimer);
  clearInterval(enemyAttackTimer);


  enemyMoveTimer =
    setInterval(moveEnemy, 1600);


  enemyAttackTimer =
    setInterval(enemyAttack, 3000);

}


function stopEnemySystems() {

  clearInterval(enemyMoveTimer);
  clearInterval(enemyAttackTimer);

}


/* =========================
   RELOAD
========================= */

function reload(event) {

  if (event) {
    event.preventDefault();
  }

  if (!playing) return;

  if (reloading) return;

  if (ammo === 30) {

    showMessage("MAGAZINE FULL");

    return;
  }


  reloading = true;

  showMessage("RELOADING...");


  setTimeout(() => {

    ammo = 30;

    reloading = false;

    updateHUD();

    showMessage("READY");

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

  if (!joystickActive) return;

  event.preventDefault();


  const touch =
    event.touches[0];


  const rect =
    joystick.getBoundingClientRect();


  const centerX =
    rect.left + rect.width / 2;


  const centerY =
    rect.top + rect.height / 2;


  let dx =
    touch.clientX - centerX;


  let dy =
    touch.clientY - centerY;


  const maxDistance = 40;


  const distance =
    Math.sqrt(dx * dx + dy * dy);


  if (distance > maxDistance) {

    dx =
      (dx / distance) * maxDistance;

    dy =
      (dy / distance) * maxDistance;

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


  /* Small camera-style movement */

  const cameraX =
    joystickX * 3;


  const cameraY =
    joystickY * 2;


  game.style.backgroundPosition =
    `${cameraX}px ${cameraY}px`;

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


  game.style.backgroundPosition =
    "center";

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


/* Desktop testing */

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

  if (!playing) return;

  playing = false;

  stopEnemySystems();

  showMessage("MISSION FAILED");


  setTimeout(() => {

    game.classList.add("hidden");

    menu.classList.remove("hidden");

    message.textContent = "";

  }, 1800);

}
