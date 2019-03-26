function chunkMessage(msg) {
  const lengthMsg = msg.length;
  if (lengthMsg <= 50) {
    // Does not split this message
    return [msg];
  } else {
    // Handle to split this message
    // Forecast the number of digits of the max section will be split
    let forecastNumber = forecastNumberDigitsOfMaxSplitMsg(lengthMsg);
    if (!forecastNumber) {
      return { error: "Message is over the max length" };
    }
    // Store all index of whitespace of this string message
    const spaceIndexArr = [];
    for (let i = 0; i < lengthMsg; i++) {
      if (msg[i] === " ") {
        spaceIndexArr.push(i);
      }
    }
    return handleSplit(msg, spaceIndexArr, lengthMsg, forecastNumber);
  }
}

function handleSplit(msg, spaceIndexArr, lengthMsg, forecastNumber) {
  const result = [];
  // Handle the first message
  const theFirstIndex = getIndexSplit(spaceIndexArr, 47 - forecastNumber);
  const theFirstMsg = msg.substring(0, theFirstIndex);
  result.push(theFirstMsg);
  let temp = theFirstIndex;
  let count = 1;
  // Iterator to get all message sections
  while (temp < lengthMsg) {
    count++;
    const numberDigitsOfCount = count.toString().length;
    let tempMsg = "";
    // Find the location should be split
    const tempPivot = temp + (49 - numberDigitsOfCount - forecastNumber);
    // The last message section will be push to result
    if (tempPivot > lengthMsg) {
      tempMsg = msg.substring(temp, lengthMsg);
      result.push(tempMsg);
      break;
    }
    // Find index of whitespace to split
    const findIndexMsg = getIndexSplit(spaceIndexArr, tempPivot);
    // Through an error when total characters of indicator and message is greater than 50
    if (temp === findIndexMsg) {
      return { error: "Has an error !!!" };
    }
    tempMsg = msg.substring(temp, findIndexMsg);
    result.push(tempMsg);
    temp = findIndexMsg;
  }
  const expectedResult = result.map((msg, index) => {
    // Append the indicator
    if (index === 0) {
      const indicator = `${index + 1}/${count} `;
      return indicator.concat(msg);
    }
    const indicator = `${index + 1}/${count}`;
    return indicator.concat(msg);
  });

  // Verify the result of split message
  const correctlyResult = verifyResultCorrectly(expectedResult);
  if (!correctlyResult) {
    // Loops again to make sure the result is correct
    return handleSplit(msg, spaceIndexArr, lengthMsg, forecastNumber + 1);
  }
  return expectedResult;
}

function verifyResultCorrectly(result) {
  for (let i = 0; i < result.length; i++) {
    if (result[i].length > 50) {
      return false;
    }
  }
  return true;
}

function getIndexSplit(arr, pivot) {
  const tempIndex = arr.findIndex(e => e > pivot);
  if (arr[arr.length - 1] <= pivot) {
    return arr[arr.length - 1];
  }
  return arr[tempIndex - 1];
}

function forecastNumberDigitsOfMaxSplitMsg(lengthMsg) {
  if (lengthMsg <= 422) {
    return 1;
  } else if (lengthMsg <= 4463) {
    return 2;
  } else if (lengthMsg <= 42000) {
    return 3;
  } else {
    return 0;
  }
}

export default chunkMessage;
