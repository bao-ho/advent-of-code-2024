const fs = require("fs");
const path = require("path");

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

let sum = 0;
seeds.forEach((seed) => {
  let secretNumber = seed;
  for (let i = 0; i < 2000; i++) {
    secretNumber = generateSecrectNumber(secretNumber);
  }
  sum += secretNumber;
});

console.log(sum);
