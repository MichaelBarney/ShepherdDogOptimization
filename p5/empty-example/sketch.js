
const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 500;

const N_SHEEP = 20;
const CIRCLE_SIZE = 20;

const SHEEP_SIGHT_FOR_DOG = 150;
const SHEEP_SIGHT_FOR_OTHER_SHEEP = 150;

const SHEEP_VELOCITY = 1;
const DOG_VELOCITY = 3;

class Sheep {
  constructor(x, y, index){
    this.position = createVector(x, y);
    this.index = index;
    this.bestNeighborPosition = this.position;
  }

  render(){
    let c = color('white');
    if(this.position.dist(dog.position) < SHEEP_SIGHT_FOR_DOG){
      // c = color('green');
    }
    stroke(0)
    fill(c);
    circle(this.position.x, this.position.y, CIRCLE_SIZE)

    stroke(175)
    line(this.position.x, this.position.y, this.bestNeighborPosition.x, this.bestNeighborPosition.y)

    noFill();
    // circle(this.position.x, this.position.y, SHEEP_SIGHT_FOR_DOG*2)
  }

  nearestBestNeighbor(allSheep, dog, obstacles){
    const myDistanceToDog = this.position.dist(dog.position);


    let bestDistance = myDistanceToDog;

    let bestSheepNeighbor = this;

    for(let i = 0; i < N_SHEEP; i++){
      if(i != this.index){
        const sheepCandidate = allSheep[i];
        const candidateDistanceToDog = sheepCandidate.position.dist(dog.position);
        const candidateDistanceToMe = sheepCandidate.position.dist(this.position);
        if(candidateDistanceToDog > bestDistance && 
          candidateDistanceToMe < SHEEP_SIGHT_FOR_OTHER_SHEEP && 
          !obstacleInbetween(this, sheepCandidate, obstacles)){
          bestSheepNeighbor = sheepCandidate;
          bestDistance = candidateDistanceToDog;
        }
      }
    }

    return bestSheepNeighbor.position;
  }

  move(allSheep, obstacles){
    const distanceToDog = this.position.dist(dog.position);

    let selfishAttractionToBest = p5.Vector.sub(this.bestNeighborPosition, this.position);
    const distanceBestToDog = this.bestNeighborPosition.dist(dog.position);
    const distanceToBest = this.bestNeighborPosition.dist(this.position);
    selfishAttractionToBest.setMag(SHEEP_VELOCITY*Math.pow(Math.E, -(distanceToDog*distanceToDog/(SHEEP_SIGHT_FOR_OTHER_SHEEP*SHEEP_SIGHT_FOR_OTHER_SHEEP))));

    let velocity = selfishAttractionToBest;

    //Dog Repulsion
    let dogRepulsion = p5.Vector.sub(this.position, dog.position);
    const dogRepulstionMagnitude = SHEEP_VELOCITY*Math.pow(Math.E, -(distanceToDog*distanceToDog/(SHEEP_SIGHT_FOR_DOG*SHEEP_SIGHT_FOR_DOG)));
    dogRepulsion.setMag(dogRepulstionMagnitude);
    velocity.add(dogRepulsion);

    // Sheep Repulsion
    for (let sheep of allSheep){
      if(sheep.index != this.index){
        const distanceToSheep = sheep.position.dist(this.position);
        const sheepRepulsion = p5.Vector.sub(this.position, sheep.position);
        sheepRepulsion.setMag(SHEEP_VELOCITY*Math.pow(Math.E, -(distanceToSheep*distanceToSheep/(CIRCLE_SIZE*CIRCLE_SIZE))));
        velocity.add(sheepRepulsion);
      }
    }

    for (let obstacle of obstacles){
      const op = this.orthogonalProjection(obstacle.start, obstacle.end, this.position);
      const distanceToObstacle = op.dist(this.position);
      const obstacleRepulsion = p5.Vector.sub(this.position, op);
      obstacleRepulsion.setMag(SHEEP_VELOCITY/(distanceToObstacle-CIRCLE_SIZE));
      velocity.add(obstacleRepulsion);
    }

    if(velocity.mag > SHEEP_VELOCITY){
      velocity.setMag(SHEEP_VELOCITY)
    }
    this.position.add(velocity)
  }

  orthogonalProjection(a, b, p) {    
    const d1 = p5.Vector.sub(b, a);
    const d2 = p5.Vector.sub(p, a);
    const l1 = d1.mag();
    
    const dotp = constrain(d2.dot(d1.normalize()), 0, l1);
        
    return p5.Vector.add(a, d1.mult(dotp))
  }

  checkCollision(obstacles){
    if(this.position.x + CIRCLE_SIZE/2 > CANVAS_WIDTH){
      this.position.x = CANVAS_WIDTH - CIRCLE_SIZE/2;
    }
    if(this.position.x - CIRCLE_SIZE/2 < 0){
      this.position.x = CIRCLE_SIZE/2;
    }
    if(this.position.y + CIRCLE_SIZE/2 > CANVAS_HEIGHT){
      this.position.y = CANVAS_HEIGHT - CIRCLE_SIZE/2;
    }
    if(this.position.y - CIRCLE_SIZE/2 < 0){
      this.position.y = CIRCLE_SIZE/2;
    }
  }

  run(allSheep, dog, obstacles){
    this.bestNeighborPosition = this.nearestBestNeighbor(allSheep, dog, obstacles)
    this.move(allSheep, obstacles);
    this.checkCollision(obstacles);
    this.render();
  }
}

class Herd {
  constructor(){
    this.sheep = [];
  }

  addSheep(s) {
    this.sheep.push(s);
  }

  run(dog, obstacles){
    for (let s of this.sheep) {
      s.run(this.sheep, dog, obstacles);  // Passing the entire list of boids to each boid individually
    }
  }
}

const intersect = (x1, y1, x2, y2, x3, y3, x4, y4) => {
  let uA,uB;
  let den,numA,numB;

  den  = (y4-y3) * (x2-x1) - (x4-x3) * (y2-y1);
  numA = (x4-x3) * (y1-y3) - (y4-y3) * (x1-x3);
  numB = (x2-x1) * (y1-y3) - (y2-y1) * (x1-x3);
  

  //Coincident? - If true, displays intersection in center of line segment
   if (abs(numA) == 0 && abs(numB) == 0 && abs(den) == 0) {
      return(true);
   }

   //Parallel? - No intersection
   if (abs(den) == 0) {
      return(false);
   }

   //Intersection?
   uA = numA / den;
   uB = numB / den;
  
   //If both lie w/in the range of 0 to 1 then the intersection point is within both line segments.
   if (uA < 0 || uA > 1 || uB < 0 || uB > 1) {
      return(false);
   }

   return(true);
}
const obstacleInbetween = (sheep1, sheep2, obstacles) => {
  for(let obstacle of obstacles){
    if(intersect(sheep1.position.x, sheep1.position.y, sheep2.position.x, sheep2.position.y, obstacle.start.x, obstacle.start.y, obstacle.end.x, obstacle.end.y)){
      return true;
    }
  }
  return false;
}

class Dog {
  constructor(x, y){
    this.position = createVector(x, y);
  }

  render(){
    let c = color('red');
    fill(c);
    stroke(0)
    circle(this.position.x, this.position.y, CIRCLE_SIZE)
  }

  checkKeys(){
    if (keyIsDown(LEFT_ARROW)) {
      this.position.x -=  DOG_VELOCITY;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      this.position.x +=  DOG_VELOCITY;
    }
    if (keyIsDown(UP_ARROW)) {
      this.position.y -=  DOG_VELOCITY;
    }
    if (keyIsDown(DOWN_ARROW)) {
      this.position.y +=  DOG_VELOCITY;
    }
  
  }

  run(){
    this.checkKeys();
    this.render();
  }
}

class Obstacle{
  
  constructor(x1, y1, x2, y2){
    this.start = createVector(x1, y1);
    this.end = createVector(x2, y2);
  }

  render(){
    let c = color('blue');
    fill(c);
    line(this.start.x , this.start.y, this.end.x, this.end.y);
  }
}


let herd;
let dog;
let obstacles = [];

function setup() {
  // put setup code here
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  herd = new Herd();
  for (let i = 0; i < N_SHEEP; i++) {
    // s= new Sheep(250, 250, i);
    s = new Sheep(Math.random()*(CANVAS_WIDTH), Math.random()*CANVAS_HEIGHT, i);
    herd.addSheep(s);
  }

  dog = new Dog(Math.random()*(CANVAS_WIDTH), Math.random()*CANVAS_HEIGHT)

  obstacles.push(new Obstacle(-500, 100, 200, 100))
  obstacles.push(new Obstacle(250, 100, 1000, 100))
  // obstacles.push(new Obstacle(300, 100, 20, 200))

}

function draw() {
  // put drawing code here
  background(200);
  herd.run(dog, obstacles);
  dog.run();

  for(let obstacle of obstacles){
    obstacle.render();
  }
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    dog.position.y = dog.position.y - DOG_VELOCITY;
  } else if (keyCode === DOWN_ARROW) {
    dog.position.y = dog.position.y + DOG_VELOCITY;
  }
  if (keyCode === LEFT_ARROW) {
    dog.position.x = dog.position.x - 5;
  } else if (keyCode === RIGHT_ARROW) {
    dog.position.x = dog.position.x + 5;
  }
  
}