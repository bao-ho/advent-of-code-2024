const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const rows = stringInput.split("\n");

const width = rows[0].length;
const height = rows.length;

const check = (string) => {
  if (string.match(/M.S.A.M.S/g)) return true;
  if (string.match(/M.M.A.S.S/g)) return true;
  if (string.match(/S.S.A.M.M/g)) return true;
  if (string.match(/S.M.A.S.M/g)) return true;
};

let count = 0;
for (let i = 0; i < width - 2; i++) {
  for (let j = 0; j < height - 2; j++) {
    let square = "";
    for (let k = 0; k < 3; k++) {
      for (let l = 0; l < 3; l++) {
        square += rows[i + k][j + l];
      }
    }
    count += check(square) ? 1 : 0;
  }
}

console.log(count);
