const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const longFrom = [];

let id = 0;
for (let i = 0; i < stringInput.length; i++) {
  const spaceCount = parseInt(stringInput[i]);
  if (i % 2 === 0) {
    const fileBlockLength = spaceCount;
    longFrom.push(...Array(fileBlockLength).fill(id));
    id += 1;
  } else {
    const emptyBlockLength = spaceCount;
    longFrom.push(...Array(emptyBlockLength).fill(-1));
  }
}

const findFreeSpaceIndex = (oldPosition) => {
  let newPosition = oldPosition;
  for (let i = oldPosition + 1; i < longFrom.length; i++) {
    if (longFrom[i] === -1) {
      newPosition = i;
      break;
    }
  }
  return newPosition;
};

const findLastFileBlockIndex = (oldPosition) => {
  let newPosition = oldPosition;
  for (let i = oldPosition - 1; i >= 0; i--) {
    if (longFrom[i] !== -1) {
      newPosition = i;
      break;
    }
  }
  return newPosition;
};

let freeSpaceIndex = findFreeSpaceIndex(-1);
let lastFileBlockIndex = findLastFileBlockIndex(longFrom.length);

// console.log(JSON.stringify(longFrom));
while (freeSpaceIndex < lastFileBlockIndex) {
  longFrom[freeSpaceIndex] = longFrom[lastFileBlockIndex];
  longFrom[lastFileBlockIndex] = -1;
  freeSpaceIndex = findFreeSpaceIndex(freeSpaceIndex);
  lastFileBlockIndex = findLastFileBlockIndex(lastFileBlockIndex);
  // console.log(JSON.stringify(longFrom));
}

let sum = 0;
for (let i = 0; i < longFrom.length; i++) {
  if (longFrom[i] === -1) break;
  sum += i * longFrom[i];
}

console.log(sum);
