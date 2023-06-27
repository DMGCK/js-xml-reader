import fs from "fs";

function getHowLongInSecondsFrom(startTime) {
  const now = Date.now();
  const timeInSeconds = (now - startTime) / 1000;
  return timeInSeconds;
}

fs.readFile("cards.xml", transformIntoObject);

function transformIntoObject(err, data) {
  console.log(`Starting`);
  const startTime = Date.now();
  const convertedData = {};
  const xmlString = [...data.toString()];
  let currentString = "";
  let openTagsArray = [];
  let openingTag = false;
  let closingTag = false;
  const internalContent = "";
  try {
    xmlString.forEach((character, i) => {
      if (i > 1000) {
        return openTagsArray;
      }
      currentString = `${currentString}${character}`;
      console.log(currentString);
      // if its longer than like idk 30 character mark it as closing as you find the > bracer
      if (currentString.length > 30 && openingTag) {
        closingTag = true;
      }
      if (character == `<` && xmlString[i + 1] != `/` && !closingTag) {
        openingTag = true;
      }
      if (character == `>` && openingTag) {
        openTagsArray.push({ [currentString]: [] });
        // console.log(`OPEN TAG ${currentString} ${i}`);
        openingTag = false;
        currentString = "";
      }
      if (character == `<` && xmlString[i + 1] == `/` && !openingTag) {
        // console.log(`CLOSER FOUND - CONTENT ${currentString}`);
        closingTag = true;
        // prettier-ignore
        // put the data collected in between in the value of the closed tag
        // remove the latest open tag from array
        // openTagsArray[?openTagsArray.length -2][thisKey].push() = internalContent;
      }
      if (character == `>` && closingTag) {
        // console.log(`CLOSING TAG ${currentString}`);
        currentString = "";
        closingTag = false;
      } else {
        // console.log(`ACTUAL CONTENT ${currentString}`);
        currentString = "";
      }
    });
  } catch (err) {
    console.error(err);
  }

  const finishTime = getHowLongInSecondsFrom(startTime);
  console.log(`Finished in ${finishTime} seconds`);
  console.log(openTagsArray[2]);
}

function getNodeTypesAndAmount(data) {
  let nodeIndex = 0;
  const nodeDictionary = {};
  for (let node in data) {
    const numberOfKeys = Object.keys(node).length;
    nodeIndex++;
    try {
      if (!nodeDictionary[numberOfKeys]) {
        nodeDictionary[`${numberOfKeys}Keys`] = 1;
      }
      nodeDictionary[`${numberOfKeys}Keys`]++;
    } catch (err) {
      console.error(err);
    }
  }
  return nodeDictionary;
}
