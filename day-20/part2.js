const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const rows = stringInput.split("\n");
const WIDTH = rows[0].length;
const HEIGHT = rows.length;
const MAP = [];
let START;
let END;
const INFINITY = 1000000;
for (let i = 0; i < HEIGHT; i++) {
  const row = [];
  for (let j = 0; j < WIDTH; j++) {
    if (rows[i][j] === "S") {
      START = { x: j, y: i };
      row.push(".");
    } else if (rows[i][j] === "E") {
      END = { x: j, y: i };
      row.push(".");
    } else row.push(rows[i][j]);
  }
  MAP.push(row);
}

// Get distance between two positions in a map
const getDistance = (
  start,
  end,
  pathCharacter,
  northBorder = 0,
  southBorder = HEIGHT - 1,
  eastBorder = WIDTH - 1,
  westBorder = 0
) => {
  let { x: xs, y: ys } = start;
  let { x: xe, y: ye } = end;
  xs = start.x - westBorder;
  ys = start.y - northBorder;
  xe = end.x - westBorder;
  ye = end.y - northBorder;

  // initialize map, we will write distance from start into this map
  const map = [];
  for (let i = northBorder; i <= southBorder; i++) {
    const row = [];
    for (let j = westBorder; j <= eastBorder; j++) {
      if (pathCharacter === "*") row.push("o"); // wildcard, any character counts as path
      else if (MAP[i][j] === pathCharacter) row.push("o");
      else row.push("x");
    }
    map.push(row);
  }
  map[ys][xs] = "o";
  map[ye][xe] = "o";

  const extractData = (position) => {
    const [x, y, n] = position.split(",").map((s) => parseInt(s));
    return [x, y, n];
  };

  const getNextPositions = (position) => {
    const [x, y, n] = extractData(position);
    const nextPositions = [];
    if (y - 1 >= 0 && map[y - 1][x] === "o") nextPositions.push(`${x},${y - 1},${n + 1}`); // norths
    if (y + 1 <= southBorder - northBorder && map[y + 1][x] === "o")
      nextPositions.push(`${x},${y + 1},${n + 1}`); // south
    if (x + 1 <= eastBorder - westBorder && map[y][x + 1] === "o")
      nextPositions.push(`${x + 1},${y},${n + 1}`); // east
    if (x - 1 >= 0 && map[y][x - 1] === "o") nextPositions.push(`${x - 1},${y},${n + 1}`); // west
    return nextPositions;
  };

  // BSF, label distance start to every position of the map
  const queue = [];
  map[ys][xs] = "0";
  queue.push(`${xs},${ys},0`);
  while (queue.length > 0) {
    const currentPosition = queue.shift();
    const [X, Y, N] = extractData(currentPosition);
    if (X === xe && Y === ye) return { n: N, numberedMap: map };
    const nextPositions = getNextPositions(currentPosition);
    nextPositions.forEach((np) => {
      const [x, y, n] = extractData(np);
      map[y][x] = `${n}`;
      queue.push(np);
    });
  }
  return { n: INFINITY };
};

const cheat = () => {
  // number distance from start to a position on MAP
  const { numberedMap } = getDistance(START, END, ".");

  // collect and sort positions based on its distance from start
  const numberedPositions = [];
  for (let i = 1; i < HEIGHT - 1; i++) {
    for (let j = 1; j < WIDTH - 1; j++) {
      const distanceFromStart = parseInt(numberedMap[i][j]);
      if (!isNaN(distanceFromStart)) {
        numberedPositions.push({ distanceFromStart, x: j, y: i });
      }
    }
  }
  numberedPositions.sort((a, b) => a.distanceFromStart - b.distanceFromStart);

  // calculate path length between two numbered positions, if we step on walls
  const getCheatSteps = (position1, position2, maxDistance) => {
    const { x: x1, y: y1 } = position1;
    const { x: x2, y: y2 } = position2;
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);

    const n = maxX - minX + maxY - minY;
    return n > maxDistance ? INFINITY : n;
    // if (maxX - minX + maxY - minY > maxDistance) return INFINITY;
    // const { n } = getDistance(position1, position2, "*", minY, maxY, maxX, minX);
    // return n;
  };

  const MIN_SAVE = 100;
  const MAX_STEPS = 20;
  let cheatCount = 0;
  for (let i = 0; i < numberedPositions.length; i++) {
    for (let j = i + 1; j < numberedPositions.length; j++) {
      const { distanceFromStart: di } = numberedPositions[i];
      const { distanceFromStart: dj } = numberedPositions[j];
      if (dj - di >= MIN_SAVE) {
        const nCheatSteps = getCheatSteps(numberedPositions[i], numberedPositions[j], MAX_STEPS);
        savedSteps = dj - (di + nCheatSteps);
        if (nCheatSteps <= MAX_STEPS && savedSteps >= MIN_SAVE) {
          cheatCount += 1;
        }
      }
    }
    console.log(i);
  }
  return cheatCount;
};

console.log(cheat());
