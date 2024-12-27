const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const towels = stringInput.split("\n\n")[0].split(", ");
towels.sort((a, b) => {
  if (a.length < b.length) return -1;
  if (a.length > b.length) return 1;
  for (let i = 0; i < a.length; i++) {
    if (a[i] < b[i]) return -1;
    if (a[i] > b[i]) return 1;
  }
  return 0;
});

const designs = stringInput.split("\n\n")[1].split("\n");

cachedPossibles = new Set();
cachedImpossibles = new Set();

const checkIfPossible = (design) => {
  if (cachedPossibles.has(design)) return true;
  if (cachedImpossibles.has(design)) return false;
  for (let i = 0; i < towels.length; i++) {
    const towel = towels[i];
    if (design.indexOf(towel) === 0) {
      if (design.length === towel.length) {
        cachedPossibles.add(design);
        return true;
      } else if (checkIfPossible(design.slice(towel.length))) {
        cachedPossibles.add(design);
        return true;
      }
    }
  }
  cachedImpossibles.add(design);
  return false;
};

let count = 0;
designs.forEach((design) => {
  const isPossible = checkIfPossible(design);
  count += isPossible ? 1 : 0;
});
console.log(count);
