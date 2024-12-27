const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const connections = stringInput.split("\n");

const groups = {};

connections.forEach((connection) => {
  const [computerA, computerB] = connection.split("-").sort((a, b) => (a > b ? 1 : -1));
  if (!groups[computerA]) groups[computerA] = new Set([computerB]);
  else groups[computerA].add(computerB);
});

const keys = Object.keys(groups).sort((a, b) => (a > b ? 1 : -1));

const groupOfThrees = [];

for (let i = 0; i < keys.length; i++) {
  for (let j = i + 1; j < keys.length; j++) {
    if (groups[keys[i]].has(keys[j])) {
      const thirdComputers = Array.from(groups[keys[i]].intersection(groups[keys[j]])).sort((a, b) => (a > b ? 1 : -1));
      thirdComputers.forEach((thirdComputer) => {
        groupOfThrees.push(`${keys[i]},${keys[j]},${thirdComputer}`);
      });
    }
  }
}

const groupOfThreesWithStartT = groupOfThrees.filter(
  (groupString) => groupString[0] === "t" || groupString[3] === "t" || groupString[6] === "t"
);

console.log(groupOfThreesWithStartT);
console.log(groupOfThreesWithStartT.length);

