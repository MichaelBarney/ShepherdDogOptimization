class Sheep {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.centerOfMassPosition = this.position;
    this.velocity = createVector(0, 0);
    this.status = null;
    this.attractiveness = 0;
  }

  nearestBestNeighbor(herd) {
    //1. it is the nearest herd member to me (other than the herd’s leader);
    //2. it has better survival aptitudes than me
    let bestDistance = Infinity;
    let bestSheepNeighbor = null;
    const mySV = calculateSV(this.position, herd, this.status);

    for (const s of herd.sheep) {
      if (s != this && s.status != "l") {
        const candidateDistanceToMe = s.position.dist(this.position);

        if (
          candidateDistanceToMe < bestDistance &&
          calculateSV(s.position, herd, s.status) > mySV
        ) {
          bestSheepNeighbor = s;
          bestDistance = candidateDistanceToMe;
        }
      }
    }
    return bestSheepNeighbor;
  }

  setStatus(herd) {
    // fd (Folower Dominant) | fs (Folower Subordinate) | d (Deserter)
    const rand = Math.random();
    // console.log(calculateSV(this.position, herd, this.status), rand);
    // Follower
    if (this == herd.leader) {
      this.status = "l";
    } else if (calculateSV(this.position, herd, this.status) >= rand) {
      if (calculateSV(this.position, herd, this.status) >= herd.meanSV)
        this.status = "fd";
      else this.status = "fs";
    }
    // Deserter
    else {
      this.status = "d";
    }
    // this.status = "fs";
    return this.status;
  }

  move(herd, dog) {
    this.velocity = createVector(0, 0);

    // const SVPredator = calculateSV(dog.position, herd);
    // const predatorRepulsion = p5.Vector.sub(dog.position, this.position);
    const distanceToDog = this.position.dist(dog.position) / CANVAS_HEIGHT;
    // predatorRepulsion.mult(-distanceToDog);

    // let predatorRepulsion = p5.Vector.sub(this.position, dog.position);
    // const dogRepulstionMagnitude =
    //   SHEEP_VELOCITY *
    //   Math.pow(Math.E, -((distanceToDog * distanceToDog) / (100 * 100)));
    // predatorRepulsion.setMag(dogRepulstionMagnitude);
    // this.position.add(predatorRepulsion);

    // let predatorRepulsion = p5.Vector.sub(this.position, dog.position);
    // predatorRepulsion.mult(2 * selfishness(this.position, dog.position));
    // this.velocity.add(predatorRepulsion);

    // line(
    //   this.position.x,
    //   this.position.y,
    //   predatorRepulsion.x,
    //   predatorRepulsion.y
    // );

    if (this.status == "l") {
      if (calculateSV(this.position, herd, herd, this.status) == 1) {
        // Seemingly Cooperative Leadership
        const SVPredator = calculateSV(dog.position, herd);
        this.velocity = p5.Vector.sub(dog.position, this.position);
        this.velocity.mult(
          -2 *
            Math.random() *
            selfishness(this.position, dog.position, SVPredator)
        );
      } else {
        // Openly Selfish Leadership
        this.velocity = p5.Vector.sub(herd.bestPosition, this.position);
        this.velocity = this.velocity.mult(
          2 * Math.random() * selfishness(this.position, herd.bestPosition)
        );
      }
    } else if (this.status == "fd") {
      // Nearest Neighbor Movement Rule
      const leaderSV = calculateSV(herd.leader.position, herd, this.status);
      let leaderAttraction = p5.Vector.sub(herd.leader.position, this.position);
      leaderAttraction = leaderAttraction.mult(
        Math.random() *
          selfishness(this.position, herd.leader.position, leaderSV)
      );
      const bestNeighbor = this.nearestBestNeighbor(herd);
      if (bestNeighbor) {
        const bestNeighborSV = calculateSV(
          bestNeighbor.position,
          herd,
          bestNeighbor.status
        );
        let bestNeighborAttraction = p5.Vector.sub(
          bestNeighbor.position,
          this.position
        );
        bestNeighborAttraction = bestNeighborAttraction.mult(
          Math.random() *
            selfishness(this.position, bestNeighbor.position, bestNeighborSV)
        );
        this.velocity = p5.Vector.add(
          leaderAttraction,
          bestNeighborAttraction
        ).mult(2);
      } else {
        this.velocity = leaderAttraction;
      }
      // this.velocity.setMag(SHEEP_VELOCITY);
      // this.velocity.add(predatorRepulsion);
    } else if (this.status == "fs") {
      // Crowded Horizon Movement
      fill(color("orange"));
      circle(herd.centerOfMass.x, herd.centerOfMass.y, CIRCLE_SIZE / 3);
      const centerOfMassSV = calculateSV(herd.centerOfMass, herd);
      this.velocity = p5.Vector.sub(herd.centerOfMass, this.position);
      this.velocity.mult(
        2 *
          Math.random() *
          selfishness(this.position, herd.centerOfMass, centerOfMassSV)
      );
    } else {
      // Herd Desertion
      const attractionToBestPosition = p5.Vector.sub(
        herd.bestPosition,
        this.position
      ).mult(Math.random() * selfishness(this.position, herd.bestPosition));

      const attractionToRandom = p5.Vector.random2D().mult(
        Math.random() * (1 - calculateSV(this.position, herd))
      );

      this.velocity = p5.Vector.add(
        attractionToBestPosition,
        attractionToRandom
      ).mult(2);
    }

    this.velocity.mult(SHEEP_VELOCITY_MULT);
    this.position.add(this.velocity);
  }

  run(herd, dog) {
    this.setStatus(herd);
    this.move(herd, dog);
    this.render();
  }

  render() {
    let c =
      this.status == "l"
        ? color("black")
        : this.status == "d"
        ? color("blue")
        : this.status == "fd"
        ? color("yellow")
        : color("white");

    stroke(0);
    fill(c);
    circle(this.position.x, this.position.y, CIRCLE_SIZE);

    stroke(175);
    // line(
    //   this.position.x,
    //   this.position.y,
    //   bestNeighborPosition.x,
    //   bestNeighborPosition.y
    // );

    stroke(0);
    // line(
    //   this.position.x,
    //   this.position.y,
    //   this.centerOfMassPosition.x,
    //   this.centerOfMassPosition.y
    // );
    noFill();
    // circle(this.position.x, this.position.y, SHEEP_SIGHT_FOR_DOG*2)
  }
}

class Herd {
  constructor(sheep) {
    this.sheep = sheep;
    const fs = sheep.sort((a, b) => f(a.position) - f(b.position));
    this.fBest = f(sheep[0].position);
    this.fWorst = f(sheep[sheep.length - 1].position);
    this.bestPosition = sheep[0].position;

    this.leader = null;
    this.meanSV = null;
    this.centerOfMass = null;
  }

  calculateSVs() {
    let bestSV = 0;
    let SVSum = 0;
    let SVDistanceSum = createVector(0, 0);

    for (const [i, s] of this.sheep.entries()) {
      const sheepF = f(s.position);
      const SV = calculateSV(s.position, this, s.status);
      SVSum += SV;
      SVDistanceSum.add(p5.Vector.mult(s.position, SV));

      // Define Leader
      if (SV > bestSV) {
        this.leader = s;
        bestSV = SV;
      }

      // Get bestF and bestPosition
      if (sheepF < this.fBest) {
        this.fBest = sheepF;
        this.bestPosition = s.position;
      }

      // Get worstF
      if (this.sheep > this.fWorst) {
        this.fWorst = sheepF;
      }
    }

    this.meanSV = SVSum / this.sheep.length;
    this.centerOfMass = p5.Vector.div(SVDistanceSum, SVSum);
  }
  run(dog) {
    this.calculateSVs();
    for (let s of this.sheep) {
      s.run(this, dog); // Passing the entire list of boids to each boid individually
    }
  }
}
