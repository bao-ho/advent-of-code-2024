const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const readyWires = stringInput
  .split("\n\n")[0]
  .split("\n")
  .map((line) => {
    const [wireName, wireValue] = line.split(": ");
    return { wireName, wireValue: parseInt(wireValue) };
  });

const gates = stringInput
  .split("\n\n")[1]
  .split("\n")
  .map((line) => {
    const [inputString, output] = line.split(" -> ");
    const [input1, operator, input2] = inputString.split(" ");
    return { inputs: [input1, input2], operator, output };
  });

const execute = (operator, value1, value2) => {
  switch (operator) {
    case "AND":
      return value1 & value2;
    case "OR":
      return value1 | value2;
    case "XOR":
      return value1 ^ value2;
    default:
      return -1;
  }
};

const allZWires = gates
  .map((gate) => (gate.output[0] === "z" ? gate.output : "notZ"))
  .filter((wireName) => wireName !== "notZ");

const allReadyZWire = [];

while (allReadyZWire.length !== allZWires.length) {
  const newReadyWires = [];
  for (let i = 0; i < gates.length; i++) {
    if (gates[i].executed) continue;
    const { inputs, operator, output } = gates[i];
    const [input1, input2] = inputs;
    const readyWireNames = readyWires.map((wire) => wire.wireName);
    const readyWireValues = readyWires.map((wire) => wire.wireValue);
    const index1 = readyWireNames.indexOf(input1);
    const index2 = readyWireNames.indexOf(input2);
    if (index1 !== -1 && index2 !== -1) {
      const result = execute(operator, readyWireValues[index1], readyWireValues[index2]);
      newReadyWires.push({ wireName: output, wireValue: result });
      if (output[0] === "z") allReadyZWire.push({ wireName: output, wireValue: result });
      gates[i].executed = true;
    }
  }
  readyWires.push(...newReadyWires);
}

let decimalNumber = 0;
allReadyZWire.forEach((zWire) => {
  const exponent = parseInt(zWire.wireName.slice(1));
  decimalNumber += zWire.wireValue * Math.pow(2, exponent);
});
console.log(decimalNumber);
