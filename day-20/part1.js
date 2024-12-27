const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const rows = stringInput.split("\n");
const WIDTH = rows[0].length;
const HEIGHT = rows.length;

const cheat = () => {
  // initialize map
  const map = [];
  let start = "";
  let end = "";
  for (let i = 0; i < HEIGHT; i++) {
    const row = [];
    for (let j = 0; j < WIDTH; j++) {
      if (rows[i][j] === "S") {
        start = `${j},${i},0`;
        row.push(".");
      } else if (rows[i][j] === "E") {
        end = `${j},${i}`;
        row.push(".");
      } else row.push(rows[i][j]);
    }
    map.push(row);
  }
  const extractData = (position) => {
    const [x, y, n] = position.split(",").map((s) => parseInt(s));
    return [x, y, n];
  };

  const getNextPositions = (position) => {
    const [x, y, n] = extractData(position);
    const nextPositions = [];
    // north
    if (map[y - 1][x] === ".") nextPositions.push(`${x},${y - 1},${n + 1}`);
    // south
    if (map[y + 1][x] === ".") nextPositions.push(`${x},${y + 1},${n + 1}`);
    // east
    if (map[y][x + 1] === ".") nextPositions.push(`${x + 1},${y},${n + 1}`);
    // west
    if (map[y][x - 1] === ".") nextPositions.push(`${x - 1},${y},${n + 1}`);
    return nextPositions;
  };

  // BSF
  const queue = [];
  const [x, y] = extractData(start);
  const [xe, ye] = extractData(end);
  map[y][x] = "0";
  queue.push(start);
  while (queue.length > 0) {
    const currentPosition = queue.shift();
    const [X, Y, N] = extractData(currentPosition);
    if (X === xe && Y === ye) break;
    const nextPositions = getNextPositions(currentPosition);
    nextPositions.forEach((np) => {
      const [x, y, n] = extractData(np);
      map[y][x] = `${n}`;
      queue.push(np);
    });
  }
  const isThinWall = (i, j) => {
    const isWall = rows[i][j] === "#";
    if (!isWall) return false;
    let neiboringWallCount = 0;
    // north
    if (rows[i - 1][j] === "#") neiboringWallCount += 1;
    // south
    if (rows[i + 1][j] === "#") neiboringWallCount += 1;
    // east
    if (rows[i][j + 1] === "#") neiboringWallCount += 1;
    // west
    if (rows[i][j - 1] === "#") neiboringWallCount += 1;
    return neiboringWallCount < 3;
  };

  const getCheatGain = (i, j) => {
    const north = parseInt(map[i - 1][j]);
    const south = parseInt(map[i + 1][j]);
    const east = parseInt(map[i][j + 1]);
    const west = parseInt(map[i][j - 1]);
    const gainVertically = !isNaN(north) && !isNaN(south) ? Math.abs(north - south) : 0;
    const gainHorizontally = !isNaN(east) && !isNaN(west) ? Math.abs(east - west) : 0;
    const diff = Math.max(gainHorizontally, gainVertically);
    return diff > 2 ? diff - 2 : 0;
  };

  let cheatCount = 0;
  for (let i = 1; i < HEIGHT - 1; i++) {
    for (let j = 1; j < WIDTH - 1; j++) {
      if (isThinWall(i, j)) {
        const savedTime = getCheatGain(i, j);
        if (savedTime >= 100) cheatCount += 1;
      }
    }
  }
  return cheatCount;
};

console.log(cheat());
