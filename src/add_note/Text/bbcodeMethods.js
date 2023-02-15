const tags = ['[b]', '[/b]', '[i]', '[/i]', '[img]', '[/img]'];

export function getEnd(openTag) {
  return `[/${openTag.substring(1)}`;
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

export function giveEffectToArea(text, startIndex, endIndex, startTag, endTag) {
  let newText = text;
  let newEndIndex;
  const startTagIndex = text.lastIndexOf(startTag, startIndex);
  const isClosedBeforeSelection = startTagIndex === -1
  || text.indexOf(endTag, startTagIndex) < startTag;
  if (isClosedBeforeSelection) {
    const startingTagInSelection = text.indexOf(startIndex, startTag);
    if (startingTagInSelection === -1 || startingTagInSelection > endIndex) {
      // this means that the effect doesnt start inside or before the selection
      // and therefore doesnt end inside it either so we can return now.
      return `${text.substring(0, startIndex - 1)}${startTag}${text.substring(startIndex - 1, endIndex)}${endTag}${text.substring(endIndex)}`;
    }
    // this means that the effect starts in the selection, and we gottas move it to the start.
    const selectionText = text.substring(startIndex, endIndex).replace(startTag, '');
    newText = `${text.substring(0, startIndex - 1)}${startTag}${selectionText}${text.substring(endIndex + 1)}`;
    newEndIndex -= startTag.length;
  }
  const endTagIndex = newText.indexOf(endTag, startIndex);
  if (endIndex === -1) {
    throw Error(`invalid BBCode text given, ${startTag} doesnt close`);
  }
  if (endTagIndex > newEndIndex) {
    return newText;
  }
  // this means that the effect ends in the selection, and we gottas move it to the end.
  const selectionText = text.substring(startIndex - 1, endIndex).replace(endTag, '');
  return `${text.substring(0, startIndex - 1)}${selectionText}${endTag}${text.substring(endIndex)}`;
}
export function findNearestTag(string, startingIndex) {
  const nearest = tags.reduce(({ index, tag }, newTag) => {
    const distance = string.indexOf(newTag, startingIndex);
    if ((distance < index || index === -1) && distance !== -1 && !isAreaBetween('ESCAPE START', 'ESCAPE END', string, distance, distance)) {
      return { index: distance, tag: newTag };
    }
    return { index, tag };
  }, { index: -1, tag: '' });
  if (nearest === -1) {
    return { index: -1, tag: 'not found' };
  }
  return nearest;
}

export function removeUselessTags(string) {
  let currentString = string;
  let newString = '';
  let lastTag = { tag: '', index: 0 };
  while (lastTag.index !== -1) {
    const currentIndex = lastTag.index + lastTag.tag.length;
    const startTag = findNearestTag(currentString, currentIndex);
    if (startTag.index !== -1) {
      const endTagIndex = currentString.indexOf(
        getEnd(startTag.tag),
        startTag.index + startTag.tag.length,
      );

      newString += currentString.substring(currentIndex, startTag.index);

      // check if tag is empty, closing tags are not checked
      if ((endTagIndex !== -1 && endTagIndex !== startTag.index + startTag.tag.length) || startTag.tag.startsWith('[/')) {
        // add current tag to new string
        newString += startTag.tag;
      } else {
        // Remove end tag too
        currentString = `${currentString.substring(0, endTagIndex)}${currentString.substring(endTagIndex + getEnd(startTag.tag).length)}`;
      }
    }
    newString += currentString.substring(lastTag.index + lastTag.length);
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
