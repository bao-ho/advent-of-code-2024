const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

let A = parseInt(stringInput.split("\n\n")[0].split("\n")[0].split(": ")[1]);
let B = parseInt(stringInput.split("\n\n")[0].split("\n")[1].split(": ")[1]);
let C = parseInt(stringInput.split("\n\n")[0].split("\n")[2].split(": ")[1]);
const programAsString = stringInput.split("\n\n")[1].split(": ")[1];
const programAsArray = programAsString.split(",").map((s) => parseInt(s));

const program = [];
for (let i = 0; i < programAsArray.length / 2; i++) {
  program.push({ opcode: programAsArray[i * 2], operand: programAsArray[i * 2 + 1] });
}

const combo = (operand) => {
  switch (operand) {
    case 0:
    case 1:
    case 2:
    case 3:
      return operand;
    case 4:
      return A;
    case 5:
      return B;
    case 6:
      return C;
    default:
      return -1;
  }
};

// Xor is simplified when mod 8 math is used
const simpleXor = (bigNum, smallNum) => {
  const m = bigNum % 8;
  const n = m ^ smallNum;
  return bigNum - m + n;
};

// 0
const adv = (operand) => {
  const numerator = A;
  const comboOperand = combo(operand);
  const denominator = Math.pow(2, comboOperand);
  const result = Math.floor(numerator / denominator);
  A = result;
};

// 1
const bxl = (operand) => {
  B = simpleXor(B, operand);
};

// 2
const bst = (operand) => {
  const comboOperand = combo(operand);
  B = comboOperand % 8;
};

let pointer = 0;
// 3
const jnz = (operand) => {
  if (A !== 0) {
    pointer = operand / 2;
  }
};

// 4
const bxc = () => {
  B = simpleXor(C, B);
};

let output = "";
// 5
const out = (operand) => {
  const comboOperand = combo(operand);
  const result = comboOperand % 8;
  if (output === "") output = `${result}`;
  else output = `${output},${result}`;
};

// 6
const bdv = (operand) => {
  const numerator = A;
  const comboOperand = combo(operand);
  const denominator = Math.pow(2, comboOperand);
  const result = Math.floor(numerator / denominator);
  B = result;
};

// 7
const cdv = (operand) => {
  const numerator = A;
  const comboOperand = combo(operand);
  const denominator = Math.pow(2, comboOperand);
  const result = Math.floor(numerator / denominator);
  C = result;
};

A = 0;
let i = 29569499671493*8-100;
                // 2,4,1,3,7,5,4,7,0,3,1,5,5,5,3,0
const testInput = "2,4,1,3,7,5,4,7,0,3,1,5,5,5,3,0";
while (output !== testInput) {
  output = "";
  i += 1;
  A = i;
  B = 0;
  C = 0;
  pointer = 0;
  while (pointer < program.length) {
    const instruction = program[pointer];
    const { opcode, operand } = instruction;
    switch (opcode) {
      case 0:
        adv(operand);
        break;
      case 1:
        bxl(operand);
        break;
      case 2:
        bst(operand);
        break;
      case 3:
        jnz(operand);
        break;
      case 4:
        bxc();
        break;
      case 5:
        out(operand);
        break;
      case 6:
        bdv(operand);
        break;
      case 7:
        cdv(operand);
        break;

      default:
        break;
    }
    if (opcode !== 3 || A === 0) pointer += 1;
    if (output && testInput.indexOf(output) !== 0) break;
  }
  // console.log(output);
}

console.log(i);
