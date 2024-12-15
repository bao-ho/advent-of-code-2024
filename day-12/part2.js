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

const WIDTH = map.length;
const HEIGHT = map[0].length;

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

const uniquePush = (currentElements, newElements) => {
  for (let i = 0; i < newElements.length; i++) {
    const e = newElements[i];
    if (
      !currentElements.find((ce) => JSON.stringify(ce) === JSON.stringify(e))
    ) {
      currentElements.push(e);
    }
  }
};

const removeCommonEdges = (edges) => {
  const uniqueEdges = new Set();
  edges.forEach((edge) => {
    const edgeAsString = JSON.stringify(edge);
    if (uniqueEdges.has(edgeAsString)) uniqueEdges.delete(edgeAsString);
    else uniqueEdges.add(edgeAsString);
  });
  return Array.from(uniqueEdges).map((edgeString) => JSON.parse(edgeString));
};

const getFencePriceForRegionContaining = ({ x, y }) => {
  if (getLabel({ x, y }) === ".") return 0;
  const stack = [];
  stack.push({ x, y });
  const plots = [];
  const vertices = [];
  let hEdges = [];
  let vEdges = [];
  while (stack.length > 0) {
    const currentPlot = stack.pop();
    if (getLabel(currentPlot) !== ".") {
      const adjacentPlot = getAdjacentPlots(currentPlot);
      setLabel(currentPlot, ".");
      plots.push(currentPlot);
      stack.push(...adjacentPlot);
    }
  }
  plots.forEach((plot) => {
    const { x, y } = plot;
    uniquePush(vertices, [
      { x, y },
      { x: x + 1, y },
      { x, y: y + 1 },
      { x: x + 1, y: y + 1 },
    ]);
    hEdges.push(
      [
        { x, y },
        { x: x + 1, y },
      ],
      [
        { x: x, y: y + 1 },
        { x: x + 1, y: y + 1 },
      ]
    );
    vEdges.push(
      [
        { x, y },
        { x, y: y + 1 },
      ],
      [
        { x: x + 1, y },
        { x: x + 1, y: y + 1 },
      ]
    );
  });
  hEdges = removeCommonEdges(hEdges);
  vEdges = removeCommonEdges(vEdges);
  vertices.forEach((vertex) => {
    const { x, y } = vertex;
    const northEdge = vEdges.find((e) => e[1].x === x && e[1].y === y) ? 1 : 0;
    const eastEdge = hEdges.find((e) => e[0].x === x && e[0].y === y) ? 1 : 0;
    const southEdge = vEdges.find((e) => e[0].x === x && e[0].y === y) ? 1 : 0;
    const westEdge = hEdges.find((e) => e[1].x === x && e[1].y === y) ? 1 : 0;
    vertex.adjacentEdgesCode = `${northEdge}${eastEdge}${southEdge}${westEdge}`;
  });
  let nEdges = 0;
  vertices.forEach((vertex) => {
    const { adjacentEdgesCode } = vertex;
    // For vertices with perpendicular edges, count 1
    if (["1100", "1001", "0110", "0011"].includes(adjacentEdgesCode))
      nEdges += 1;
    // For vertices with 2 perpendicular edges, count 2
    if (["1111"].includes(adjacentEdgesCode)) nEdges += 2;
  });
  const price = plots.length * nEdges;
  return price;
};

let totalPrice = 0;
for (let x = 0; x < WIDTH; x++) {
  for (let y = 0; y < HEIGHT; y++) {
    totalPrice += getFencePriceForRegionContaining({ x, y });
  }
}
console.log(totalPrice);
