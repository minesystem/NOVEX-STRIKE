/* =========================
   NØV3X STRIKE
   V8 CAMERA LOOK
========================= */

const playBtn =
  document.getElementById("playBtn");

const menu =
  document.getElementById("menu");

const game =
  document.getElementById("game");

const shootBtn =
  document.getElementById("shootBtn");

const reloadBtn =
  document.getElementById("reloadBtn");

const adsBtn =
  document.getElementById("adsBtn");

const lookArea =
  document.getElementById("lookArea");

const lookHint =
  document.getElementById("lookHint");

const cameraWorld =
  document.getElementById("cameraWorld");

const directionText =
  document.getElementById("directionText");

const healthText =
  document.getElementById("health");

const armorText =
  document.getElementById("armor");

const scoreText =
  document.getElementById("score");

const ammoText =
  document.getElementById("ammo");

const maxAmmoText =
  document.getElementById("maxAmmo");

const weaponNameText =
  document.getElementById("weaponName");

const weapon =
  document.getElementById("weapon");

const crosshair =
  document.getElementById("crosshair");

const adsStatus =
  document.getElementById("adsStatus");

const message =
  document.getElementById("message");

const muzzleFlash =
  document.getElementById("muzzleFlash");

const hitMarker =
  document.getElementById("hitMarker");

const damageOverlay =
  document.getElementById("damageOverlay");

const joystick =
  document.getElementById("joystick");

const stick =
  document.getElementById("stick");


/* =========================
   WEAPONS
========================= */

const weapons = [

  {
    name: "VX-AR",
    magazine: 30,
    damage: 50,
    fireRate: 250
  },

  {
    name: "VX-SMG",
    magazine: 40,
    damage: 30,
    fireRate: 120
  },

  {
    name: "VX-DMR",
    magazine: 12,
    damage: 85,
    fireRate: 550
  }

];


let currentWeapon = 0;

let ammo = 30;

let canShoot = true;


/* =========================
   PLAYER
========================= */

let health = 100;

let armor = 100;

let score = 0;

let playing = false;

let reloading = false;

let aiming = false;


/* =========================
   MOVEMENT
========================= */

let joystickActive = false;

let joystickX = 0;

let joystickY = 0;

let playerX = 50;

let playerY = 50;


/* =========================
   CAMERA
========================= */

let cameraYaw = 0;

let cameraPitch = 0;

let lookActive = false;

let lookTouchId = null;

let lastLookX = 0;

let lastLookY = 0;


/* =========================
   GAME
========================= */

let gameLoop;

let enemyAttackTimer;


/* =========================
   START
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

  aiming = false;

  cameraYaw = 0;

  cameraPitch = 0;

  playerX = 50;

  playerY = 50;

  game.classList.remove("aiming");

  adsBtn.classList.remove("active");

  adsBtn.textContent = "ADS";

  adsStatus.textContent = "HIP FIRE";

  currentWeapon = 0;

  setWeapon(0);

  playing = true;

  reloading = false;

  canShoot = true;

  updateHUD();

  updateCamera();

  if (
    typeof startMultipleEnemies ===
    "function"
  ) {

    startMultipleEnemies();

  }

  showMessage("MISSION START");

  startGameLoop();

  clearInterval(enemyAttackTimer);

  enemyAttackTimer =
    setInterval(() => {

      if (
        playing &&
        typeof enemiesAttack ===
        "function"
      ) {

        enemiesAttack();

      }

    }, 2600);

}


/* =========================
   WEAPON
========================= */

function setWeapon(index) {

  if (
    index < 0 ||
    index >= weapons.length
  ) {

    return;

  }

  currentWeapon = index;

  const selectedWeapon =
    weapons[currentWeapon];

  ammo =
    selectedWeapon.magazine;

  weaponNameText.textContent =
    selectedWeapon.name;

  maxAmmoText.textContent =
    "/" +
    selectedWeapon.magazine;

  document
    .querySelectorAll(".weaponBtn")
    .forEach(button => {

      button.classList.remove("active");

    });

  const selected =
    document.querySelector(
      `[data-weapon="${index}"]`
    );

  if (selected) {

    selected.classList.add("active");

  }

  updateHUD();

}


/* =========================
   WEAPON SELECTOR
========================= */

document
  .querySelectorAll(".weaponBtn")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        if (reloading)
          return;

        const index =
          Number(button.dataset.weapon);

        setWeapon(index);

        showMessage(
          weapons[index].name
        );

      }
    );

  });


/* =========================
   ADS
========================= */

adsBtn.addEventListener(
  "touchstart",
  toggleADS,
  { passive: false }
);

adsBtn.addEventListener(
  "mousedown",
  toggleADS
);


function toggleADS(event) {

  if (event)
    event.preventDefault();

  if (!playing)
    return;

  if (reloading)
    return;

  aiming = !aiming;

  if (aiming) {

    game.classList.add("aiming");

    adsBtn.classList.add("active");

    adsBtn.textContent = "AIM";

    adsStatus.textContent = "ADS";

  } else {

    game.classList.remove("aiming");

    adsBtn.classList.remove("active");

    adsBtn.textContent = "ADS";

    adsStatus.textContent = "HIP FIRE";

  }

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

    if (!playing)
      return;

    movePlayer();

    updateCamera();

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

  const speed =
    aiming
      ? 0.055
      : 0.10;

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
   CAMERA
========================= */

function updateCamera() {

  const yaw =
    cameraYaw;

  const pitch =
    cameraPitch;

  cameraWorld.style.transform =
    `
      translate(
        ${-yaw * 1.2}px,
        ${pitch * 0.8}px
      )
      scale(1.08)
    `;


  updateDirection();

}


/* =========================
   DIRECTION
========================= */

function updateDirection() {

  let angle =
    cameraYaw % 360;

  if (angle < 0)
    angle += 360;

  let direction;

  if (
    angle >= 315 ||
    angle < 45
  ) {

    direction = "NORTH";

  } else if (
    angle < 135
  ) {

    direction = "EAST";

  } else if (
    angle < 225
  ) {

    direction = "SOUTH";

  } else {

    direction = "WEST";

  }

  directionText.textContent =
    direction;

}


/* =========================
   WORLD
========================= */

function updateWorld() {

  const battlefield =
    document.getElementById(
      "battlefield"
    );

  if (!battlefield)
    return;

  const movementX =
    (playerX - 50) * -2;

  const movementY =
    (playerY - 50) * -1.5;

  battlefield.style.transform =
    `
      translate(
        ${movementX}px,
        ${movementY}px
      )
    `;

}


/* =========================
   LOOK CONTROLS
========================= */

lookArea.addEventListener(
  "touchstart",
  startLook,
  { passive: false }
);

lookArea.addEventListener(
  "touchmove",
  moveLook,
  { passive: false }
);

lookArea.addEventListener(
  "touchend",
  stopLook,
  { passive: false }
);

lookArea.addEventListener(
  "touchcancel",
  stopLook,
  { passive: false }
);


function startLook(event) {

  if (!playing)
    return;

  event.preventDefault();

  const touch =
    event.changedTouches[0];

  lookActive = true;

  lookTouchId =
    touch.identifier;

  lastLookX =
    touch.clientX;

  lastLookY =
    touch.clientY;

  lookArea.classList.add(
    "active"
  );

}


function moveLook(event) {

  if (!lookActive)
    return;

  event.preventDefault();

  let touch = null;

  for (
    const currentTouch
    of event.changedTouches
  ) {

    if (
      currentTouch.identifier ===
      lookTouchId
    ) {

      touch = currentTouch;

      break;

    }

  }

  if (!touch)
    return;


  const dx =
    touch.clientX -
    lastLookX;

  const dy =
    touch.clientY -
    lastLookY;


  const sensitivity =
    aiming
      ? 0.55
      : 0.85;


  cameraYaw +=
    dx * sensitivity;

  cameraPitch +=
    dy * sensitivity;


  cameraPitch =
    Math.max(
      -80,
      Math.min(
        80,
        cameraPitch
      )
    );


  lastLookX =
    touch.clientX;

  lastLookY =
    touch.clientY;


  updateCamera();


  crosshair.style.transform =
    `
      translate(
        calc(-50% + ${dx * 0.35}px),
        calc(-50% + ${dy * 0.35}px)
      )
    `;

}


function stopLook(event) {

  if (event)
    event.preventDefault();

  lookActive = false;

  lookTouchId = null;

  lookArea.classList.remove(
    "active"
  );


  crosshair.style.transform =
    "translate(-50%,-50%)";

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

  if (event)
    event.preventDefault();

  if (!playing)
    return;

  if (reloading)
    return;

  if (!canShoot)
    return;

  const selectedWeapon =
    weapons[currentWeapon];

  if (ammo <= 0) {

    showMessage("RELOAD!");

    return;

  }

  ammo--;

  updateHUD();

  muzzle();

  recoil();

  canShoot = false;

  setTimeout(() => {

    canShoot = true;

  }, selectedWeapon.fireRate);


  if (
    typeof getTargetEnemy !==
    "function"
  ) {

    return;

  }


  const target =
    getTargetEnemy();


  if (target) {

    const damage =
      aiming
        ? Math.round(
            selectedWeapon.damage *
            1.15
          )
        : selectedWeapon.damage;

    damageEnemy(
      target,
      damage
    );

    showHitMarker();

  } else {

    showMessage("MISS");

  }

}


/* =========================
   RECOIL
========================= */

function recoil() {

  weapon.classList.remove(
    "recoil"
  );

  crosshair.classList.remove(
    "recoil"
  );

  void weapon.offsetWidth;

  void crosshair.offsetWidth;

  weapon.classList.add(
    "recoil"
  );

  crosshair.classList.add(
    "recoil"
  );

  setTimeout(() => {

    weapon.classList.remove(
      "recoil"
    );

    crosshair.classList.remove(
      "recoil"
    );

  }, 140);

}


/* =========================
   MUZZLE
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

  if (event)
    event.preventDefault();

  if (!playing)
    return;

  if (reloading)
    return;

  const selectedWeapon =
    weapons[currentWeapon];

  if (
    ammo ===
    selectedWeapon.magazine
  ) {

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

    ammo =
      selectedWeapon.magazine;

    reloading = false;

    updateHUD();

    showMessage("READY");

  }, 1000);

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

  const maxDistance =
    40;

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

  if (event)
    event.preventDefault();

  joystickActive = false;

  joystickX = 0;

  joystickY = 0;

  stick.style.transform =
    "translate(-50%,-50%)";

}


/* =========================
   BUTTONS
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

    document
      .querySelectorAll(
        ".combatEnemy"
      )
      .forEach(enemy => {

        enemy.remove();

      });

  }, 1800);

   }
