let herd;

let goal;
let dog;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  frameRate(FRAME_RATE);
  // 1 - Initialize Population
  goal = createVector(0, 0);
  dog = new Dog(
    Math.random() * CANVAS_WIDTH - CANVAS_WIDTH / 2,
    Math.random() * CANVAS_WIDTH - CANVAS_WIDTH / 2
  );
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

const NUM_GENERATIONS = 30;
let generation = 0;
const NUM_ITERATIONS = 100;
let iteration = 0;
let progress = [];
let gen_progress = [];
function draw() {
  if (iteration == NUM_ITERATIONS) {
    iteration = 0;
    console.log(
      `Gen: ${generation} - Best: ${herd.fBest} - Mean: ${herd.meanSV}`
    );
    console.log(progress);
    progress = [];
    generation++;
    gen_progress.push(herd.fBest);
    console.log(gen_progress);
    setup();
  }
  // Coordinate System
  translate(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

  // Initial Drawing
  background(200);
  fill(color("green"));
  // circle(goal.x, goal.y, CIRCLE_SIZE);
  circle(mouseX - CANVAS_WIDTH / 2, mouseY - CANVAS_HEIGHT / 2, CIRCLE_SIZE);

  // RUN
  herd.run(dog);
  dog.run(herd, goal);

  iteration++;
  progress.push(herd.fBest);
}
