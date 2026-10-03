/* =========================
   NØV3X STRIKE
   V5 ENEMY SYSTEM
========================= */

const MAX_ENEMIES = 3;

let enemies = [];


/* =========================
   CREATE ENEMIES
========================= */

function createEnemies() {

  enemies = [];

  for (let i = 0; i < MAX_ENEMIES; i++) {

    createEnemy(i);

  }

}


/* =========================
   CREATE ONE ENEMY
========================= */

function createEnemy(id) {

  const enemyElement =
    document.createElement("div");

  enemyElement.className =
    "combatEnemy";

  enemyElement.dataset.id =
    id;


  enemyElement.innerHTML = `

    <div class="enemyHealth">

      <div class="enemyHealthFill"></div>

    </div>

    <div class="combatHead"></div>

    <div class="combatBody"></div>

    <div class="combatWeapon"></div>

  `;


  game.appendChild(enemyElement);


  const enemyData = {

    id: id,

    element: enemyElement,

    health: 100,

    maxHealth: 100,

    x: 20 + Math.random() * 60,

    y: 30 + Math.random() * 30

  };


  enemies.push(enemyData);


  positionEnemy(enemyData);

}


/* =========================
   POSITION
========================= */

function positionEnemy(enemyData) {

  enemyData.element.style.left =
    enemyData.x + "%";

  enemyData.element.style.top =
    enemyData.y + "%";

}


/* =========================
   DAMAGE ENEMY
========================= */

function damageEnemy(enemyData, damage) {

  if (!playing) return;

  enemyData.health -= damage;


  if (enemyData.health < 0) {
    enemyData.health = 0;
  }


  const healthFill =
    enemyData.element.querySelector(
      ".enemyHealthFill"
    );


  const percentage =
    (enemyData.health /
      enemyData.maxHealth) * 100;


  healthFill.style.width =
    percentage + "%";


  if (enemyData.health <= 0) {

    eliminateEnemy(enemyData);

  }

}


/* =========================
   ELIMINATE
========================= */

function eliminateEnemy(enemyData) {

  score += 100;

  updateHUD();

  showMessage("+100 ELIMINATION");


  enemyData.element.style.transform =
    "translate(-50%, -50%) scale(1.5)";


  enemyData.element.style.opacity =
    "0";


  setTimeout(() => {

    if (!playing) return;

    respawnEnemy(enemyData);

  }, 700);

}


/* =========================
   RESPAWN
========================= */

function respawnEnemy(enemyData) {

  enemyData.health =
    enemyData.maxHealth;


  enemyData.x =
    10 + Math.random() * 80;


  enemyData.y =
    28 + Math.random() * 35;


  enemyData.element.style.opacity =
    "1";


  enemyData.element.style.transform =
    "translate(-50%, -50%)";


  const healthFill =
    enemyData.element.querySelector(
      ".enemyHealthFill"
    );


  healthFill.style.width =
    "100%";


  positionEnemy(enemyData);

}


/* =========================
   MOVE ENEMIES
========================= */

function moveEnemies() {

  if (!playing) return;


  enemies.forEach(enemyData => {

    enemyData.x +=
      Math.random() * 8 - 4;

    enemyData.y +=
      Math.random() * 6 - 3;


    enemyData.x =
      Math.max(
        10,
        Math.min(
          90,
          enemyData.x
        )
      );


    enemyData.y =
      Math.max(
        25,
        Math.min(
          65,
          enemyData.y
        )
      );


    positionEnemy(enemyData);

  });

}


/* =========================
   ENEMY ATTACK
========================= */

function enemiesAttack() {

  if (!playing) return;


  const chance =
    Math.random();


  if (chance > 0.45) return;


  const damage =
    Math.floor(
      Math.random() * 5
    ) + 2;


  if (armor > 0) {

    armor -= damage;


    if (armor < 0) {

      health += armor;

      armor = 0;

    }

  } else {

    health -= damage;

  }


  health =
    Math.max(0, health);


  updateHUD();

  showDamageEffect();


  if (health <= 0) {

    gameOver();

  }

}


/* =========================
   START ENEMY SYSTEM
========================= */

function startMultipleEnemies() {

  createEnemies();


  setInterval(() => {

    if (playing) {
      moveEnemies();
    }

  }, 1400);


  setInterval(() => {

    if (playing) {
      enemiesAttack();
    }

  }, 2600);

}


/* =========================
   FIND ENEMY AT CROSSHAIR
========================= */

function getTargetEnemy() {

  let closest = null;

  let closestDistance =
    Infinity;


  enemies.forEach(enemyData => {

    if (enemyData.health <= 0)
      return;


    const rect =
      enemyData.element
        .getBoundingClientRect();


    const centerX =
      rect.left +
      rect.width / 2;


    const centerY =
      rect.top +
      rect.height / 2;


    const distance =
      Math.sqrt(

        Math.pow(
          window.innerWidth / 2 -
          centerX,
          2
        )

        +

        Math.pow(
          window.innerHeight / 2 -
          centerY,
          2
        )

      );


    if (
      distance < closestDistance
    ) {

      closestDistance =
        distance;

      closest =
        enemyData;

    }

  });


  if (
    closest &&
    closestDistance < 110
  ) {

    return closest;

  }


  return null;

    }
