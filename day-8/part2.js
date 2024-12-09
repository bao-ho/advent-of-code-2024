const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const characters = [];
const rows = stringInput.split("\n");
rows.forEach((row, j) => {
  for (let i = 0; i < row.length; i++) {
    const character = row[i];
    if (character === ".") {
      continue;
    }
    const found = characters.findIndex((c) => c.character === character);
    if (found === -1) {
      characters.push({ character, occurences: [{ x: i, y: j }] });
    } else {
      characters[found].occurences.push({ x: i, y: j });
    }
  }
});

const width = rows[0].length;
const height = rows.length;

const isInbound = (position) =>
  position.x >= 0 &&
  position.x < width &&
  position.y >= 0 &&
  position.y < height;

const antiNodesSet = new Set();
const countAntinodesForPair = (position1, position2) => {
  const { x: x1, y: y1 } = position1;
  const { x: x2, y: y2 } = position2;
  const delta = { x: x2 - x1, y: y2 - y1 };
  const antiNodes = [];
  for (let i = 0; true; i++) {
    const newAntinodes = { x: x1 - delta.x * i, y: y1 - delta.y * i };
    if (isInbound(newAntinodes)) {
      antiNodes.push(newAntinodes);
    } else {
      break;
    }
  }
  for (let i = 0; true; i++) {
    const newAntinodes = { x: x2 + delta.x * i, y: y2 + delta.y * i };
    if (isInbound(newAntinodes)) {
      antiNodes.push(newAntinodes);
    } else {
      break;
    }
  }
  for (let i = 0; i < antiNodes.length; i++) {
    const antiNode = antiNodes[i];
    const antiNodeAsString = JSON.stringify(antiNode);
    if (antiNodesSet.has(antiNodeAsString)) {
      continue;
    }
    antiNodesSet.add(antiNodeAsString);
  }
};

for (let i = 0; i < characters.length; i++) {
  const { occurences } = characters[i];
  for (let j = 0; j < occurences.length; j++) {
    for (let k = j + 1; k < occurences.length; k++) {
      countAntinodesForPair(occurences[j], occurences[k]);
    }
  }
}

console.log(antiNodesSet.size);
