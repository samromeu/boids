const canvas = document.getElementById('boidsCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const boids = [];

let lastTime = null;

function draw(currentTime) {
if (lastTime === null) lastTime = currentTime;
const dt = (currentTime - lastTime) / 1000; //dt in seconds
lastTime = currentTime;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw your boids here
  for (let boid of boids){
    updateBoid(boid, dt);
  }
  drawBoids(boids);
  requestAnimationFrame(draw);
}
draw(); 


function randomDirection() {
  const angle = Math.random() * 2 * Math.PI;
  return {x: Math.cos(angle), y: Math.sin(angle)};
}

function getRandomColour(){
  return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
}

function Boid(x, y) {
  this.colour = getRandomColour();
  this.x = x
  this.y = y
  const dir = randomDirection();
  const speed = 500;
  this.vx = dir.x * speed;
  this.vy = dir.y * speed;
}

const edgeThreshold = 100; // px

let protectedRange = 80;
let turnfactor = 20;
let visualRange = 150;
let avoidfactor = 0.05;
let centering_factor = 0.005;
let matching_factor = 0.05;
let min_speed = 250;
let max_speed = 1000;

// Get slider elements
const protectedRangeSlider = document.getElementById('protectedRangeSlider');
const protectedRangeValue = document.getElementById('protectedRangeValue');
const turnFactorSlider = document.getElementById('turnFactorSlider');
const turnFactorValue = document.getElementById('turnFactorValue');
const visualRangeSlider = document.getElementById('visualRangeSlider');
const visualRangeValue = document.getElementById('visualRangeValue');
const avoidFactorSlider = document.getElementById('avoidFactorSlider');
const avoidFactorValue = document.getElementById('avoidFactorValue');
const centeringFactorSlider = document.getElementById('centeringFactorSlider');
const centeringFactorValue = document.getElementById('centeringFactorValue');
const matchingFactorSlider = document.getElementById('matchingFactorSlider');
const matchingFactorValue = document.getElementById('matchingFactorValue');
const minSpeedSlider = document.getElementById('minSpeedSlider');
const minSpeedValue = document.getElementById('minSpeedValue');
const maxSpeedSlider = document.getElementById('maxSpeedSlider');
const maxSpeedValue = document.getElementById('maxSpeedValue');

// Update values on slider input
protectedRangeSlider.addEventListener('input', function() {
  protectedRange = Number(this.value);
  protectedRangeValue.textContent = this.value;
});
turnFactorSlider.addEventListener('input', function() {
  turnfactor = Number(this.value);
  turnFactorValue.textContent = this.value;
});
visualRangeSlider.addEventListener('input', function() {
  visualRange = Number(this.value);
  visualRangeValue.textContent = this.value;
});
avoidFactorSlider.addEventListener('input', function() {
  avoidfactor = Number(this.value);
  avoidFactorValue.textContent = this.value;
});
centeringFactorSlider.addEventListener('input', function() {
  centering_factor = Number(this.value);
  centeringFactorValue.textContent = this.value;
});
matchingFactorSlider.addEventListener('input', function() {
  matching_factor = Number(this.value);
  matchingFactorValue.textContent = this.value;
});
minSpeedSlider.addEventListener('input', function() {
  min_speed = Number(this.value);
  minSpeedValue.textContent = this.value;
});
maxSpeedSlider.addEventListener('input', function() {
  max_speed = Number(this.value);
  maxSpeedValue.textContent = this.value;
});

const initialValues = {
  protectedRange: 80,
  turnfactor: 20,
  visualRange: 150,
  avoidfactor: 0.05,
  centering_factor: 0.005,
  matching_factor: 0.05,
  min_speed: 250,
  max_speed: 1000
};

const resetSlidersButton = document.getElementById('resetSlidersButton');
resetSlidersButton.addEventListener('click', function() {
  protectedRangeSlider.value = initialValues.protectedRange;
  protectedRangeValue.textContent = initialValues.protectedRange;
  protectedRange = initialValues.protectedRange;

  turnFactorSlider.value = initialValues.turnfactor;
  turnFactorValue.textContent = initialValues.turnfactor;
  turnfactor = initialValues.turnfactor;

  visualRangeSlider.value = initialValues.visualRange;
  visualRangeValue.textContent = initialValues.visualRange;
  visualRange = initialValues.visualRange;

  avoidFactorSlider.value = initialValues.avoidfactor;
  avoidFactorValue.textContent = initialValues.avoidfactor;
  avoidfactor = initialValues.avoidfactor;

  centeringFactorSlider.value = initialValues.centering_factor;
  centeringFactorValue.textContent = initialValues.centering_factor;
  centering_factor = initialValues.centering_factor;

  matchingFactorSlider.value = initialValues.matching_factor;
  matchingFactorValue.textContent = initialValues.matching_factor;
  matching_factor = initialValues.matching_factor;

  minSpeedSlider.value = initialValues.min_speed;
  minSpeedValue.textContent = initialValues.min_speed;
  min_speed = initialValues.min_speed;

  maxSpeedSlider.value = initialValues.max_speed;
  maxSpeedValue.textContent = initialValues.max_speed;
  max_speed = initialValues.max_speed;
});

function updateBoid(boid, dt){
  let close_dx = 0, close_dy = 0;
  let xpos_avg = 0, ypos_avg = 0;
  let xvel_avg = 0, yvel_avg = 0;
  let neighbouring_boids = 0;

  for (let otherboid of boids){
    if (otherboid !== boid){
      let dx = boid.x - otherboid.x;
      let dy = boid.y - otherboid.y;
      // Is the other boid in visual range?
      if (Math.abs(dx) < visualRange && Math.abs(dy) < visualRange){

        let squared_distance = dx * dx + dy * dy;

        // Visual range, is it within the protected range? I.e. time to separate
        if (squared_distance < protectedRange * protectedRange){
          close_dx += boid.x - otherboid.x;
          close_dy += boid.y - otherboid.y;
        }
        // Not in protected range, is it in visual range?
        else if (squared_distance < visualRange * visualRange) {
          //Add averages of all other boids in visual range 
          xpos_avg += otherboid.x;
          ypos_avg += otherboid.y;
          xvel_avg += otherboid.vx;
          yvel_avg += otherboid.vy;
          //Increment number of neighbouring boids to this boid
          neighbouring_boids += 1;
        }
      }
    }
  }

  if (neighbouring_boids > 0){

    xpos_avg = xpos_avg / neighbouring_boids;
    ypos_avg = ypos_avg / neighbouring_boids;
    xvel_avg = xvel_avg / neighbouring_boids;
    yvel_avg = yvel_avg / neighbouring_boids;

    //Add the centering and matching contributions to velocity

    boid.vx = (boid.vx + 
                (xpos_avg - boid.x) * centering_factor +
                (xvel_avg - boid.vx) * matching_factor)
    boid.vy = (boid.vy + 
                (ypos_avg - boid.y) * centering_factor +
                (yvel_avg - boid.vy) * matching_factor)

  }


  boid.vx += close_dx * avoidfactor;
  boid.vy += close_dy * avoidfactor;

  let speed = Math.sqrt(boid.vx*boid.vx + boid.vy*boid.vy);

  if (speed < max_speed){
    boid.vx = (boid.vx / speed) * min_speed
    boid.vy = (boid.vy / speed) * min_speed
  }
  if (speed > max_speed){
    boid.vx = (boid.vx / speed) * max_speed;
    boid.vy = (boid.vy / speed) * max_speed;
  }

  boid.x += boid.vx * dt;
  boid.y += boid.vy * dt;

  if (boid.x >= canvas.width - edgeThreshold){
    boid.vx -= turnfactor;
  }
  if (boid.x <= edgeThreshold) {
    boid.vx += turnfactor;
  }
  if (boid.y >= canvas.height - edgeThreshold){
    boid.vy -= turnfactor;
  }
  if (boid.y <= edgeThreshold){
    boid.vy += turnfactor;
  }
}


function drawBoids(boids){
  for (let boid of boids){
    // For now, let's draw a simple circle for each boid.
    ctx.beginPath();
    ctx.arc(boid.x, boid.y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = boid.colour;
    ctx.fill();
  }
}

canvas.addEventListener('click', function(event) {
  // Get mouse position relative to the canvas
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;


  var boid = new Boid(x, y);
  boids.push(boid);
});

