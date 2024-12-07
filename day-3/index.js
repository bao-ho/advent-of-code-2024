const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const founds = stringInput.match(/mul\(\d{1,3},\d{1,3}\)|do\(\)|don't\(\)/g);
let total = 0;
const multiply = (instruction) => {
  const [a, b] = instruction.split(",");
  const n1 = parseInt(a.split("(")[1]);
  const n2 = parseInt(b.split(")")[0]);
  return n1 * n2;
};

let activator = true;
for (let i = 0; i < founds.length; i++) {
  const word = founds[i];
  if (word === "do()") {
    activator = true;
  } else if (word === "don't()") {
    activator = false;
  } else {
    total += activator ? multiply(word) : 0;
  }
}

console.log(total);
