const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const bytes = stringInput.split("\n").map((row) => row.split(",").map((n) => parseInt(n)));
const WIDTH = 71;
const HEIGHT = 71;
const NBYTES = 1024;
const map = [];
for (let i = 0; i < HEIGHT; i++) {
  const row = [];
  for (let j = 0; j < WIDTH; j++) {
    row.push(".");
  }
  map.push(row);
}
for (let i = 0; i < NBYTES; i++) {
  const [x, y] = bytes[i];
  map[y][x] = "#";
}

const extractData = (position) => {
  const [x, y, n] = position.split(",").map((s) => parseInt(s));
  return [x, y, n];
};

const getNextPositions = (position) => {
  const [x, y, n] = extractData(position);
  const nextPositions = [];
  // north
  if (y - 1 >= 0 && map[y - 1][x] === ".") nextPositions.push(`${x},${y - 1},${n + 1}`);
  // south
  if (y + 1 < HEIGHT && map[y + 1][x] === ".") nextPositions.push(`${x},${y + 1},${n + 1}`);
  // east
  if (x + 1 < WIDTH && map[y][x + 1] === ".") nextPositions.push(`${x + 1},${y},${n + 1}`);
  // west
  if (x - 1 >= 0 && map[y][x - 1] === ".") nextPositions.push(`${x - 1},${y},${n + 1}`);
  return nextPositions;
};

const queue = [];
map[0][0] = "O";
queue.push("0,0,0");
while (queue.length > 0) {
  const currentPosition = queue.shift();
  const [X, Y, N] = extractData(currentPosition);
  if (X === WIDTH - 1 && Y === HEIGHT - 1) {
    console.log(N);
    break;
  }
  const nextPositions = getNextPositions(currentPosition);
  nextPositions.forEach((np) => {
    const [x, y] = extractData(np);
    map[y][x] = "O";
    queue.push(np);
  });
}
