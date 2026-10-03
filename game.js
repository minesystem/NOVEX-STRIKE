const playBtn = document.getElementById("playBtn");
const menu = document.getElementById("menu");
const game = document.getElementById("game");

const shootBtn = document.getElementById("shootBtn");
const reloadBtn = document.getElementById("reloadBtn");

const enemy = document.getElementById("enemy");
const healthText = document.getElementById("health");
const scoreText = document.getElementById("score");
const ammoText = document.getElementById("ammo");
const message = document.getElementById("message");

const joystick = document.getElementById("joystick");
const stick = document.getElementById("stick");

let health = 100;
let score = 0;
let ammo = 30;
let playing = false;
let reloading = false;

let playerX = 50;
let playerY = 50;

let joystickActive = false;
let joystickX = 0;
let joystickY = 0;

/* =========================
   START GAME
========================= */

playBtn.addEventListener("click", () => {
  menu.classList.add("hidden");
  game.classList.remove("hidden");

  health = 100;
  score = 0;
  ammo = 30;
  playing = true;

  updateHUD();
  spawnEnemy();

  showMessage("MISSION START");
});

/* =========================
   HUD
========================= */

function updateHUD() {
  healthText.textContent = health;
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
  }, 1200);
}

/* =========================
   SHOOTING
========================= */

shootBtn.addEventListener("touchstart", shoot);
shootBtn.addEventListener("mousedown", shoot);

function shoot(event) {
  if (event) event.preventDefault();

  if (!playing || reloading) return;

  if (ammo <= 0) {
    showMessage("RELOAD!");
    return;
  }

  ammo--;

  updateHUD();

  /* Check whether enemy is close to crosshair */
  const enemyRect = enemy.getBoundingClientRect();

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  const enemyCenterX =
    enemyRect.left + enemyRect.width / 2;

  const enemyCenterY =
    enemyRect.top + enemyRect.height / 2;

  const distance = Math.sqrt(
    Math.pow(centerX - enemyCenterX, 2) +
    Math.pow(centerY - enemyCenterY, 2)
  );

  if (distance < 100) {
    hitEnemy();
  }
}

/* =========================
   ENEMY HIT
========================= */

function hitEnemy() {
  score += 100;

  updateHUD();

  showMessage("+100 ELIMINATION");

  enemy.style.transform =
    "translate(-50%, -50%) scale(1.4)";

  setTimeout(() => {
    spawnEnemy();
  }, 180);
}

/* =========================
   SPAWN ENEMY
========================= */

function spawnEnemy() {
  const positions = [
    [20, 35],
    [35, 45],
    [50, 35],
    [65, 45],
    [80, 35],
    [25, 55],
    [75, 55]
  ];

  const position =
    positions[Math.floor(Math.random() * positions.length)];

  enemy.style.left = position[0] + "%";
  enemy.style.top = position[1] + "%";

  enemy.style.transform =
    "translate(-50%, -50%) scale(1)";
}

/* =========================
   RELOAD
========================= */

reloadBtn.addEventListener("touchstart", reload);
reloadBtn.addEventListener("mousedown", reload);

function reload(event) {
  if (event) event.preventDefault();

  if (!playing || reloading || ammo === 30) return;

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

joystick.addEventListener("touchstart", startJoystick);

joystick.addEventListener("touchmove", moveJoystick);

joystick.addEventListener("touchend", stopJoystick);

function startJoystick(event) {
  event.preventDefault();
  joystickActive = true;
  moveJoystick(event);
}

function moveJoystick(event) {
  if (!joystickActive) return;

  const touch = event.touches[0];

  const rect = joystick.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  let dx = touch.clientX - centerX;
  let dy = touch.clientY - centerY;

  const maxDistance = 40;

  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > maxDistance) {
    dx = dx / distance * maxDistance;
    dy = dy / distance * maxDistance;
  }

  joystickX = dx / maxDistance;
  joystickY = dy / maxDistance;

  stick.style.transform =
    `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;

  /* Basic movement effect */
  playerX += joystickX * 0.4;
  playerY += joystickY * 0.4;

  playerX = Math.max(10, Math.min(90, playerX));
  playerY = Math.max(20, Math.min(80, playerY));
}

function stopJoystick() {
  joystickActive = false;

  joystickX = 0;
  joystickY = 0;

  stick.style.transform =
    "translate(-50%, -50%)";
}

/* =========================
   ENEMY ATTACK
========================= */

let enemyAttackTimer = setInterval(() => {

  if (!playing) return;

  const damage = Math.floor(Math.random() * 6) + 2;

  health -= damage;

  if (health < 0) {
    health = 0;
  }

  updateHUD();

  if (health <= 0) {
    gameOver();
  }

}, 3500);

/* =========================
   GAME OVER
========================= */

function gameOver() {
  playing = false;

  showMessage("MISSION FAILED");

  setTimeout(() => {
    game.classList.add("hidden");
    menu.classList.remove("hidden");

    message.textContent = "";
  }, 1800);
}
