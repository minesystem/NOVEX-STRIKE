/* =========================
   NØV3X STRIKE
   V7 ADS + RECOIL
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

  menu.classList.add(
    "hidden"
  );

  game.classList.remove(
    "hidden"
  );


  health = 100;

  armor = 100;

  score = 0;


  aiming = false;

  game.classList.remove(
    "aiming"
  );

  adsBtn.classList.remove(
    "active"
  );


  currentWeapon = 0;

  setWeapon(0);


  playerX = 50;

  playerY = 50;


  playing = true;

  reloading = false;

  canShoot = true;


  updateHUD();


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


  clearInterval(
    enemyAttackTimer
  );


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
    .querySelectorAll(
      ".weaponBtn"
    )
    .forEach(button => {

      button.classList.remove(
        "active"
      );

    });


  const selected =
    document.querySelector(
      `[data-weapon="${index}"]`
    );


  if (selected) {

    selected.classList.add(
      "active"
    );

  }


  updateHUD();

}


/* =========================
   WEAPON SELECTOR
========================= */

document
  .querySelectorAll(
    ".weaponBtn"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () => {

        if (reloading)
          return;


        const index =
          Number(
            button.dataset.weapon
          );


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


  aiming =
    !aiming;


  if (aiming) {

    game.classList.add(
      "aiming"
    );

    adsBtn.classList.add(
      "active"
    );

    adsBtn.textContent =
      "AIM";

    adsStatus.textContent =
      "ADS";

  } else {

    game.classList.remove(
      "aiming"
    );

    adsBtn.classList.remove(
      "active"
    );

    adsBtn.textContent =
      "ADS";

    adsStatus.textContent =
      "HIP FIRE";

  }

}


/* =========================
   HUD
========================= */

function updateHUD() {

  healthText.textContent =
    Math.max(
      0,
      health
    );

  armorText.textContent =
    Math.max(
      0,
      armor
    );

  scoreText.textContent =
    score;

  ammoText.textContent =
    ammo;

}


/* =========================
   GAME LOOP
========================= */

function startGameLoop() {

  cancelAnimationFrame(
    gameLoop
  );


  function loop() {

    if (!playing)
      return;


    movePlayer();

    updateWorld();


    gameLoop =
      requestAnimationFrame(
        loop
      );

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
   WORLD
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

    showMessage(
      "RELOAD!"
    );

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
            selectedWeapon.damage * 1.15
          )
        : selectedWeapon.damage;


    damageEnemy(
      target,
      damage
    );


    showHitMarker();

  } else {

    showMessage(
      "MISS"
    );

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


  /*
    Force animation restart.
  */

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


    showMessage(
      "READY"
    );

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
