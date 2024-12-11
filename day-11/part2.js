const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

let stones = stringInput
  .split(" ")
  .map((stringNumber) => parseInt(stringNumber));

const TOTAL_BLINKS = 75;

const MAX = 1000;

const cache = [];
const allMinusOnes = new Array(TOTAL_BLINKS + 1).fill(-1);
for (let i = 0; i <= MAX; i++) {
  cache.push([...allMinusOnes]);
}

let totalRecursions = 0;
let totalCacheHits = 0;

const findNumberOfDescendants = (stone, nBlinks) => {
  totalRecursions += 1;
  if (nBlinks === 0) return 1;

  if (stone <= MAX && cache[stone][nBlinks] !== -1) {
    totalCacheHits += 1;
    return cache[stone][nBlinks];
  }

  let n1, n2;
  // If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
  if (stone === 0) {
    n1 = findNumberOfDescendants(1, nBlinks - 1);
    cache[1][nBlinks - 1] = n1;
    return n1;
  }
  // If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
  else if (stone.toString().length % 2 === 0) {
    const stringNumber = stone.toString();
    const part1 = parseInt(stringNumber.slice(0, stringNumber.length / 2));
    const part2 = parseInt(stringNumber.slice(stringNumber.length / 2));
    n1 = findNumberOfDescendants(part1, nBlinks - 1);
    n2 = findNumberOfDescendants(part2, nBlinks - 1);
    if (part1 <= MAX) cache[part1][nBlinks - 1] = n1;
    if (part2 <= MAX) cache[part2][nBlinks - 1] = n2;
    return n1 + n2;
  }
  // If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
  n1 = findNumberOfDescendants(stone * 2024, nBlinks - 1);
  if (stone * 2024 <= MAX) cache[stone * 2024][nBlinks - 1] = n1;
  return n1;
};

let sum = 0;
for (let j = 0; j < stones.length; j++) {
  const stone = stones[j];
  sum += findNumberOfDescendants(stone, TOTAL_BLINKS);
}

console.log(sum);
console.log(totalRecursions);
console.log(totalCacheHits);
