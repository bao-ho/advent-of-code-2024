const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const founds = stringInput.match(/mul\(\d{1,3},\d{1,3}\)/g);
let total = 0;
founds.forEach((found) => {
  const [a, b] = found.split(",");
  const n1 = parseInt(a.split("(")[1]);
  const n2 = parseInt(b.split(")")[0]);
  total += n1 * n2;
});

console.log(total);
