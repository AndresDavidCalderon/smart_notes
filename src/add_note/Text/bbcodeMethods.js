const tags = ['[b]', '[/b]', '[i]', '[/i]', '[img]', '[/img]'];

export function getEnd(openTag) {
  return `[/${openTag.substring(1)}`;
}
export function getSymbol(tag) {
  if (tag.startsWith('[/')) {
    return tag.substring(2, tag.length - 1);
  }
  return tag.substring(1, tag.length - 1);
}
export function isAreaBetween(startingTag, endingTag, text, startIndex, endIndex) {
  const currentIndex = text.lastIndexOf(startingTag, startIndex);
  if (currentIndex === -1) {
    return false;
  }
  if (text.indexOf(endingTag, startIndex) < endIndex) {
    return false;
  }
  return true;
}
function isIndexBetween(startingTag, endingTag, text, index) {
  const lastTag = text.lastIndexOf(startingTag, index);
  if (lastTag === -1) {
    return false;
  }
  const closing = text.indexOf(endingTag, lastTag);
  return closing > index;
}

export function findNearestTag(string, startingIndex, excludeClosing = false) {
  let includedTags = [...tags];
  if (excludeClosing) {
    includedTags = includedTags.filter((tag) => !tag.startsWith('[/'));
  }
  const nearest = includedTags.reduce(({ index, tag }, newTag) => {
    const distance = string.indexOf(newTag, startingIndex);
    const isEscaped = isIndexBetween('ESCAPE START', 'ESCAPE END', string, distance);
    if ((distance < index || index === -1) && distance !== -1 && !isEscaped) {
      return { index: distance, tag: newTag };
    }
    return { index, tag };
  }, { index: -1, tag: '' });
  if (nearest === -1) {
    return { index: -1, tag: 'not found' };
  }
  return nearest;
}

export function removeTagFromArea(text, startIndex, endIndex, startTag, endTag) {
  let newText = text;
  let newEndIndex = endIndex;
  let newStartIndex = startIndex;
  let startTagIndex = newText.lastIndexOf(startTag, newStartIndex);
  if (startTagIndex === -1 || newText.indexOf(endTag, startTagIndex) < startIndex) {
    startTagIndex = newText.indexOf(startTag, startIndex);
  }
  while (startTagIndex !== -1 && startTagIndex < newEndIndex) {
    if (startTagIndex < newStartIndex) {
      // end the effect before the selection
      newText = `${newText.substring(0, newStartIndex)}${endTag}${newText.substring(newStartIndex)}`;
      newStartIndex += endTag.length;
      newEndIndex += endTag.length;
    } else {
      // remove the starting tag
      newText = `${newText.substring(0, startTagIndex)}${newText.substring(startTagIndex + startTag.length)}`;
      newEndIndex -= startTag.length;
    }
    // now we assume the starting tag was already dealt with
    let latestClosing;
    if (startTagIndex > newStartIndex) {
      latestClosing = newText.indexOf(endTag, startTagIndex);
    } else {
      latestClosing = newText.indexOf(endTag, newStartIndex);
    }
    if (latestClosing === -1) {
      throw Error(`invalid bbcode given, tag ${startTag}doesnt end.`);
    }
    if (latestClosing > newEndIndex) {
      newText = `${newText.substring(0, newEndIndex)}${startTag}${newText.substring(newEndIndex)}`;
    } else {
      // delete the end too.
      newText = `${newText.substring(0, latestClosing)}${newText.substring(latestClosing + endTag.length)}`;
      newEndIndex -= endTag.length;
    }
    startTagIndex = newText.indexOf(startTag, startTagIndex + startTag.length);
  }
  return { text: newText, startingIndex: newStartIndex, endIndex: newEndIndex };
}
// when an effect containing another closes before the next one it contains, this fixes it.
export function fixHierarchy(text) {
  let newText = text;
  const openTags = [];
  let nextTag = findNearestTag(text, 0);
  while (nextTag.index !== -1) {
    if (nextTag.tag.startsWith('[/')) {
      if (openTags[openTags.length - 1] !== getSymbol(nextTag.tag)) {
        // this is what we have to fix.
        let tagIndex = nextTag.index - nextTag.tag.length;
        const tagText = nextTag.tag;
        const closingIndex = openTags.indexOf(getSymbol(nextTag.tag));
        newText = openTags.slice(closingIndex + 1).reverse().reduce((currentText, symbol) => {
          tagIndex += `[/${symbol}]`.length;
          // we add a closing before and an opening after
          return `${currentText.substring(0, tagIndex)}[/${symbol}]${currentText.substring(tagIndex, tagIndex + tagText.length)}[${symbol}]${currentText.substring(tagIndex + tagText.length)}`;
        }, newText);
        // we need to move the tag index after making the changes because we added stuff before it.
        nextTag.index = tagIndex;
      } else {
        openTags.pop();
      }
    } else {
      openTags.push(getSymbol(nextTag.tag));
    }
    nextTag = findNearestTag(text, nextTag.index + nextTag.tag.length);
  }
  return newText;
}

export function giveEffectToArea(text, startIndex, endIndex, startTag, endTag) {
  const newText = removeTagFromArea(text, startIndex, endIndex, startTag, endTag);
  return fixHierarchy(`${newText.text.substring(0, newText.startingIndex)}${startTag}${newText.text.substring(newText.startingIndex, newText.endIndex)}${endTag}${newText.text.substring(newText.endIndex)}`);
}

export function removeUselessTags(string) {
  let currentString = string;
  let newString = '';
  let lastTag = { tag: '', index: 0 };
  while (lastTag.index !== -1) {
    const currentIndex = lastTag.index + lastTag.tag.length;
    const startTag = findNearestTag(currentString, currentIndex, true);
    if (startTag.index !== -1) {
      const endTagIndex = currentString.indexOf(
        getEnd(startTag.tag),
        startTag.index + startTag.tag.length,
      );

      newString += currentString.substring(currentIndex, startTag.index);

      // check if tag is empty
      if (endTagIndex !== startTag.index + startTag.tag.length) {
        // add current tag to new string
        newString += startTag.tag;
      } else {
        // Remove end tag too
        currentString = `${currentString.substring(0, endTagIndex)}${currentString.substring(endTagIndex + getEnd(startTag.tag).length)}`;
      }
    } else {
      newString += currentString.substring(lastTag.index + lastTag.tag.length);
    }
    lastTag = startTag;
  }
  return newString;
}

export function getRawIndex(text, renderIndex) {
  let finalIndex = renderIndex;
  let currentIndex = 0;
  let tag = { index: 0, tag: '' };
  while (currentIndex < finalIndex && tag.index !== -1) {
    tag = findNearestTag(text, currentIndex);
    currentIndex = tag.index + tag.tag.length;
    finalIndex += tag.tag.length;
  }
  return finalIndex - tag.tag.length;
}

function isIndexInsideTag(index, text) {
  let currentIndex = 0;
  let lastTag;

  // find nearest tag before index
  while (currentIndex < index && currentIndex !== -1) {
    if (lastTag !== undefined) {
      currentIndex += lastTag.tag.length;
    }
    const tag = findNearestTag(text, currentIndex);
    currentIndex = tag.index;
    lastTag = tag;
  }
  // if its inside the last tag scanned
  if (lastTag !== undefined
    && lastTag.index < currentIndex
    && lastTag.index + lastTag.tag.length >= currentIndex) {
    return { overlap: currentIndex - lastTag.index, tag: lastTag };
  }
  return false;
}

// safe means it preserves bbcode tags, it only deletes them if they end up empty
export function removeSubstringSafe(from, to, string) {
  // is from or to are inside a tag, move them.
  let safeFrom = from;
  const fromTag = isIndexInsideTag(from, string);
  if (fromTag !== false) {
    safeFrom = fromTag.tag.index + fromTag.tag.tag.length;
  }
  let safeTo = to;
  const toTag = isIndexInsideTag(to, string);
  if (toTag !== false) {
    safeTo = toTag.tag.index - 1;
  }

  const newString = [string.substring(0, safeFrom)];
  let currentIndex = safeFrom;
  while (currentIndex < safeTo) {
    const tag = findNearestTag(string, currentIndex);
    if (tag.index !== -1) {
      if (tag.index < safeTo) {
        newString.push(tag.tag);
      }
      currentIndex = tag.index + tag.tag.length;
    } else {
      break;
    }
  }
  newString.push(string.substring(safeTo));
  return newString.join('');
}
