import fs from "fs";

function getHowLongInSecondsFrom(startTime) {
  const now = Date.now();
  const timeInSeconds = (now - startTime) / 1000;
  return timeInSeconds;
}

function findLatestPairIndex(tagArray, matchingObj) {
  const openingIndex = tagArray.findIndex((tag) => {
    if (`<${matchingObj}` == tag.toString()) {
      return true;
    }
  });

  if (openingIndex != tagArray.length - 1) {
    return openingIndex;
  }
}

fs.readFile("cards.xml", transformIntoObject);

async function transformIntoObject(err, data) {
  console.log("STARTING");
  const startTime = Date.now();
  const xmlString = [...data.toString()];
  const maxCycles = xmlString.length;
  let currentlyLoaded = 0;
  let currentString = "";
  let openTagsArray = [];
  let openingTag = false;
  let closingTag = false;
  try {
    xmlString.forEach((character, ind) => {
      const percentLoaded = ind / maxCycles;

      if (percentLoaded.toFixed(1) > currentlyLoaded) {
        console.log(
          `LOADING: %${
            percentLoaded.toFixed(1) / 10
          } in ${getHowLongInSecondsFrom(startTime)} seconds`
        );
        currentlyLoaded = percentLoaded.toFixed(1);
      }

      if (ind > maxCycles) {
        return;
      }
      currentString = `${currentString}${character}`
        .replace(/\s/g, "")
        .replace(/[\r\n]/gm, "");
      if (currentString.length > 30 && openingTag && !closingTag) {
        closingTag = true;
      }

      if (character == `<` && xmlString[ind + 1] != `/` && !closingTag) {
        openingTag = true;
      }

      if (character == `>` && openingTag) {
        if (
          currentString[currentString.length - 2] != "?" &&
          currentString[currentString.length - 2] != `"`
        ) {
          openTagsArray.push(currentString);
        }
        openingTag = false;
        currentString = "";
      }

      if (character == `<` && xmlString[ind + 1] == `/` && !openingTag) {
        closingTag = true;
      }

      if (character == `>` && closingTag) {
        const splitStringArray = currentString.split("</");
        // prettier-ignore
        const isParentNodeIndex = findLatestPairIndex(openTagsArray,splitStringArray[1]);
        if (!isParentNodeIndex) {
          openTagsArray[openTagsArray.length - 1] = {
            [`<${splitStringArray[1]}`]: splitStringArray[0],
          };
        }
        if (typeof isParentNodeIndex == "number" && isParentNodeIndex > 0) {
          const internalData = openTagsArray.splice(
            isParentNodeIndex,
            openTagsArray.length - isParentNodeIndex - 1
          );
          openTagsArray[openTagsArray.length - 1] = internalData;
        }
        currentString = "";
        closingTag = false;
      }
    });
  } catch (err) {
    console.error(err);
  }
  console.log(openTagsArray);
  const finishTime = getHowLongInSecondsFrom(startTime);
  console.log(`Finished in ${finishTime} seconds`);
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
