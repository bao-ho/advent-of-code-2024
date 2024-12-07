const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const rows = stringInput.split("\n");

const width = rows[0].length;
const height = rows.length;

const columns = [];
for (let i = 0; i < width; i++) {
  let column = "";
  for (let j = 0; j < height; j++) {
    column += rows[j][i];
  }
  columns.push(column);
}

const slashs = [];
for (let i = 0; i < width + height - 1; i++) {
  let slash = "";
  for (let j = width - 1; j >= 0; j--) {
    const rowIndex = i - j;
    if (rowIndex < 0) {
      continue;
    } else if (rowIndex > height - 1) {
      break;
    } else {
      slash += rows[rowIndex][j];
    }
  }
  if (slash !== "") {
    slashs.push(slash);
  }
}

const backslashs = [];
for (let i = -height + 1; i <= width - 1; i++) {
  let backslash = "";
  for (let j = 0; j < width; j++) {
    const rowIndex = j - i;
    if (rowIndex < 0) {
      continue;
    } else if (rowIndex > height - 1) {
      break;
    } else {
      backslash += rows[rowIndex][j];
    }
  }
  if (backslash !== "") {
    backslashs.push(backslash);
  }
}

let count = 0;
const all = [...rows, ...columns, ...slashs, ...backslashs];
all.forEach((string) => {
  const m1 = string.match(/XMAS/g);
  const m2 = string.match(/SAMX/g);
  if (m1) {
    count += m1.length;
  }
  if (m2) {
    count += m2.length;
  }
});

console.log(count);
