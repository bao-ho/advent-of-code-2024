const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const codes = stringInput.split("\n");

const getNextPositions = (pos, invalidPos, unitVector) => {
  const { x, y } = pos;
  const { x: X, y: Y } = invalidPos;
  const { x: dx, y: dy } = unitVector;
  const nextPositions = [
    { x, y: y + dy },
    { x: x + dx, y },
  ];
  return nextPositions.filter((nextPosition) => nextPosition.x !== X || nextPosition.y !== Y);
};

const cachedRoutes = [];
let cacheHits = 0;
let totalCalls = 0;
const getRoutes = (start, end, invalidPos) => {
  const { x: x1, y: y1 } = start;
  const { x: x2, y: y2 } = end;
  const { x: X, y: Y } = invalidPos;
  const cachedKey = `${x1},${y1},${x2},${y2},${X},${Y}`;
  totalCalls += 1;
  if (cachedRoutes[cachedKey] !== undefined) {
    cacheHits += 1;
    return cachedRoutes[cachedKey];
  }
  const unitVector = { x: (x2 - x1) / Math.abs(x2 - x1), y: (y2 - y1) / Math.abs(y2 - y1) };
  const { x: dx, y: dy } = unitVector;
  const xMarker = dx > 0 ? ">" : "<";
  const yMarker = dy > 0 ? "v" : "^";
  if (x1 === x2) return [yMarker.repeat(Math.abs(y2 - y1))];
  if (y1 === y2) return [xMarker.repeat(Math.abs(x2 - x1))];
  const routes = [];
  const nextPositions = getNextPositions(start, invalidPos, unitVector);
  nextPositions.forEach((nextPosition) => {
    const [routeToNextPosition] = getRoutes(start, nextPosition, invalidPos);
    const routesToEnds = getRoutes(nextPosition, end, invalidPos);
    routesToEnds.forEach((route) => {
      routes.push(`${routeToNextPosition}${route}`);
    });
  });
  cachedRoutes[cachedKey] = routes;
  return routes;
};

const debugSet = new Set();

const getOptimizedRoute = (routes) => {
  for (let i = 0; i < routes.length; i++) {
    const sortedCharacters = routes[i]
      .split("")
      .sort((a, b) => (a > b ? 1 : -1))
      .join("");
    switch (sortedCharacters) {
      // 0
      case "":
        return "";
      // 1
      case ">":
        return ">";
      case "<":
        return "<";
      case "^":
        return "^";
      case "v":
        return "v";
      // 2
      case "<v":
        return routes.length === 1 ? "v<" : "<v"; // optimized
      case "vv":
        return "vv";
      case ">^":
        return routes.length === 1 ? ">^" : "^>"; // optimized
      case ">>":
        return ">>";
      case "^^":
        return "^^";
      case "<<":
        return "<<";
      case ">v":
        return "v>"; // optimized
      case "<^":
        return "<^"; // optimized, always has 2 routes
      // 3
      case "<<v":
        return "v<<"; // optimized, always has 2 routes out of 3 (1 invalid)
      case ">>^":
        return ">>^"; // optimized, always has 2 routes out of 3 (1 invalid)
      case ">>v":
        return ">>v"; // optimized, always has 2 routes out of 3 (1 invalid)
      case "<^^":
        return "<^^"; // optimized, always has 3 routes
      case "<<^":
        return "<<^"; // optimized, always has 3 routes
      case "vvv":
        return "vvv";
      // 4
      case ">>^^":
        return "^^>>"; // Optimized
      case "<<^^": // never happens for the given input
        return routes.length === 5 ? "^^<<" : "<<^^"; //?
      case "<^^^":
        return "<^^^"; // Optimized, always has 4 routes
      case ">vvv":
        return "vvv>"; // Optimized, always has 4 routes
      default:
        return sortedCharacters;
    }
  }
};

const getSequenceOnNumericKeypad = (code) => {
  const invalidPos = { x: 0, y: 3 };
  let previousPos = { x: 2, y: 3 };
  let sequence = "";
  for (let i = 0; i < code.length; i++) {
    let pos = { x: 2, y: 3 };
    if (code[i] !== "A") {
      const num = parseInt(code[i]);
      pos = num === 0 ? { x: 1, y: 3 } : { x: (num - 1) % 3, y: 2 - Math.floor((num - 1) / 3) };
    }
    const route = getOptimizedRoute(getRoutes(previousPos, pos, invalidPos));
    sequence = `${sequence}${route}A`;
    previousPos = pos;
  }
  return sequence;
};

const getCoordinate = (code) => {
  switch (code) {
    case "^":
      return { x: 1, y: 0 };
    case ">":
      return { x: 2, y: 1 };
    case "v":
      return { x: 1, y: 1 };
    case "<":
      return { x: 0, y: 1 };
    default: //"A"
      return { x: 2, y: 0 };
  }
};

const getSequenceOnArrowKeypad = (previousSequence) => {
  let sequence = {};
  Object.values(previousSequence).forEach(({ requiredPresses, count }) => {
    const subCodes = requiredPresses.split("A");
    for (let i = 0; i < subCodes.length - 1; i++) {
      subCodes[i] = `${subCodes[i]}A`;
    }
    subCodes.pop();
    for (let i = 0; i < subCodes.length; i++) {
      if (sequence[subCodes[i]]) {
        sequence[subCodes[i]].count += count;
      } else sequence[subCodes[i]] = { count };
    }
  });

  const invalidPos = { x: 0, y: 0 };
  const subCodes = Object.keys(sequence);
  for (let i = 0; i < subCodes.length; i++) {
    const subCode = subCodes[i];
    let previousPos = { x: 2, y: 0 }; //'A'
    let subSequence = "";
    for (let i = 0; i < subCode.length; i++) {
      const pos = getCoordinate(subCode[i]);
      const route = getOptimizedRoute(getRoutes(previousPos, pos, invalidPos));
      subSequence = `${subSequence}${route}A`;
      previousPos = pos;
    }
    sequence[subCode].requiredPresses = subSequence;
  }
  return sequence;
};

let complexity = 0;
let REPEATS = 25;
codes.forEach((code) => {
  let sequence = { [code]: { requiredPresses: getSequenceOnNumericKeypad(code), count: 1 } };
  for (let i = 0; i < REPEATS; i++) {
    sequence = getSequenceOnArrowKeypad(sequence);
  }
  let sequenceLength = 0;
  Object.keys(sequence).forEach((key) => {
    const { count, requiredPresses } = sequence[key];
    sequenceLength += count * requiredPresses.length;
  });
  complexity += sequenceLength * parseInt(code.split("A")[0]);
  console.log(sequenceLength);
});
console.log(complexity);
console.log(debugSet);
