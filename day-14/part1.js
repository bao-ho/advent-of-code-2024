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

const nRobotsInQuadrants = [0, 0, 0, 0];
robots.forEach((robot) => {
  const { X, Y } = getFuturePosition(robot, 100);
  if (X < (WIDTH - 1) / 2 && Y < (HEIGHT - 1) / 2) nRobotsInQuadrants[0] += 1;
  if (X > (WIDTH - 1) / 2 && Y < (HEIGHT - 1) / 2) nRobotsInQuadrants[1] += 1;
  if (X < (WIDTH - 1) / 2 && Y > (HEIGHT - 1) / 2) nRobotsInQuadrants[2] += 1;
  if (X > (WIDTH - 1) / 2 && Y > (HEIGHT - 1) / 2) nRobotsInQuadrants[3] += 1;
});

const [n0, n1, n2, n3] = nRobotsInQuadrants;
console.log(n0 * n1 * n2 * n3);
