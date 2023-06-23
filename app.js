import fs from "fs";
import { type } from "os";

function getHowLongInSecondsFrom(startTime) {
  const now = Date.now();
  const timeInSeconds = (now - startTime) / 1000;
  return timeInSeconds;
}

fs.readFile("cards.xml", returnSets);

function returnSets(err, data) {
  console.log(`Starting`);
  if (err) {
    return console.error(err);
  }
  const startTime = Date.now();
  const dataDictionary = {};
  let nodeIndex = 0;

  for (let node in data) {
    const numberOfKeys = Object.keys(node).length;
    nodeIndex++;

    try {
      // get how many nodes have how many keys
      if (!dataDictionary[numberOfKeys]) {
        dataDictionary[numberOfKeys] = 1;
      }
      dataDictionary[numberOfKeys]++;
    } catch (err) {
      console.error(err);
    }
  }

  const finishTime = getHowLongInSecondsFrom(startTime);

  console.log(
    `Finished in ${finishTime} seconds, ${nodeIndex} nodes traversed`
  );
  console.log(dataDictionary);
}
