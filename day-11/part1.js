const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

let stones = stringInput
  .split(" ")
  .map((stringNumber) => parseInt(stringNumber));

let nextStones = [];
for (let i = 0; i < 20; i++) {
  for (let j = 0; j < stones.length; j++) {
    const stone = stones[j];
    // If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
    if (stone === 0) nextStones.push(1);
    // If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
    else if (stone.toString().length % 2 === 0) {
      const stringNumber = stone.toString();
      nextStones.push(parseInt(stringNumber.slice(0, stringNumber.length / 2)));
      nextStones.push(parseInt(stringNumber.slice(stringNumber.length / 2)));
    }
    // If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
    else nextStones.push(stone * 2024);
  }
  stones = nextStones;
  nextStones = [];
}

console.log(stones.length);

