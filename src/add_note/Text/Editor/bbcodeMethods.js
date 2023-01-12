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

export default {
  getEnd,
  getRawIndex,
  findNearestTag,
};
