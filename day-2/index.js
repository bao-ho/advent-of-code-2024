const fs = require("fs");
const path = require("path");

const currentDir = path.resolve(__dirname);
const allReportStrings = fs
  .readFileSync(`${currentDir}/input.txt`, { encoding: "utf8" })
  .split("\n");

const reports = [];

allReportStrings.forEach((reportString) => {
  const levelStrings = reportString.split(" ");
  const report = levelStrings.map((levelString) => parseInt(levelString));
  reports.push(report);
});

const saveCheck = (report) => {
  const firstDiff = report[1] - report[0];
  if (firstDiff === 0 || Math.abs(firstDiff) > 3) {
    return false;
  }
  const progress = firstDiff > 0 ? "increase" : "decrease";
  for (let i = 1; i < report.length; i++) {
    const diff = report[i + 1] - report[i];
    if (progress === "increase" && (diff > 3 || diff < 1)) {
      return false;
    }
    if (progress === "decrease" && (diff < -3 || diff > -1)) {
      return false;
    }
  }
  return true;
};

const saveCheck2 = (report) => {
  const trends = [];
  const violationsStatus = [];
  let nFlats = 0;
  let nIncreases = 0;
  let nDecreases = 0;
  let nViolations = 0;
  for (let i = 0; i < report.length - 1; i++) {
    const diff = report[i + 1] - report[i];
    if (diff === 0) {
      trends.push("flat");
      nFlats += 1;
    }
    if (diff > 0) {
      trends.push("increase");
      nIncreases += 1;
    }
    if (diff < 0) {
      trends.push("decrease");
      nDecreases += 1;
    }
    if (diff === 0 || Math.abs(diff) > 3) {
      nViolations += 1;
      violationsStatus.push("violation");
    } else {
      violationsStatus.push("ok");
    }
  }
  if (nIncreases >= trends.length - 1) {
    let strangeLinkIndex = -1;
    for (let i = 0; i < trends.length; i++) {
      if (trends[i] !== "increase" || violationsStatus[i] === "violation") {
        strangeLinkIndex = i;
        break;
      }
    }
    if (strangeLinkIndex !== -1) {
      const subArray1 = report.toSpliced(strangeLinkIndex, 1);
      const subArray2 = report.toSpliced(strangeLinkIndex + 1, 1);
      return saveCheck(subArray1) || saveCheck(subArray2);
    }
    return saveCheck(report);
  } else if (nDecreases >= trends.length - 1) {
    let strangeLinkIndex = -1;
    for (let i = 0; i < trends.length; i++) {
      if (trends[i] !== "decrease" || violationsStatus[i] === "violation") {
        strangeLinkIndex = i;
        break;
      }
    }
    if (strangeLinkIndex !== -1) {
      const subArray1 = report.toSpliced(strangeLinkIndex, 1);
      const subArray2 = report.toSpliced(strangeLinkIndex + 1, 1);
      return saveCheck(subArray1) || saveCheck(subArray2);
    }
    return saveCheck(report);
  } else {
    return false;
  }
};

let safeCount = 0;
for (let i = 0; i < reports.length; i++) {
  if (saveCheck2(reports[i])) {
    safeCount += 1;
    console.log(true);
  } else {
    console.log(false);
  }
}

console.log(safeCount);
