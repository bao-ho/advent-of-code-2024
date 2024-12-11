const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const map = [];
const rows = [];
stringInput.split("\n").forEach((string) => {
  const row = [];
  for (let i = 0; i < string.length; i++) {
    row.push(parseInt(string[i]));
  }
  rows.push(row);
});

for (let i = 0; i < rows[0].length; i++) {
  const column = [];
  for (let j = 0; j < rows.length; j++) {
    column.push(rows[j][i]);
  }
  map.push(column);
}

const WIDTH = map.length;
const HEIGHT = map[0].length;

let reachableNine = new Set();

const findPathToNine = ({ height, x, y }) => {
  const nextHeight = height + 1;
  //north
  if (y - 1 >= 0 && map[x][y - 1] === nextHeight) {
    if (nextHeight === 9) reachableNine.add(JSON.stringify({ x, y: y - 1 }));
    else findPathToNine({ height: nextHeight, x, y: y - 1 });
  }
  //east
  if (x + 1 < WIDTH && map[x + 1][y] === nextHeight) {
    if (nextHeight === 9) reachableNine.add(JSON.stringify({ x: x + 1, y }));
    findPathToNine({ height: nextHeight, x: x + 1, y });
  }
  //south
  if (y + 1 < HEIGHT && map[x][y + 1] === nextHeight) {
    if (nextHeight === 9) reachableNine.add(JSON.stringify({ x, y: y + 1 }));
    findPathToNine({ height: nextHeight, x, y: y + 1 });
  }
  //west
  if (x - 1 >= 0 && map[x - 1][y] === nextHeight) {
    if (nextHeight === 9) reachableNine.add(JSON.stringify({ x: x - 1, y }));
    findPathToNine({ height: nextHeight, x: x - 1, y });
  }
};

let sum = 0;
for (let y = 0; y < HEIGHT; y++) {
  for (let x = 0; x < WIDTH; x++) {
    if (map[x][y] !== 0) continue;
    reachableNine = new Set();
    findPathToNine({ height: 0, x, y });
    sum += reachableNine.size;
  }
}

console.log(sum);
