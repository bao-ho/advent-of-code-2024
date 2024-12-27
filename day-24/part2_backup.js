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

let Z = 0;
let X = 0;
let Y = 0;
allReadyZWire.forEach((zWire, i) => {
  const exponent = parseInt(zWire.wireName.slice(1));
  Z += zWire.wireValue * Math.pow(2, exponent);
});
for (let i = 0; i < allReadyZWire.length - 1; i++) {
  X += readyWires[i].wireValue * Math.pow(2, i);
  Y += readyWires[i + 45].wireValue * Math.pow(2, i);
}

const bigXor = (n1, n2) => {
  const xorResultN = BigInt(n1) ^ BigInt(n2);
  const xorResult = Number(xorResultN);
  return xorResult;
};

const differentDigits = bigXor(X + Y, Z).toString(2);

const possibleSwappedGates = [];

for (let i = 0; i < differentDigits.length; i++) {
  if (differentDigits[differentDigits.length - 1 - i] === "1") {
    const possibleSwappedOutput = `z${i <= 9 ? "0" : ""}${i}`;
    const possibleSwappedGate = gates.find((gate) => gate.output === possibleSwappedOutput);
    const { inputs, operator, output } = possibleSwappedGate;
    possibleSwappedGates.push({ operator, output, inputs: [...inputs] });
  }
}
let foundPossibleSwappedGates = true;
while (foundPossibleSwappedGates) {
  foundPossibleSwappedGates = false;
  const newPossibleSwappedGates = [];
  for (let i = 0; i < possibleSwappedGates.length; i++) {
    const { counted, inputs } = possibleSwappedGates[i];
    if (!counted) {
      inputs.forEach((input) => {
        const possibleSwappedGate = gates.find((gate) => gate.output === input);
        if (possibleSwappedGate) {
          const { inputs, operator, output } = possibleSwappedGate;
          if (!possibleSwappedGates.find((gate) => gate.output === output)) {
            newPossibleSwappedGates.push({ operator, output, inputs: [...inputs] });
            foundPossibleSwappedGates = true;
          }
        }
      });
      possibleSwappedGates[i].counted = true;
    }
  }
  possibleSwappedGates.push(...newPossibleSwappedGates);
}

console.log(possibleSwappedGates);




const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const READY_WIRES = stringInput
  .split("\n\n")[0]
  .split("\n")
  .map((line) => {
    const [wireName, wireValue] = line.split(": ");
    return { wireName, wireValue: parseInt(wireValue) };
  });

const GATES = stringInput
  .split("\n\n")[1]
  .split("\n")
  .map((line) => {
    const [inputString, output] = line.split(" -> ");
    const [input1, operator, input2] = inputString.split(" ");
    return { inputs: [input1, input2], operator, output };
  });

const allZWires = GATES.map((gate) => (gate.output[0] === "z" ? gate.output : "notZ"))
  .filter((wireName) => wireName !== "notZ")
  .sort((a, b) => (a < b ? -1 : 1));

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

const calculateAdditionErrorAfterSwapping = (output1, output2) => {
  const readyWires = stringInput
    .split("\n\n")[0]
    .split("\n")
    .map((line) => {
      const [wireName, wireValue] = line.split(": ");
      return { wireName, wireExpression: wireName };
    });

  const gates = stringInput
    .split("\n\n")[1]
    .split("\n")
    .map((line) => {
      const [inputString, output] = line.split(" -> ");
      const [input1, operator, input2] = inputString.split(" ");
      return { inputs: [input1, input2], operator, output };
    });

  if (output1 && output2) {
    const i1 = gates.findIndex((gate) => gate.output === output1);
    const i2 = gates.findIndex((gate) => gate.output === output2);
    gates[i1].output = output2;
    gates[i2].output = output1;
  }

  const allReadyZWire = [];
  while (allReadyZWire.length !== allZWires.length) {
    const readyWireNames = readyWires.map((wire) => wire.wireName);
    const readyWireValues = readyWires.map((wire) => wire.wireValue);
    const newReadyWires = [];
    for (let i = 0; i < gates.length; i++) {
      if (gates[i].executed) continue;
      const { inputs, operator, output } = gates[i];
      const [input1, input2] = inputs;
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

  let Z = 0;
  let X = 0;
  let Y = 0;
  allReadyZWire.forEach((zWire, i) => {
    const exponent = parseInt(zWire.wireName.slice(1));
    Z += zWire.wireValue * Math.pow(2, exponent);
  });
  for (let i = 0; i < allReadyZWire.length - 1; i++) {
    X += readyWires[i].wireValue * Math.pow(2, i);
    Y += readyWires[i + 45].wireValue * Math.pow(2, i);
  }

  const bigXor = (n1, n2) => {
    const xorResultN = BigInt(n1) ^ BigInt(n2);
    const xorResult = Number(xorResultN);
    return xorResult;
  };

  const differentDigits = bigXor(X + Y, Z).toString(2);
  return differentDigits;
};

const fullAdder = (x, y, cIn) => {
  const s = `(${cIn})XOR(${x}XOR${y})`;
  const cOut = `((${cIn})AND(${x}XOR${y}))OR(${x}AND${y})`;
  return { s, cOut };
};

const addingResults = ["(x00)XOR(y00)"];
let cIn = "((x00)AND(y00))";
for (let i = 1; i < 46; i++) {
  const x = `(x${i <= 9 ? "0" : ""}${i})`;
  const y = `(y${i <= 9 ? "0" : ""}${i})`;
  const { s, cOut } = fullAdder(x, y, cIn);
  cIn = cOut;
  addingResults.push(s);
  console.log(s);
  console.log(cIn);
}

const buildExpression = () => {
  const readyWires = stringInput
    .split("\n\n")[0]
    .split("\n")
    .map((line) => line.split(": ")[0]);

  const gates = stringInput
    .split("\n\n")[1]
    .split("\n")
    .map((line) => {
      const [inputString, output] = line.split(" -> ");
      const [input1, operator, input2] = inputString.split(" ");
      return { inputs: [input1, input2], operator, output };
    });

};

const allExpressions = buildExpression();

// for (let i = 0; i < addingResults.length; i++) {
//   if (allExpressions[i].length !== addingResults[i].length) {
//     console.log(addingResults[i]);
//     console.log(allExpressions[i]);
//     console.log(i);
//   }
// }
