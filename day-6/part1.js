const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const mapString = stringInput.split("\n");

const map = [];
let startPosition;
mapString.forEach((rowString, i) => {
  const row = [];
  rowString.split("").forEach((pos, j) => {
    if (pos === "^") {
      row.push(true);
      startPosition = [j, i];
    } else if (pos === ".") {
      row.push(true);
    } else {
      row.push(false);
    }
  });
  map.push(row);
});

let direction = "up";
const pos = [...startPosition];
const height = map.length;
const width = map[0].length;
const visited = new Set();
for (let i = 0; true; i++) {
  const [x, y] = pos;
  if (direction === "up") {
    if (y === 0) {
      visited.add(JSON.stringify(pos));
      break;
    }
    if (map[y - 1][x]) {
      visited.add(JSON.stringify(pos));
      pos[1] = y - 1;
    } else {
      direction = "right";
      continue;
    }
  }
  if (direction === "right") {
    if (x === width - 1) {
      visited.add(JSON.stringify(pos));
      break;
    }
    if (map[y][x + 1]) {
      visited.add(JSON.stringify(pos));
      pos[0] = x + 1;
    } else {
      direction = "down";
      continue;
    }
  }
  if (direction === "down") {
    if (y === height - 1) {
      visited.add(JSON.stringify(pos));
      break;
    }
    if (map[y + 1][x]) {
      visited.add(JSON.stringify(pos));
      pos[1] = y + 1;
    } else {
      direction = "left";
      continue;
    }
  }

  if (direction === "left") {
    if (x === 0) {
      visited.add(JSON.stringify(pos));

      break;
    }
    if (map[y][x - 1]) {
      visited.add(JSON.stringify(pos));

      pos[0] = x - 1;
    } else {
      direction = "up";
      continue;
    }
  }
}
const visitedArrayStrings = Array.from(visited);
const visitedArray = visitedArrayStrings.map((string) => JSON.parse(string));

console.log(visitedArray);
