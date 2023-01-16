const tags = ['[b]', '[/b]', '[i]', '[/i]'];

function getEnd(openTag) {
  return `[/${openTag.substring(1)}`;
}

function findNearestTag(string, startingIndex) {
  const nearest = tags.reduce(({ index, tag }, newTag) => {
    const distance = string.indexOf(newTag, startingIndex);
    if ((distance < index || index === -1) && distance !== -1) {
      return { index: distance, tag: newTag };
    }
    return { index, tag };
  }, { index: -1, tag: 'none' });
  if (nearest === -1) {
    return { index: -1, tag: 'not found' };
  }
  return nearest;
}

function getRawIndex(text, renderIndex) {
  let finalIndex = renderIndex;
  let currentIndex = 0;
  let tag = { index: 0, tag: '' };
  while (currentIndex < finalIndex) {
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
  if (lastTag.index < currentIndex && lastTag.index + lastTag.tag.length >= currentIndex) {
    return { overlap: currentIndex - lastTag.index, tag: lastTag };
  }
  return false;
}

// safe means it preserves bbcode tags, it only deletes them if they end up empty

function removeSubstringSafe(from, to, string) {
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
    if (tag.index <= safeTo) {
      newString.push(tag.tag);
    }
    currentIndex = tag.index + tag.tag.length;
  }
  newString.push(string.substring(safeTo));
  return newString.join('');
}

export default {
  getEnd,
  getRawIndex,
  findNearestTag,
  removeSubstringSafe,
};
