const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const fullAdder = (x, y, cIn) => {
  const s = `(${x}XOR${y})XOR(${cIn})`;
  const cOut = `(${x}AND${y})OR((${x}XOR${y})AND(${cIn}))`;
  return { s, cOut };
};

const addingResults = ["(x00)XOR(y00)"];
let cIn = "(x00)AND(y00)";
for (let i = 1; i < 46; i++) {
  const x = `(x${i <= 9 ? "0" : ""}${i})`;
  const y = `(y${i <= 9 ? "0" : ""}${i})`;
  const { s, cOut } = fullAdder(x, y, cIn);
  cIn = cOut;
  addingResults.push(s);
}

const execute = (operator, expression1, expression2) => {
  switch (operator) {
    case "AND":
      return `(${expression1})AND(${expression2})`;
    case "OR":
      return `(${expression1})OR(${expression2})`;
    case "XOR":
      return `(${expression1})XOR(${expression2})`;
    default:
      return "";
  }
};

const buildExpression = () => {
  const readyWires = stringInput
    .split("\n\n")[0]
    .split("\n")
    .map((line) => {
      const [wireName, wireValue] = line.split(": ");
      return { wireName, wireExpression: wireName, phase: 0 };
    });

  const gates = stringInput
    .split("\n\n")[1]
    .split("\n")
    .map((line) => {
      const [inputString, output] = line.split(" -> ");
      const [input1, operator, input2] = inputString.split(" ");
      return { inputs: [input1, input2], operator, output };
    });

  const swapOutput = (output1, output2) => {
    const gate1 = gates.find((gate) => gate.output === output1);
    const gate2 = gates.find((gate) => gate.output === output2);
    gate1.output = output2;
    gate2.output = output1;
  };

  swapOutput("qjb", "gvw");
  swapOutput("jgc", "z15");
  swapOutput("drg", "z22");
  swapOutput("jbp", "z35");

  const allZWires = gates
    .map((gate) => (gate.output[0] === "z" ? gate.output : "notZ"))
    .filter((wireName) => wireName !== "notZ");

  const allReadyZWire = [];
  while (allReadyZWire.length !== allZWires.length) {
    const readyWireNames = readyWires.map((wire) => wire.wireName);
    const readyWireExpressions = readyWires.map((wire) => wire.wireExpression);
    const readyWirePhases = readyWires.map((wire) => wire.phase);
    const newReadyWires = [];
    for (let i = 0; i < gates.length; i++) {
      if (gates[i].executed) continue;
      const { inputs, operator, output } = gates[i];
      let [input1, input2] = inputs;
      if (input1[0] === "y") [input1, input2] = [input2, input1];
      const index1 = readyWireNames.indexOf(input1);
      const index2 = readyWireNames.indexOf(input2);
      if (index1 !== -1 && index2 !== -1) {
        let result = execute(operator, readyWireExpressions[index1], readyWireExpressions[index2]);
        if (readyWirePhases[index1] > readyWirePhases[index2])
          result = execute(operator, readyWireExpressions[index2], readyWireExpressions[index1]);
        const phase = Math.max(readyWirePhases[index1], readyWirePhases[index2]) + 1;
        newReadyWires.push({ wireName: output, wireExpression: result, phase });
        if (output[0] === "z") allReadyZWire.push({ wireName: output, wireExpression: result, phase });
        gates[i].executed = true;
      }
    }
    readyWires.push(...newReadyWires);
  }
  return { readyWires, allReadyZWire };
};

const { readyWires, allReadyZWire } = buildExpression();
allReadyZWire.sort((a, b) => (a.wireName > b.wireName ? 1 : -1));

// for (let i = 0; i < addingResults.length; i++) {
for (let i = 0; i < 45; i++) {
  if (allReadyZWire[i].wireExpression !== addingResults[i]) {
    console.log(addingResults[i]);
    console.log(allReadyZWire[i].wireExpression);
    console.log(i);
    console.log(readyWires.find((wire) => wire.wireExpression === addingResults[i]));
  }
}
