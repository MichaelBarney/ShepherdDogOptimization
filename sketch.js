let herd;

let goal;
let dog;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  frameRate(5);
  // 1 - Initialize Population
  goal = createVector(0, 0);
  dog = new Dog(0, 0);
  let sheep = [];
  for (let i = 0; i < N_SHEEP; i++) {
    const s = new Sheep(
      Math.random() * CANVAS_WIDTH - CANVAS_WIDTH / 2,
      Math.random() * CANVAS_HEIGHT - CANVAS_HEIGHT / 2
    );
    sheep.push(s);
  }
  herd = new Herd(sheep);
}

function draw() {
  // Coordinate System
  translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
  scale(1, -1);

  // Initial Drawing
  background(200);
  fill(color("green"));
  circle(goal.x, goal.y, CIRCLE_SIZE);

  // RUN
  herd.run(dog);
  dog.run(herd, goal);
}
