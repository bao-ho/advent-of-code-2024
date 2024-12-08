const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const rows = stringInput.split("\n");
const results = [];
const equations = [];
rows.forEach((row) => {
  const [resultStr, equationStr] = row.split(": ");
  const result = parseInt(resultStr);
  const operandStrs = equationStr.split(" ");
  const equation = operandStrs.map((operandStr) => parseInt(operandStr));
  results.push(result);
  equations.push(equation);
});

const test = (result, equation) => {
  if (equation.length === 0) {
    if (result === 1) return true;
    return false;
  }
  if (!Number.isInteger(result)) {
    return false;
  }
  const newEquation = equation.slice(0, equation.length - 1);
  const lastOperand = equation[equation.length - 1];
  const lastOperandConcatFactor = Math.pow(10, lastOperand.toString().length);
  const newResultMulCase = result / lastOperand;
  const newResultAddCase = result - lastOperand;
  const newResultConcatCase = (result - lastOperand) / lastOperandConcatFactor;
  return (
    test(newResultAddCase, newEquation) ||
    test(newResultMulCase, newEquation) ||
    test(newResultConcatCase, newEquation)
  );
};

let sum = 0;
for (let i = 0; i < results.length; i++) {
  if (test(results[i], equations[i])) {
    sum += results[i];
  }
}

console.log(sum);
