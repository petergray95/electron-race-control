/*
 (c) 2017, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

// square distance between 2 points
function getSqDist(p1, p2) {
  const dx = p1.time - p2.time;
  const dy = p1.value - p2.value;

  return dx * dx + dy * dy;
}

// square distance from a point to a segment
function getSqSegDist(p, p1, p2) {
  let x = p1.time;
  let y = p1.value;
  let dx = p2.time - x;
  let dy = p2.value - y;

  if (dx !== 0 || dy !== 0) {
    const t = ((p.time - x) * dx + (p.value - y) * dy) / (dx * dx + dy * dy);

    if (t > 1) {
      x = p2.time;
      y = p2.value;
    } else if (t > 0) {
      x += dx * t;
      y += dy * t;
    }
  }

  dx = p.time - x;
  dy = p.value - y;

  return dx * dx + dy * dy;
}
// rest of the code doesn't care about point format

// basic distance-based simplification
function simplifyRadialDist(points, sqTolerance) {
  let prevPoint = points[0];
  const newPoints = [prevPoint];
  let point;

  for (let i = 1, len = points.length; i < len; i += 1) {
    point = points[i];

    if (getSqDist(point, prevPoint) > sqTolerance) {
      newPoints.push(point);
      prevPoint = point;
    }
  }

  if (prevPoint !== point) newPoints.push(point);

  return newPoints;
}

function simplifyDPStep(points, first, last, sqTolerance, simplified) {
  let maxSqDist = sqTolerance;
  let index;

  for (let i = first + 1; i < last; i += 1) {
    const sqDist = getSqSegDist(points[i], points[first], points[last]);

    if (sqDist > maxSqDist) {
      index = i;
      maxSqDist = sqDist;
    }
  }

  if (maxSqDist > sqTolerance) {
    if (index - first > 1)
      simplifyDPStep(points, first, index, sqTolerance, simplified);
    simplified.push(points[index]);
    if (last - index > 1)
      simplifyDPStep(points, index, last, sqTolerance, simplified);
  }
}

// simplification using Ramer-Douglas-Peucker algorithm
function simplifyDouglasPeucker(points, sqTolerance) {
  const last = points.length - 1;

  const simplified = [points[0]];
  simplifyDPStep(points, 0, last, sqTolerance, simplified);
  simplified.push(points[last]);

  return simplified;
}

// both algorithms combined for awesome performance
export default function simplifyPoints(points, tolerance, highestQuality) {
  if (points.length <= 2) return points;

  const sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

  const radialDistPoints = highestQuality
    ? points
    : simplifyRadialDist(points, sqTolerance);
  const douglasPeuckerPoints = simplifyDouglasPeucker(
    radialDistPoints,
    sqTolerance
  );

  return douglasPeuckerPoints;
}
