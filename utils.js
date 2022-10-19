const f = (position) => {
  const optimal = createVector(0, 0);
  // const optimal = createVector(100, 100);
  // return position.dist(optimal);
  const ackley = objective(position.x, position.y);
  return ackley;
};
function objective(x, y) {
  return (
    -20.0 *
      Math.exp(-0.2 * Math.sqrt(0.5 * (Math.pow(x, 2) + Math.pow(y, 2)))) -
    Math.exp(0.5 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y))) +
    Math.E +
    20
  );
}

const selfishness = (aPosition, bPosition, SV) => {
  const distance = aPosition.dist(bPosition) / CANVAS_HEIGHT;
  if (SV) {
    return SV * Math.pow(Math.E, -1 * (distance * distance));
  } else {
    return Math.pow(Math.E, -1 * (distance * distance));
  }
};

const calculateSV = (position, herd, status) => {
  return 1 - (f(position) - herd.fBest) / (herd.fWorst - herd.fBest);
};
