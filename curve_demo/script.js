const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const P0 = { x: 100, y: 200 }; // A
const P1 = { x: 200, y: 300 }; // A curve
const P2 = { x: 400, y: 50 }; // B curve
const P3 = { x: 500, y: 300 }; // B

// Výpočet bodu na Bézierově křivce
function bezierPoint(t, P0, P1, P2, P3) {
  const x = Math.pow(1 - t, 3) * P0.x +
            3 * Math.pow(1 - t, 2) * t * P1.x +
            3 * (1 - t) * Math.pow(t, 2) * P2.x +
            Math.pow(t, 3) * P3.x;
  const y = Math.pow(1 - t, 3) * P0.y +
            3 * Math.pow(1 - t, 2) * t * P1.y +
            3 * (1 - t) * Math.pow(t, 2) * P2.y +
            Math.pow(t, 3) * P3.y;
  return { x, y };
}

// Spočítej přibližně rovnoměrné body
function getEvenlySpacedPoints(P0, P1, P2, P3, segmentLength = 5) {
  const tempPoints = [];
  const totalSteps = 1000;
  for (let i = 0; i <= totalSteps; i++) {
    const t = i / totalSteps;
    tempPoints.push(bezierPoint(t, P0, P1, P2, P3));
  }

  const evenPoints = [tempPoints[0]];
  let distAcc = 0;

  for (let i = 1; i < tempPoints.length; i++) {
    const prev = evenPoints[evenPoints.length - 1];
    const curr = tempPoints[i];
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (distAcc + dist >= segmentLength) {
      evenPoints.push(curr);
      distAcc = 0;
    } else {
      distAcc += dist;
    }
  }

  return evenPoints;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Získej rovnoměrné body
  const points = getEvenlySpacedPoints(P0, P1, P2, P3, 900);

  // Vykresli body
  ctx.fillStyle = "black";
  for (let pt of points) {
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // Nakresli kontrolní body
  for (let p of [P0, P1, P2, P3]) {
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

draw();
