const fs = require("fs");
const path = require("path");
const { log } = require("util");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const seeds = stringInput.split("\n").map((n) => parseInt(n));

const mix = (number, mixingValue) => {
  const xorResultN = BigInt(number) ^ BigInt(mixingValue);
  const xorResult = Number(xorResultN);
  return xorResult;
};

const prune = (number) => {
  return number % 16777216;
};

const generateSecrectNumber = (currentSecretNum) => {
  let secretNum = currentSecretNum;
  secretNum = prune(mix(secretNum, secretNum * 64));
  secretNum = prune(mix(secretNum, Math.floor(secretNum / 32)));
  secretNum = prune(mix(secretNum, secretNum * 2048));
  return secretNum;
};

const cachedSequences = {};
const REPEATS = 2000;
seeds.forEach((seed) => {
  let secretNumber = seed;
  let currentSequence = [];
  for (let i = 0; i < REPEATS - 1; i++) {
    const newSecretNumber = generateSecrectNumber(secretNumber);
    const change = (newSecretNumber % 10) - (secretNumber % 10);
    secretNumber = newSecretNumber;
    if (currentSequence.length >= 4) currentSequence.shift();
    currentSequence.push(change);
    if (currentSequence.length < 4) continue;
    const [a, b, c, d] = currentSequence;
    const cachedKey = `${a},${b},${c},${d}`;
    if (cachedSequences[cachedKey] !== undefined) {
      if (cachedSequences[cachedKey][seed] === undefined) {
        cachedSequences[cachedKey][seed] = secretNumber % 10;
      }
    } else {
      cachedSequences[cachedKey] = {};
      cachedSequences[cachedKey][seed] = secretNumber % 10;
    }
  }
});

const sum = (array) => {
  return array.reduce((currentSum, currentElement) => currentSum + currentElement, 0);
};

let maxBananas = 0;
Object.keys(cachedSequences).forEach((cachedKey) => {
  const sumOfBananas = sum(Object.values(cachedSequences[cachedKey]));
  if (sumOfBananas > maxBananas) {
    maxBananas = sumOfBananas;
  }
});

console.log(maxBananas);
