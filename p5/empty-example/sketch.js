const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 500;

const N_SHEEP = 10;
const CIRCLE_SIZE = 25;

const SHEEP_SIGHT = 150;
const SHEEP_VELOCITY = 0.5;

const DOG_VELOCITY = 2;
class Sheep {
  constructor(x, y, index){
    this.position = createVector(x, y);
    this.index = index;
    this.bestNeighborPosition = this.position;
  }

  render(){
    let c = color('white');
    if(this.position.dist(dog.position) < SHEEP_SIGHT){
      c = color('green');
    }
    stroke(0)
    fill(c);
    circle(this.position.x, this.position.y, CIRCLE_SIZE)

    stroke(175)
    line(this.position.x, this.position.y, this.bestNeighborPosition.x, this.bestNeighborPosition.y)

    noFill();
    circle(this.position.x, this.position.y, SHEEP_SIGHT*2)
  }

  nearestBestNeighbor(allSheep, dog){
    const myDistanceToDog = this.position.dist(dog.position);

    if(myDistanceToDog > SHEEP_SIGHT){
      return this.position;
    }

    let bestNeighborIndex = this.index;
    let bestDistance = myDistanceToDog;

    for(let i = 0; i < N_SHEEP; i++){
      if(i != this.index){
        const sheepDistanceToDog = allSheep[i].position.dist(dog.position);
        const sheepDistanceToMe = allSheep[i].position.dist(this.position);
        if(sheepDistanceToDog > bestDistance && 
          sheepDistanceToMe < SHEEP_SIGHT &&
          sheepDistanceToMe > CIRCLE_SIZE){
          bestNeighborIndex = i;
          bestDistance = sheepDistanceToDog;
        }
      }
    }

    return allSheep[bestNeighborIndex].position;
  }

  move(){
    // let dir = this.bestNeighborPosition.sub(this.position);
    let sheepAttraction = p5.Vector.sub(this.bestNeighborPosition, this.position);
    sheepAttraction.setMag(5);

    const distanceToDog = this.position.dist(dog.position);

    let dogRepulsion = p5.Vector.sub(this.position, dog.position);
    const dogRepulstionMagnitude = distanceToDog < SHEEP_SIGHT ? 1 : 0;
    dogRepulsion.setMag(dogRepulstionMagnitude);

    let resultingForce = sheepAttraction.add(dogRepulsion)
    resultingForce.setMag(SHEEP_VELOCITY*(SHEEP_SIGHT/distanceToDog - 1))

    // Update the position with the acceleration
    this.position.add(resultingForce);
  }

  run(allSheep, dog){
    this.bestNeighborPosition = this.nearestBestNeighbor(allSheep, dog)
    this.move();
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