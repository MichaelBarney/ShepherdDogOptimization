const f = (position) => {
  return position.dist(
    createVector(mouseX - CANVAS_WIDTH / 2, mouseY - CANVAS_HEIGHT / 2)
  );
  // return ackley(position.x, position.y);
  // return rastrigin(position.x, position.y);
};
function ackley(x, y) {
  return (
    -20.0 *
      Math.exp(-0.2 * Math.sqrt(0.5 * (Math.pow(x, 2) + Math.pow(y, 2)))) -
    Math.exp(0.5 * (Math.cos(2 * Math.PI * x) + Math.cos(2 * Math.PI * y))) +
    Math.E +
    20
  );
}

function rastrigin(x, y) {
  return (
    x ** 2 -
    10 * Math.cos(2 * Math.PI * x) +
    (y * y - 10 * Math.cos(2 * Math.PI * y)) +
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
