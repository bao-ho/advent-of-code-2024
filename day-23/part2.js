const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const connections = stringInput.split("\n");

const groupsAsSets = {};

connections.forEach((connection) => {
  const [computerA, computerB] = connection.split("-").sort((a, b) => (a > b ? 1 : -1));
  if (!groupsAsSets[computerA]) groupsAsSets[computerA] = new Set([computerB]);
  else groupsAsSets[computerA].add(computerB);
});

const keys = Object.keys(groupsAsSets).sort((a, b) => (a > b ? 1 : -1));
const groupsAsArrays = {};
keys.forEach((key) => {
  groupsAsArrays[key] = Array.from(groupsAsSets[key]).sort((a, b) => (a > b ? 1 : -1));
});

const getPassword = (key, workingSet) => {
  if (workingSet.size === 0) return `${key}`;
  if (workingSet.size === 1) return `${key},${workingSet.values().next().value}`;
  let longestSubPassword = "";
  const nextKeysToCheck = Array.from(workingSet).sort((a, b) => (a > b ? 1 : -1));
  nextKeysToCheck.forEach((nextKeyToCheck) => {
    let subPassword;
    if (groupsAsSets[nextKeyToCheck] === undefined) subPassword = `${nextKeyToCheck}`;
    else {
      const nextWorkingSet = workingSet.intersection(groupsAsSets[nextKeyToCheck]);
      subPassword = getPassword(nextKeyToCheck, nextWorkingSet);
    }
    if (subPassword.length > longestSubPassword.length) longestSubPassword = subPassword;
  });
  return `${key},${longestSubPassword}`;
};

let passWord = "";
keys.forEach((key) => {
  const currentPassword = getPassword(key, groupsAsSets[key]);
  if (currentPassword.length > passWord.length) {
    passWord = currentPassword;
  }
});

console.log(passWord);