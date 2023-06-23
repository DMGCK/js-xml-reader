import fs from "fs";
import { type } from "os";

function getHowLongInSecondsFrom(startTime) {
  const now = Date.now();
  const timeInSeconds = (now - startTime) / 1000;
  return timeInSeconds;
}

fs.readFile("cards.xml", returnSets);

function returnSets(err, data) {
  if (err) {
    return console.error(err);
  }
  const startTime = Date.now();

  console.log(`Starting`);
  let i = 0;
  let nodeIndex = 0;
  for (let node in data) {
    if (i > 100) {
      return;
    }
    nodeIndex++;
    if (typeof node != "string") {
      i++;
      console.log(`TYPE ${typeof node} AT  ${nodeIndex}`);
    }
  }

  const finishTime = getHowLongInSecondsFrom(startTime);

  console.log(
    `Finished in ${finishTime} seconds, ${i} nodes found, ${nodeIndex} nodes traversed`
  );
}
