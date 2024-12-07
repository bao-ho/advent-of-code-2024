const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const [rulesString, updatesString] = stringInput.split("\n\n");

const ruleStrings = rulesString.split("\n");
const rules = [];
ruleStrings.forEach((string) => {
  const [s1, s2] = string.split("|");
  const n1 = parseInt(s1);
  const n2 = parseInt(s2);
  rules.push([n1, n2]);
});
const updateStrings = updatesString.split("\n");
const updates = updateStrings.map((line) => {
  return line.split(",").map((string) => parseInt(string));
});

const getMiddleNumber = (update) => {
  const localRules = [];
  rules.forEach((rule) => {
    const [r0, r1] = rule;
    if (update.indexOf(r0) !== -1 && update.indexOf(r1) !== -1) {
      localRules.push(rule);
    }
  });
  let needFixing = false;
  for (let i = 0; i < localRules.length; i++) {
    const rule = localRules[i];
    const [r0, r1] = rule;
    if (update.indexOf(r0) > update.indexOf(r1)) {
      needFixing = true;
      break;
    }
  }
  if (!needFixing) {
    return 0;
  }
  for (let i = 0; i < localRules.length; i++) {
    update.sort((a, b) => {
      const rule = localRules.find(
        (rule) => rule.includes(a) && rule.includes(b)
      );
      if (rule) {
        if (rule[0] === a) {
          return -2;
        } else {
          return 2;
        }
      }
      return 0;
    });
  }
  return update[(update.length - 1) / 2];
};

let sum = 0;
updates.forEach((update) => {
  sum += getMiddleNumber(update);
});
console.log(sum);
