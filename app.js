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
  const xmlString = [...data.toString()];
  let currentString = "";
  let openTagsArray = [];
  let openingTag = false;
  let closingTag = false;
  try {
    xmlString.forEach((character, i) => {
      // EXIT @ 1000 cycles
      if (i > 500) {
        return openTagsArray;
      }
      currentString = `${currentString}${character}`;
      // if its longer than like idk 30 character mark it as closing as you find the > bracer
      if (currentString.length > 30 && openingTag && !closingTag) {
        closingTag = true;
        console.log("This one is too long");
      }
      if (character == `<` && xmlString[i + 1] != `/` && !closingTag) {
        openingTag = true;
        // console.log(`Starting to open tag ${currentString}`);
      }
      if (character == `>` && openingTag) {
        openTagsArray.push({ [currentString]: [] });
        console.log(
          `OPEN TAG ${currentString}`
          // PREV TAG ${Object.keys(openTagsArray[openTagsArray.length - 2] || "null")}
        );
        openingTag = false;
        currentString = "";
      }
      if (character == `<` && xmlString[i + 1] == `/` && !openingTag) {
        // console.log(`CLOSER FOUND - CONTENT ${currentString}`);
        closingTag = true;
      }
      if (character == `>` && closingTag) {
        const mostRecentlyClosedTag = openTagsArray[openTagsArray.length - 1];
        const splitStringArray = currentString.split("</");

        mostRecentlyClosedTag[`<${splitStringArray[1]}`] = splitStringArray[0];
        console.log(
          `Closed tag ${Object.keys(mostRecentlyClosedTag)} with data ${
            mostRecentlyClosedTag[`<${splitStringArray[1]}`]
          }`
        );

        currentString = "";
        closingTag = false;
      }
      // else {
      //   // console.log(`ACTUAL CONTENT ${currentString}`);
      //   currentString = "";
      // }
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
