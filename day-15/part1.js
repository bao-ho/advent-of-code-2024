const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const [mapString, moveStringWithNewliens] = stringInput.split("\n\n");
const moveString = moveStringWithNewliens.replaceAll("\n", "");

const rows = mapString.split("\n");
const WIDTH = rows[0].length;
const HEIGHT = rows.length;
const map = [];
let robot = { x: -1, y: -1 };
for (let i = 0; i < HEIGHT; i++) {
  const row = [];
  for (let j = 0; j < WIDTH; j++) {
    const object = rows[i][j];
    if (object === "@") {
      robot.x = j;
      robot.y = i;
      row.push(".");
    } else row.push(object);
  }
  map.push(row);
}

const copyFromMap = (direction) => {
  const { x, y } = robot;
  switch (direction) {
    case ">":
      return map[y].slice(x + 1);
    case "<":
      return map[y].slice(0, x).reverse();
    case "^":
      return map
        .map((row) => row[x])
        .slice(0, y)
        .reverse();
    case "v":
      return map.map((row) => row[x]).slice(y + 1);
    default:
      return [];
  }
};

const copyToMap = (direction, objects) => {
  const { x, y } = robot;
  switch (direction) {
    case ">":
      map[y].splice(x + 1, objects.length, ...objects);
      break;
    case "<":
      map[y].splice(0, objects.length, ...objects.reverse());
      break;
    case "^":
      for (let i = 0; i < objects.length; i++) {
        map[i][x] = objects[objects.length - i - 1];
      }
      break;
    case "v":
      for (let i = 0; i < objects.length; i++) {
        map[y + 1 + i][x] = objects[i];
      }
      break;
    default:
      break;
  }
};

const moveRobot = (direction) => {
  switch (direction) {
    case ">":
      robot.x += 1;
      break;
    case "<":
      robot.x -= 1;
      break;
    case "^":
      robot.y -= 1;
      break;
    case "v":
      robot.y += 1;
      break;
    default:
      break;
  }
};

const updateMapAndRobot = (direction) => {
  const objects = copyFromMap(direction);
  let firstFreeSpace = objects.indexOf(".");
  const firstWall = objects.indexOf("#");
  firstFreeSpace = firstFreeSpace < firstWall ? firstFreeSpace : -1;
  if (firstFreeSpace !== -1) {
    if (objects[0] !== ".") {
      objects[0] = ".";
      for (let i = 1; i <= firstFreeSpace; i++) {
        objects[i] = "O";
      }
      copyToMap(direction, objects);
    }
    moveRobot(direction);
  }
};

for (let i = 0; i < moveString.length; i++) {
  const direction = moveString[i];
  updateMapAndRobot(direction);
}

let sumOfGpsCoordinates = 0;
for (let i = 0; i < HEIGHT; i++) {
  for (let j = 0; j < WIDTH; j++) {
    sumOfGpsCoordinates += map[i][j] === "O" ? 100 * i + j : 0;
  }
}

console.log(sumOfGpsCoordinates);
