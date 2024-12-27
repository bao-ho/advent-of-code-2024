const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const rows = stringInput.split("\n");
const WIDTH = rows[0].length;
const HEIGHT = rows.length;

// initialize map
const map = [];
const scoreMap = [];
let start = "";
let end = "";
for (let i = 0; i < HEIGHT; i++) {
  const row = [];
  const scoreRow = [];
  for (let j = 0; j < WIDTH; j++) {
    if (rows[i][j] === "S") {
      start = { x: j, y: i, score: 0, parent: null, direction: "right" };
      row.push(".");
    } else if (rows[i][j] === "E") {
      end = { x: j, y: i };
      row.push(".");
    } else row.push(rows[i][j]);
    scoreRow.push({});
  }
  map.push(row);
  scoreMap.push(scoreRow);
}

const getNextPositions = (position) => {
  const { x, y, direction: directionFromParent, parent, score } = position;
  const allDirectionsFromParents = Object.keys(scoreMap[y][x]);
  const nextPositions = [];
  // north
  // should be an path, and its child should not be its parent
  if (map[y - 1][x] === "." && !allDirectionsFromParents.includes("down")) {
    const direction = "up";
    if (directionFromParent === "up")
      nextPositions.push({ x, y: y - 1, direction, parent: { x, y }, score: score + 1 });
    else nextPositions.push({ x, y: y - 1, direction, parent: { x, y }, score: score + 1001 });
  }
  // south
  if (map[y + 1][x] === "." && !allDirectionsFromParents.includes("up")) {
    const direction = "down";
    if (directionFromParent === "down")
      nextPositions.push({ x, y: y + 1, direction, parent: { x, y }, score: score + 1 });
    else nextPositions.push({ x, y: y + 1, direction, parent: { x, y }, score: score + 1001 });
  }
  // east
  if (map[y][x + 1] === "." && !allDirectionsFromParents.includes("left")) {
    const direction = "right";
    if (directionFromParent === "right")
      nextPositions.push({ x: x + 1, y, direction, parent: { x, y }, score: score + 1 });
    else nextPositions.push({ x: x + 1, y, direction, parent: { x, y }, score: score + 1001 });
  }
  // west
  if (map[y][x - 1] === "." && !allDirectionsFromParents.includes("right")) {
    const direction = "left";
    if (directionFromParent === "left")
      nextPositions.push({ x: x - 1, y, direction, parent: { x, y }, score: score + 1 });
    else nextPositions.push({ x: x - 1, y, direction, parent: { x, y }, score: score + 1001 });
  }
  return nextPositions;
};

// BSF
const queue = [];
const { x: xe, y: ye } = end;
queue.push(start);
while (queue.length > 0) {
  queue.sort((a, b) => a.score - b.score);
  const currentPosition = queue.shift();
  const { x, y, direction, parent, score } = currentPosition;
  if (map[y][x] === "." && (!scoreMap[y][x][direction] || scoreMap[y][x][direction].score > score))
    scoreMap[y][x][direction] = { parent, score };

  // if (x === xe && y === ye) break;
  const nextPositions = getNextPositions(currentPosition);
  queue.push(...nextPositions);
}

// Trace back from END
const traceSet = new Set();
const getAllTraces = ({ x, y }) => {
  if (x === start.x && y === start.y) {
    console.log("here");
  }
  traceSet.add(JSON.stringify({ x, y }));
  if (x !== start.x || y !== start.y) {
    let allParents = Object.values(scoreMap[y][x]).map((value) => value.parent);
    if (x === end.x && y === end.y) {
      allParents = [Object.values(scoreMap[end.y][end.x]).sort((a, b) => a.score - b.score)[0].parent];
    }
    allParents.forEach((parent) => {
      if (!traceSet.has(JSON.stringify(parent))) getAllTraces(parent);
    });
  }
};

// Select only min score parent of END

getAllTraces(end);
console.log(traceSet.size);


traceSet.forEach(element=>{
  const {x,y} = JSON.parse(element)
  map[y][x] = 'o';
})

let mapAsString = "";
map.forEach((row) => {
  const rowAsString = row.join("");
  mapAsString = `${mapAsString}${rowAsString}\n`;
});


fs.writeFileSync(`${currentDir}/output.txt`, mapAsString, { encoding: "utf8" });

