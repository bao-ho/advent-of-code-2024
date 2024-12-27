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

const cachedDesigns = {};

const countPossibilites = (design) => {
  if (cachedDesigns[design] > 0) return cachedDesigns[design];
  if (cachedDesigns[design] === 0) return 0;
  let nPossibilities = 0;
  for (let i = 0; i < towels.length; i++) {
    const towel = towels[i];
    if (design.indexOf(towel) === 0) {
      if (design.length === towel.length) {
        nPossibilities += 1;
      } else {
        const n = countPossibilites(design.slice(towel.length));
        if (n > 0) {
          nPossibilities += n;
        }
      }
    }
  }
  cachedDesigns[design] = nPossibilities;
  return nPossibilities;
};

let count = 0;
designs.forEach((design) => {
  const nPossibilities = countPossibilites(design);
  count += nPossibilities;
});
console.log(count);
