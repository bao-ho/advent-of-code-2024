const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const stringInput = fs.readFileSync(`${currentDir}/input.txt`, {
  encoding: "utf8",
});

const robotsStrings = stringInput.split("\n");

const WIDTH = 101;
const HEIGHT = 103;

const robots = [];

robotsStrings.forEach((robot) => {
  const x = parseInt(robot.split(" ")[0].split(",")[0].split("=")[1]);
  const y = parseInt(robot.split(" ")[0].split(",")[1]);
  const vx = parseInt(robot.split(" ")[1].split(",")[0].split("=")[1]);
  const vy = parseInt(robot.split(" ")[1].split(",")[1]);
  robots.push({ x, y, vx, vy });
});

const getFuturePosition = (robot, time) => {
  const { x, y, vx, vy } = robot;
  let X = (x + vx * time) % WIDTH;
  let Y = (y + vy * time) % HEIGHT;
  if (X < 0) X += WIDTH;
  if (Y < 0) Y += HEIGHT;
  return { X, Y };
};

const drawOnCanvas = async (time) => {
  const canvas = [];
  for (let i = 0; i < WIDTH; i++) {
    const column = [];
    for (let j = 0; j < HEIGHT; j++) {
      column.push(".");
    }
    canvas.push(column);
  }
  robots.forEach((robot) => {
    const { X, Y } = getFuturePosition(robot, time);
    if (canvas[X][Y] === ".") canvas[X][Y] = "1";
    else canvas[X][Y] = `${parseInt(canvas[X][Y]) + 1}`;
  });

  let canvasAsString = "";
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      canvasAsString += canvas[j][i];
    }
    canvasAsString += "\n";
  }

  fs.writeFileSync(`${currentDir}/output${time}.txt`, canvasAsString, {
    encoding: "utf8",
  });
};

for (let i = 11; i < 10000; i += 101) {
  drawOnCanvas(i);
}
