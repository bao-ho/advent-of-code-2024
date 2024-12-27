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
    const routesToEnd = getRoutes(nextPosition, end, invalidPos);
    routesToEnd.forEach((route) => {
      routes.push(`${routeToNextPosition}${route}`);
    });
  });
  cachedRoutes[cachedKey] = routes;
  return routes;
};

const getSequencesOnNumericKeypad = (code) => {
  const posA = { x: 2, y: 3 };
  const invalidPos = { x: 0, y: 3 };
  let previousPos = posA;
  let sequences = [""];
  for (let i = 0; i < code.length; i++) {
    let pos = { x: 2, y: 3 };
    if (code[i] !== "A") {
      const num = parseInt(code[i]);
      pos = num === 0 ? { x: 1, y: 3 } : { x: (num - 1) % 3, y: 2 - Math.floor((num - 1) / 3) };
    }
    const routes = getRoutes(previousPos, pos, invalidPos);
    const newSequences = [];
    routes.forEach((route) => {
      sequences.forEach((sequence) => {
        newSequences.push(`${sequence}${route}A`);
      });
    });
    previousPos = pos;
    sequences = newSequences;
  }
  return sequences;
};

const getSequencesOnArrowKeypad = (code) => {
  const posA = { x: 2, y: 0 };
  const invalidPos = { x: 0, y: 0 };
  let previousPos = posA;
  let sequences = [""];
  for (let i = 0; i < code.length; i++) {
    let pos = { x: 2, y: 0 };
    if (code[i] !== "A") {
      switch (code[i]) {
        case "^":
          pos = { x: 1, y: 0 };
          break;
        case ">":
          pos = { x: 2, y: 1 };
          break;
        case "v":
          pos = { x: 1, y: 1 };
          break;
        default: //"<"
          pos = { x: 0, y: 1 };
          break;
      }
    }
    const routes = getRoutes(previousPos, pos, invalidPos);
    const newSequences = [];
    routes.forEach((route) => {
      sequences.forEach((sequence) => {
        newSequences.push(`${sequence}${route}A`);
      });
    });
    previousPos = pos;
    sequences = newSequences;
  }
  return sequences;
};

let complexity = 0;
codes.forEach((code) => {
  let minLength = 1000000; //infinity
  let arrowSequences1 = getSequencesOnNumericKeypad(code);
  arrowSequences1.forEach((as1) => {
    let arrowSequences2 = getSequencesOnArrowKeypad(as1);
    arrowSequences2.forEach((as2) => {
      let arrowSequences3 = getSequencesOnArrowKeypad(as2);
      arrowSequences3.forEach((as3) => {
        const arrowSequences4 = getSequencesOnArrowKeypad(as3);
        for (let i = 0; i < arrowSequences4.length; i++) {
          if (arrowSequences4[i].length < minLength) {
            minLength = arrowSequences4[i].length;
            console.log(code, as1, as2, as3, arrowSequences4[i]);
          }
        }
      });
    });
  });
  complexity += minLength * parseInt(code.split("A")[0]);
  console.log(minLength);
});
console.log(complexity);
