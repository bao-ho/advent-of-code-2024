const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const rows = stringInput.split("\n");
const map = [];
for (let i = 0; i < rows[0].length; i++) {
  const column = [];
  for (let j = 0; j < rows.length; j++) {
    column.push(rows[j][i]);
  }
  map.push(column);
}

const WIDTH = map[0].length;
const HEIGHT = map.length;

const getLabel = (plot) => map[plot.x][plot.y];
const setLabel = (plot, label) => {
  map[plot.x][plot.y] = label;
};

const getAdjacentPlots = (currentPlot) => {
  const plots = [];
  const { x, y } = currentPlot;
  const label = getLabel(currentPlot);
  // north
  if (y - 1 >= 0 && map[x][y - 1] === label) plots.push({ x, y: y - 1 });
  // east
  if (x + 1 < WIDTH && map[x + 1][y] === label) plots.push({ x: x + 1, y });
  // south
  if (y + 1 < HEIGHT && map[x][y + 1] === label) plots.push({ x, y: y + 1 });
  // west
  if (x - 1 >= 0 && map[x - 1][y] === label) plots.push({ x: x - 1, y });
  return plots;
};

const getFencePriceForRegionContaining = ({ x, y }) => {
  if (getLabel({ x, y }) === ".") return 0;
  const stack = [];
  stack.push({ x, y });
  let area = 0;
  let commonEdges = 0;
  while (stack.length > 0) {
    const currentPlot = stack.pop();
    if (getLabel(currentPlot) !== ".") {
      const adjacentPlot = getAdjacentPlots(currentPlot);
      commonEdges += adjacentPlot.length;
      setLabel(currentPlot, ".");
      area += 1;
      stack.push(...adjacentPlot);
    }
  }
  return area * (area * 4 - 2 * commonEdges);
};

let totalPrice = 0;
for (let x = 0; x < WIDTH; x++) {
  for (let y = 0; y < HEIGHT; y++) {
    totalPrice += getFencePriceForRegionContaining({ x, y });
  }
}

console.log(totalPrice);
