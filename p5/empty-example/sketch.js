const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 500;

const N_SHEEP = 10;
const CIRCLE_SIZE = 25;

const SHEEP_SIGHT_FOR_DOG = 150;
const SHEEP_SIGHT_FOR_OTHER_SHEEP = 150;

const SHEEP_VELOCITY = 1;
const DOG_VELOCITY = 2;

const IMPORTANCE_DOG = 1;
const IMPORTANCE_BEST_SHEEP = 2;

const SHEEP_REPULSION_FACTOR = 0.5;

class Sheep {
  constructor(x, y, index){
    this.position = createVector(x, y);
    this.index = index;
    this.bestNeighborPosition = this.position;
  }

  render(){
    let c = color('white');
    if(this.position.dist(dog.position) < SHEEP_SIGHT_FOR_DOG){
      c = color('green');
    }
    stroke(0)
    fill(c);
    circle(this.position.x, this.position.y, CIRCLE_SIZE)

    stroke(175)
    line(this.position.x, this.position.y, this.bestNeighborPosition.x, this.bestNeighborPosition.y)

    noFill();
    circle(this.position.x, this.position.y, SHEEP_SIGHT_FOR_DOG*2)
  }

  nearestBestNeighbor(allSheep, dog){
    const myDistanceToDog = this.position.dist(dog.position);

    if(myDistanceToDog > SHEEP_SIGHT_FOR_DOG){
      return this.position;
    }

    let bestNeighborIndex = this.index;
    let bestDistance = myDistanceToDog;

    for(let i = 0; i < N_SHEEP; i++){
      if(i != this.index){
        const sheepDistanceToDog = allSheep[i].position.dist(dog.position);
        const sheepDistanceToMe = allSheep[i].position.dist(this.position);
        if(sheepDistanceToDog > bestDistance && 
          sheepDistanceToMe < SHEEP_SIGHT_FOR_OTHER_SHEEP &&
          sheepDistanceToMe > CIRCLE_SIZE){
          bestNeighborIndex = i;
          bestDistance = sheepDistanceToDog;
        }
      }
    }

    return allSheep[bestNeighborIndex].position;
  }

  move(allSheep){
    // Sheep Attraction
    let selfishAttractionToBest = p5.Vector.sub(this.bestNeighborPosition, this.position);
    const distanceBestToDog = this.bestNeighborPosition.dist(dog.position);
    const distanceToBest = this.bestNeighborPosition.dist(this.position);
    selfishAttractionToBest.setMag(1000000000000 * distanceBestToDog*Math.pow(Math.E, -distanceToBest));


    //Dog Repulsion
    const distanceToDog = this.position.dist(dog.position);
    let dogRepulsion = p5.Vector.sub(this.position, dog.position);
    const dogRepulstionMagnitude = SHEEP_VELOCITY*Math.pow(Math.E, -(distanceToDog*distanceToDog/(SHEEP_SIGHT_FOR_DOG*SHEEP_SIGHT_FOR_DOG)));
    dogRepulsion.setMag(dogRepulstionMagnitude);
    console.log("Dog Repulsion", dogRepulstionMagnitude)
    let resultingForce = selfishAttractionToBest.add(dogRepulsion)
    resultingForce.setMag(SHEEP_VELOCITY)

    this.position.add(dogRepulsion);

    // SHeep Repulsion
    // for (let sheep of allSheep){
    //   if(sheep.position != this.position){
    //     const sheepRepulsion = p5.Vector.sub(this.position, sheep.position);
    //     sheepRepulsion.setMag(SHEEP_REPULSION_FACTOR*SHEEP_VELOCITY * 1/(sheep.position.dist(this.position)));
    //     this.position.add(sheepRepulsion);
    //   }
    // }
  }

  checkCollision(){
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

  run(allSheep, dog){
    this.bestNeighborPosition = this.nearestBestNeighbor(allSheep, dog)
    this.move(allSheep);
    this.checkCollision();
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

  run(dog){
    for (let s of this.sheep) {
      s.run(this.sheep, dog);  // Passing the entire list of boids to each boid individually
    }
  }
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




let herd;
let dog;

function setup() {
  // put setup code here
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);

  herd = new Herd();
  for (let i = 0; i < N_SHEEP; i++) {
    s = new Sheep(Math.random()*(CANVAS_WIDTH), Math.random()*CANVAS_HEIGHT, i);
    herd.addSheep(s);
  }

  dog = new Dog(Math.random()*(CANVAS_WIDTH), Math.random()*CANVAS_HEIGHT)

}

function draw() {
  // put drawing code here
  background(200);
  herd.run(dog);
  dog.run();
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