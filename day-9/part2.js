const { log } = require("console");
const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs
  .readFileSync(`${currentDir}/input.txt`, {
    encoding: "utf8",
  })
  .split("#")[0];

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

const freeBlocks = [];
let currentBlockLength = 0;
let start = 0;
for (let i = 0; i < longFrom.length; i++) {
  if (longFrom[i] === -1) {
    currentBlockLength += 1;
  } else if (currentBlockLength > 0) {
    freeBlocks.push({ start, length: currentBlockLength });
    currentBlockLength = 0;
    start = i + 1;
  } else {
    start += 1;
  }
}

const occupiedBlocks = [];
start = 0;
let currentId = longFrom[0];
currentBlockLength = 1;
for (let i = 1; i < longFrom.length; i++) {
  if (longFrom[i] !== -1) {
    if (currentId !== longFrom[i]) {
      if (currentBlockLength > 0) {
        occupiedBlocks.push({
          start,
          length: currentBlockLength,
          id: currentId,
        });
        currentBlockLength = 1;
        start = i;
      } else {
        currentBlockLength += 1;
      }
      currentId = longFrom[i];
    } else {
      currentBlockLength += 1;
    }
  } else if (currentBlockLength > 0) {
    occupiedBlocks.push({ start, length: currentBlockLength, id: currentId });
    currentBlockLength = 0;
    start = i + 1;
  } else {
    start += 1;
  }
}
occupiedBlocks.push({ start, length: currentBlockLength, id: currentId });

let freeBlock;
let occupiedBlock;

for (let i = occupiedBlocks.length - 1; i >= 0; i--) {
  occupiedBlock = occupiedBlocks[i];
  for (let j = 0; j < freeBlocks.length; j++) {
    freeBlock = freeBlocks[j];
    if (freeBlock.start > occupiedBlock.start) {
      break;
    }
    if (occupiedBlock.length < freeBlock.length) {
      for (let k = 0; k < occupiedBlock.length; k++) {
        longFrom[freeBlock.start + k] = longFrom[occupiedBlock.start + k];
        longFrom[occupiedBlock.start + k] = -1;
      }
      freeBlock.start = freeBlock.start + occupiedBlock.length;
      freeBlock.length = freeBlock.length - occupiedBlock.length;
      break;
    } else if (occupiedBlock.length == freeBlock.length) {
      for (let k = 0; k < occupiedBlock.length; k++) {
        longFrom[freeBlock.start + k] = longFrom[occupiedBlock.start + k];
        longFrom[occupiedBlock.start + k] = -1;
      }
      freeBlocks.splice(j, 1);
      break;
    }
  }
  // console.log(JSON.stringify(longFrom));
}

let sum = 0;
for (let i = 0; i < longFrom.length; i++) {
  if (longFrom[i] === -1) continue;
  sum += i * longFrom[i];
}

console.log(sum);
