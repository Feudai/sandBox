let firstPoint;

let xPoints = [];
let yPoints = [];

let flees = [];
let nFlee = 4; //Number of flee points (nb of peaks, must be >=3);

const surfaceSqrt = 700; //size of r where screen is (r*r);

let cnt = 0;
const jump = 4000;//How many times do we execute the algo per frame;
const maxP = 100000000;//Maximum of points on the screen;

let beg = 0;
const opacity = 5;// in %

let p, q;


function setup() {
  
  createCanvas(surfaceSqrt, surfaceSqrt);
  background(0);
  translate(width / 2, height / 2);

  //divide the space in [nFlee] corners
  for (var j = 0; j <= nFlee; j++) {
    addPoint();
  }
  
  partition();
  
  //giving a first point that is inside the resultant polygon.
  firstP();

  stroke(255, 255, 255, opacity);
  strokeWeight(1);
}

function draw() {
  
  translate(width / 2, height / 2);
  
  for (var i = 0; i < jump; i++) {
    
    choose();
    process(p, q);
  }
  
  drawP();

  if (cnt >= maxP) noLoop();
}

function choose() {
  
  //choose 1 random point, and 1 random flee, and put a point halfway. point(p,q);
  let r = round(random(flees.length));
  let index = round(random(cnt - 1));
  
  q = createVector(0, 0);
  p = createVector(xPoints[index], yPoints[index]);

  for (var i = 1; i < flees.length; i++) {
    if (r == i) q = flees[i];
  }
}

function process(a, b) {
  
  xPoints.push((a.x + b.x) / 2);
  yPoints.push((a.y + b.y) / 2);
  
  cnt++;
}

function drawP() {
  
  stroke(255, 255, 255, opacity);
  strokeWeight(1);
  
  for (var i = beg; i < cnt; i++) {
    
    point(xPoints[i], yPoints[i]);
    beg++;
  }

}


function addPoint() {
  
  let f = createVector(0, 1).setMag((surfaceSqrt - 10) / 2);
  flees.push(f);
}


function partition() {
  
  let sum = 0;
  let trace;
  let di;

  di = TWO_PI / (flees.length - 1);

  for (i = 1; i < flees.length; i++) {
    
    flees[i] = createVector(
      flees[i - 1].x * cos(di) - flees[i - 1].y * sin(di),
      flees[i - 1].x * sin(di) + flees[i - 1].y * cos(di)
    ).setMag((surfaceSqrt - 10) / 2);
    
  }
}


function inside(x, y) {
  
  const n = flees.length;
  
  let isInside = true;

  for (let i = 0; i < n; i++) {
    
    const x1 = flees[i].x;
    const y1 = flees[i].y;

    const x2 = flees[(i + 1) % n].x;
    const y2 = flees[(i + 1) % n].y;

    const crossProduct = (x2 - x1) * (y - y1) - (y2 - y1) * (x - x1);

    if (crossProduct < 0) {
      
      isInside = false;
      break;
    }
  }

  return isInside;
}


function firstP() {
  
  firstPoint = createVector(random(width), random(height));

  if (inside(firstPoint.x, firstPoint.y)) {
    
    xPoints.push(firstPoint.x);
    yPoints.push(firstPoint.y);
    
    cnt++;
    
    return;
  } else firstP();
}
