const fs = require("fs");
const path = require("path");

const list1 = [];
const list2 = [];
const currentDir = path.resolve(__dirname);
const allNumbers = fs
  .readFileSync(`${currentDir}/input.txt`, { encoding: "utf8" })
  .split("\n");

allNumbers.forEach((number) => {
  const [str1, str2] = number.split("   ");
  list1.push(parseInt(str1));
  list2.push(parseInt(str2));
});

list1.sort((a, b) => a - b);
list2.sort((a, b) => a - b);

let sumDistance = 0;
list1.forEach((num1, i) => {
  sumDistance += Math.abs(num1 - list2[i]);
});

const list2Counted = [{ num: list2[0], rep: 1 }];
for (let i = 1; i < list2.length; i++) {
  if (list2[i] === list2Counted[list2Counted.length - 1].num) {
    list2Counted[list2Counted.length - 1].rep++;
  } else {
    list2Counted.push({ num: list2[i], rep: 1 });
  }
}

const list1Counted = [{ num: list1[0], rep: 1 }];
for (let i = 1; i < list1.length; i++) {
  if (list1[i] === list1Counted[list1Counted.length - 1].num) {
    list1Counted[list1Counted.length - 1].rep++;
  } else {
    list1Counted.push({ num: list1[i], rep: 1 });
  }
}

let similarity = 0;

let list1SearchIndex = 0;
for (let i = 0; i < list2Counted.length; i++) {
  el = list2Counted[i];
  while (
    list1SearchIndex < list1Counted.length &&
    el.num > list1Counted[list1SearchIndex].num
  ) {
    list1SearchIndex += 1;
  }

  if (list1SearchIndex >= list1Counted.length) {
    break;
  }

  if (el.num === list1Counted[list1SearchIndex].num) {
    similarity += el.rep * el.num * list1Counted[list1SearchIndex].rep;
  }
}

console.log(similarity);
