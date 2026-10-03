/* =========================
   NØV3X STRIKE
   V3 BATTLEFIELD MAP
========================= */

const battlefield = document.createElement("div");

battlefield.id = "battlefield";

battlefield.innerHTML = `
  <div class="wall wall1"></div>
  <div class="wall wall2"></div>
  <div class="wall wall3"></div>
  <div class="wall wall4"></div>

  <div class="cover cover1"></div>
  <div class="cover cover2"></div>
  <div class="cover cover3"></div>

  <div class="spawn spawn1"></div>
  <div class="spawn spawn2"></div>
  <div class="spawn spawn3"></div>
`;


/* Put battlefield behind the HUD */

game.insertBefore(
  battlefield,
  game.firstChild
);


/* =========================
   MINIMAP
========================= */

const minimap = document.createElement("div");

minimap.id = "minimap";

minimap.innerHTML = `
  <div class="mapTitle">TACTICAL MAP</div>

  <div class="mapPlayer"></div>

  <div class="mapEnemy enemyDot1"></div>
  <div class="mapEnemy enemyDot2"></div>
  <div class="mapEnemy enemyDot3"></div>
`;

game.appendChild(minimap);


/* =========================
   MAP CSS
========================= */

const mapStyle = document.createElement("style");

mapStyle.textContent = `

#battlefield {

  position: absolute;

  inset: 0;

  overflow: hidden;

  z-index: 3;

  pointer-events: none;

}


/* =========================
   WALLS
========================= */

.wall {

  position: absolute;

  background:
    linear-gradient(
      90deg,
      #151515,
      #444,
      #181818
    );

  border:
    2px solid #080808;

  box-shadow:
    0 8px 18px rgba(0,0,0,.7);

}


.wall1 {

  width: 160px;
  height: 25px;

  left: 15%;
  top: 32%;

  transform: rotate(-8deg);

}


.wall2 {

  width: 180px;
  height: 25px;

  right: 12%;
  top: 40%;

  transform: rotate(7deg);

}


.wall3 {

  width: 120px;
  height: 25px;

  left: 35%;
  top: 57%;

  transform: rotate(3deg);

}


.wall4 {

  width: 140px;
  height: 25px;

  right: 30%;
  top: 27%;

  transform: rotate(-5deg);

}


/* =========================
   COVER
========================= */

.cover {

  position: absolute;

  background:
    linear-gradient(
      #555,
      #222
    );

  border:
    2px solid #111;

  box-shadow:
    0 8px 15px rgba(0,0,0,.7);

}


.cover1 {

  width: 65px;
  height: 65px;

  left: 20%;
  top: 63%;

}


.cover2 {

  width: 70px;
  height: 50px;

  right: 20%;
  top: 60%;

}


.cover3 {

  width: 50px;
  height: 80px;

  left: 48%;
  top: 65%;

}


/* =========================
   SPAWN ZONES
========================= */

.spawn {

  position: absolute;

  width: 55px;
  height: 55px;

  border:
    1px dashed rgba(180,100,255,.4);

  border-radius: 50%;

}


.spawn1 {

  left: 8%;
  top: 45%;

}


.spawn2 {

  right: 8%;
  top: 35%;

}


.spawn3 {

  right: 12%;
  bottom: 25%;

}


/* =========================
   MINIMAP
========================= */

#minimap {

  position: absolute;

  right: 12px;
  top: 70px;

  width: 125px;
  height: 125px;

  border:
    2px solid rgba(255,255,255,.35);

  border-radius: 8px;

  background:
    linear-gradient(
      rgba(20,20,20,.8),
      rgba(5,5,5,.9)
    );

  box-shadow:
    0 0 15px rgba(0,0,0,.8);

  z-index: 55;

  overflow: hidden;

}


#minimap::before {

  content: "";

  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      90deg,
      transparent 49%,
      rgba(255,255,255,.08) 50%,
      transparent 51%
    ),
    linear-gradient(
      0deg,
      transparent 49%,
      rgba(255,255,255,.08) 50%,
      transparent 51%
    );

}


.mapTitle {

  position: absolute;

  left: 6px;
  top: 4px;

  font-size: 7px;

  letter-spacing: 1px;

  color: #aaa;

}


.mapPlayer {

  position: absolute;

  left: 50%;
  top: 50%;

  width: 8px;
  height: 8px;

  transform:
    translate(-50%, -50%)
    rotate(45deg);

  background: white;

  box-shadow:
    0 0 8px white;

}


.mapEnemy {

  position: absolute;

  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #ff4040;

  box-shadow:
    0 0 8px #ff4040;

}


.enemyDot1 {

  left: 20%;
  top: 30%;

}


.enemyDot2 {

  right: 20%;
  top: 45%;

}


.enemyDot3 {

  left: 65%;
  bottom: 20%;

}

`;

document.head.appendChild(mapStyle);


/* =========================
   MINIMAP ENEMY MOVEMENT
========================= */

function updateMinimap() {

  const dots =
    document.querySelectorAll(".mapEnemy");

  dots.forEach((dot) => {

    const x =
      Math.random() * 80 + 10;

    const y =
      Math.random() * 70 + 15;

    dot.style.left = x + "%";
    dot.style.top = y + "%";

  });

}


/* Update tactical map */

setInterval(() => {

  if (playing) {
    updateMinimap();
  }

}, 1800);
