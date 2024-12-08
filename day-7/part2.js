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
let pos = [...startPosition];
const height = map.length;
const width = map[0].length;
let visited = new Set();
let count = 0;

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
// console.log(visitedArray);

visitedArray.forEach((visitedPosition) => {
  const [i, j] = visitedPosition;
  if (i === pos[0] && j === pos[1]) {
    return;
  }
  if (!map[j][i]) {
    return;
  }
  // Walk
  const currentMap = JSON.parse(JSON.stringify(map));
  currentMap[j][i] = false;
  pos = [...startPosition];
  visited = new Set();
  direction = "up";
  for (let k = 0; true; k++) {
    const [x, y] = pos;
    if (direction === "up") {
      if (y === 0) {
        break;
      }
      if (currentMap[y - 1][x]) {
        const nextStep = `${JSON.stringify(pos)}${direction}`;
        if (visited.has(nextStep)) {
          count += 1;
          break;
        }
        visited.add(nextStep);
        pos[1] = y - 1;
      } else {
        direction = "right";
        continue;
      }
    }
    if (direction === "right") {
      if (x === width - 1) {
        break;
      }
      if (currentMap[y][x + 1]) {
        const nextStep = `${JSON.stringify(pos)}${direction}`;
        if (visited.has(nextStep)) {
          count += 1;
          break;
        }
        visited.add(nextStep);
        pos[0] = x + 1;
      } else {
        direction = "down";
        continue;
      }
    }
    if (direction === "down") {
      if (y === height - 1) {
        break;
      }
      if (currentMap[y + 1][x]) {
        const nextStep = `${JSON.stringify(pos)}${direction}`;
        if (visited.has(nextStep)) {
          count += 1;
          break;
        }
        visited.add(nextStep);
        pos[1] = y + 1;
      } else {
        direction = "left";
        continue;
      }
    }

    if (direction === "left") {
      if (x === 0) {
        break;
      }
      if (currentMap[y][x - 1]) {
        const nextStep = `${JSON.stringify(pos)}${direction}`;
        if (visited.has(nextStep)) {
          count += 1;
          break;
        }
        visited.add(nextStep);
        pos[0] = x - 1;
      } else {
        direction = "up";
        continue;
      }
    }
  }
});

// for (let i = 0; i < width; i++) {
//   for (let j = 0; j < height; j++) {
//   }
// }

console.log(count);
