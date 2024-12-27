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
let start = "";
let end = "";
for (let i = 0; i < HEIGHT; i++) {
  const row = [];
  for (let j = 0; j < WIDTH; j++) {
    if (rows[i][j] === "S") {
      start = { x: j, y: i, score: 0, direction: "right" };
      row.push(".");
    } else if (rows[i][j] === "E") {
      end = { x: j, y: i };
      row.push(".");
    } else row.push(rows[i][j]);
  }
  map.push(row);
}

const getNextPositions = (position) => {
  const { x, y, direction, score } = position;
  const nextPositions = [];
  // north
  if (map[y - 1][x] === ".") {
    const newDirection = "up";
    if (direction === "up") nextPositions.push({ x, y: y - 1, direction: newDirection, score: score + 1 });
    else nextPositions.push({ x, y: y - 1, direction: newDirection, score: score + 1001 });
  }
  // south
  if (map[y + 1][x] === ".") {
    const newDirection = "down";
    if (direction === "down") nextPositions.push({ x, y: y + 1, direction: newDirection, score: score + 1 });
    else nextPositions.push({ x, y: y + 1, direction: newDirection, score: score + 1001 });
  }
  // east
  if (map[y][x + 1] === ".") {
    const newDirection = "right";
    if (direction === "right") nextPositions.push({ x: x + 1, y, direction: newDirection, score: score + 1 });
    else nextPositions.push({ x: x + 1, y, direction: newDirection, score: score + 1001 });
  }
  // west
  if (map[y][x - 1] === ".") {
    const newDirection = "left";
    if (direction === "left") nextPositions.push({ x: x - 1, y, direction: newDirection, score: score + 1 });
    else nextPositions.push({ x: x - 1, y, direction: newDirection, score: score + 1001 });
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
  const { x: X, y: Y } = currentPosition;
  if (map[Y][X] === "." || parseInt(map[Y][X]) > currentPosition.score) map[Y][X] = `${currentPosition.score}`;
  if (X === xe && Y === ye) break;
  const nextPositions = getNextPositions(currentPosition);
  queue.push(...nextPositions);
}

fs.writeFileSync(`${currentDir}/output.txt`, map.map((row) => JSON.stringify(row)).join("\n"), { encoding: "utf8" });
console.log(map[ye][xe]);
