const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const [mapString, moveStringWithNewliens] = stringInput.split("\n\n");
const moveString = moveStringWithNewliens.replaceAll("\n", "");

const rows = mapString.split("\n");
const map = [];
let robot = { x: -1, y: -1 };
for (let i = 0; i < rows.length; i++) {
  const row = [];
  for (let j = 0; j < rows[0].length; j++) {
    const object = rows[i][j];
    switch (object) {
      case ".":
        row.push(".");
        row.push(".");
        break;
      case "O":
        row.push("[");
        row.push("]");
        break;
      case "#":
        row.push("#");
        row.push("#");
        break;
      case "@":
        robot.x = j * 2;
        robot.y = i;
        row.push(".");
        row.push(".");
        break;
      default:
        break;
    }
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

const isMovable = (robot, frontArea, movableObjects, depth) => {
  const { x } = robot;
  const newFrontArea = frontArea.slice(1);
  if (frontArea[0][x] === "]") {
    movableObjects.push({ x, y: depth - frontArea.length });
    const c1 = isMovable({ x }, newFrontArea, movableObjects, depth);
    let c2 = true;
    if (frontArea[1][x] === "[") {
      c2 = isMovable({ x: x + 1 }, newFrontArea, movableObjects, depth);
    }
    return c1 && c2;
  } else if (frontArea[0][x] === "[") {
    movableObjects.push({ x, y: depth - frontArea.length });
    const c1 = isMovable({ x }, newFrontArea, movableObjects, depth);
    let c2 = true;
    if (frontArea[1][x] === "]") {
      c2 = isMovable({ x: x - 1 }, newFrontArea, movableObjects, depth);
    }
    return c1 && c2;
  } else if (frontArea[0][x] === "#") return false;
  else return true;
};

const updateFrontArea = (frontArea, movableObjects) => {
  const movableObjectsSet = new Set(
    movableObjects.map((o) => JSON.stringify(o))
  );
  const reducedMovableObjects = [];
  movableObjectsSet.forEach((os) => reducedMovableObjects.push(JSON.parse(os)));
  reducedMovableObjects.sort((a, b) => b.y - a.y);
  reducedMovableObjects.forEach((movableObject) => {
    const { x, y } = movableObject;
    frontArea[y + 1][x] = frontArea[y][x];
    frontArea[y][x] = ".";
  });
};

const copyFrontAreaToMap = (direction, frontArea) => {
  const { y } = robot;
  if (direction === "^") {
    for (let i = 0; i < frontArea.length; i++) {
      for (let j = 0; j < frontArea[0].length; j++) {
        map[y - i - 1][j] = frontArea[i][j];
      }
    }
  } else {
    for (let i = 0; i < frontArea.length; i++) {
      for (let j = 0; j < frontArea[0].length; j++) {
        map[y + i + 1][j] = frontArea[i][j];
      }
    }
  }
};

const updateMapAndRobot = (direction) => {
  if ([">", "<"].includes(direction)) {
    const objects = copyFromMap(direction);
    let firstFreeSpace = objects.indexOf(".");
    const firstWall = objects.indexOf("#");
    firstFreeSpace = firstFreeSpace < firstWall ? firstFreeSpace : -1;
    if (firstFreeSpace !== -1) {
      if (objects[0] !== ".") {
        objects[0] = ".";
        for (let i = 1; i <= firstFreeSpace / 2; i++) {
          if (direction === ">") {
            objects[i * 2 - 1] = "[";
            objects[i * 2] = "]";
          } else {
            objects[i * 2 - 1] = "]";
            objects[i * 2] = "[";
          }
        }
        copyToMap(direction, objects);
      }
      moveRobot(direction);
    }
  } else {
    // up or down
    const { x, y } = robot;
    let frontArea;
    if (direction === "^") frontArea = map.slice(0, y).reverse();
    else frontArea = map.slice(y + 1);
    const objectInfrontOfRobot = frontArea[0][x];
    if (objectInfrontOfRobot === ".") {
      moveRobot(direction);
    } else if (objectInfrontOfRobot === "#") {
      // do nothing
    } else {
      const movableObjects = [];
      const X = objectInfrontOfRobot === "]" ? x - 1 : x + 1;
      const c1 = isMovable(robot, frontArea, movableObjects, frontArea.length);
      const c2 = isMovable(
        { x: X, y },
        frontArea,
        movableObjects,
        frontArea.length
      );
      if (c1 && c2) {
        updateFrontArea(frontArea, movableObjects);
        copyFrontAreaToMap(direction, frontArea);
        moveRobot(direction);
      }
    }
  }
};

for (let i = 0; i < moveString.length; i++) {
  const direction = moveString[i];
  updateMapAndRobot(direction);
}

let sumOfGpsCoordinates = 0;
for (let i = 0; i < map.length; i++) {
  for (let j = 0; j < map[0].length; j++) {
    sumOfGpsCoordinates += map[i][j] === "[" ? 100 * i + j : 0;
  }
}

console.log(sumOfGpsCoordinates);
