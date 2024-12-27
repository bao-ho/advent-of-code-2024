const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const schematics = stringInput.split("\n\n");

const locks = [];
const keys = [];
schematics.forEach((schematic) => {
  const rows = schematic.split("\n");
  const pinHeights = [0, 0, 0, 0, 0];
  if (rows[0][0] === "#") {
    for (let i = 1; i < rows.length; i++) {
      for (let j = 0; j < rows[0].length; j++) {
        if (rows[i][j] === "#") pinHeights[j] += 1;
      }
    }
    locks.push(pinHeights);
  } else {
    for (let i = 0; i < rows.length - 1; i++) {
      for (let j = 0; j < rows[0].length; j++) {
        if (rows[i][j] === "#") pinHeights[j] += 1;
      }
    }
    keys.push(pinHeights);
  }
});

const MAX_PIN_HEIGHT = 5;

const isFit = (lock, key) => {
  for (let i = 0; i < lock.length; i++) {
    if (lock[i] + key[i] > MAX_PIN_HEIGHT) return false;
  }
  return true;
};

let nFits = 0;
for (let i = 0; i < locks.length; i++) {
  for (let j = 0; j < keys.length; j++) {
    if (isFit(locks[i], keys[j])) nFits += 1;
  }
}

console.log(nFits);
