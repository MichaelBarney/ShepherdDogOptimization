class Dog {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.fitness = 0;
    this.status = 0;
  }

  render(herd) {
    this.calculateFitness(herd);

    let c = color("red");
    fill(c);
    stroke(0);
    circle(this.position.x, this.position.y, CIRCLE_SIZE);
  }

  calculateFitness(herd) {
    this.fitness = 0;
    for (let sheep of herd.sheep) {
      this.fitness += f(sheep.position);
    }
    this.fitness = (this.fitness / herd.sheep.length).toFixed(0);
  }

  move(herd) {
    let chosenSheep = null;

    // Original Prey Selection
    // let attrs = [];
    // let attrSum = 0;
    // for (const s of herd.sheep) {
    //   const distanceToDog =
    //     this.position.dist(s.position) / (CANVAS_HEIGHT / 2);
    //   const attr =
    //     1 -
    //     calculateSV(s.position, herd) *
    //       Math.pow(Math.E, -distanceToDog * distanceToDog);
    //   attrs.push(attr);
    //   attrSum += attr;
    // }
    // const probabilities = attrs.map((attr) => attr / attrSum);
    // const cumultProbabilities = probabilities.map(
    //   (
    //     (sum) => (value) =>
    //       (sum += value)
    //   )(0)
    // );
    // const dice = Math.random();
    // for (let i = 0; i < N_SHEEP; i++) {
    //   if (dice < cumultProbabilities[i]) {
    //     chosenSheep = herd.sheep[i];
    //     break;
    //   }
    // }

    // let worstSV = 1;
    // for (const sheep of herd.sheep) {
    //   const SV = calculateSV(sheep.position, herd, sheep.status);
    //   if (SV < worstSV) {
    //     worstSV = SV;
    //     chosenSheep = sheep;
    //   }
    // }

    let biggestDistance = 0;
    for (const sheep of herd.sheep) {
      const distanceToBest = sheep.position.dist(herd.bestPosition);
      if (distanceToBest > biggestDistance) {
        biggestDistance = distanceToBest;
        chosenSheep = sheep;
      }
    }

    line(
      this.position.x,
      this.position.y,
      chosenSheep.position.x,
      chosenSheep.position.y
    );

    let velocity = p5.Vector.sub(chosenSheep.position, this.position).mult(5);

    for (let sheep of herd.sheep) {
      let sheepRepulsion = p5.Vector.sub(this.position, sheep.position);

      sheepRepulsion.mult(
        2 * Math.random() * selfishness(this.position, sheep.position)
      );
      velocity.add(sheepRepulsion / N_SHEEP);
    }

    // const chosenSheep = herd.leader;

    velocity.mult(DOG_VELOCITY_MULT);

    this.position.add(velocity);
  }

  run(herd) {
    this.move(herd);
    this.render(herd);
  }
}
