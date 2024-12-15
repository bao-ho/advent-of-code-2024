const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const machinesStrings = stringInput.split("\n\n");

const machines = [];

machinesStrings.forEach((machineString) => {
  const [buttonA, buttonB, prize] = machineString.split("\n");
  const ax = parseInt(buttonA.split(",")[0].split("+")[1]);
  const ay = parseInt(buttonA.split(",")[1].split("+")[1]);
  const bx = parseInt(buttonB.split(",")[0].split("+")[1]);
  const by = parseInt(buttonB.split(",")[1].split("+")[1]);
  const px = parseInt(prize.split(",")[0].split("=")[1]);
  const py = parseInt(prize.split(",")[1].split("=")[1]);
  machines.push({ ax, ay, bx, by, px, py });
});

const solveLinearEquation = (machine) => {
  const { ax, ay, bx, by, px, py } = machine;
  const B = (px * ay - py * ax) / (ay * bx - ax * by);
  const A = (py * bx - px * by) / (ay * bx - ax * by);
  return { A, B };
};

const calculateCost = (machine) => {
  const { A, B } = solveLinearEquation(machine);
  if (Number.isInteger(A) && Number.isInteger(B)) return 3 * A + B;
  return 0;
};

let totalCost = 0;
machines.forEach((machine) => {
  totalCost += calculateCost(machine);
});

console.log(totalCost);
