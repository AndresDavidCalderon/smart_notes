function charsInNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent.length;
  }
  if (node.tagName === 'IMG') {
    return 2;
  }
  // if its an element that should have children
  return Array.from(node.childNodes).reduce((charachters, currentNode) => {
    let newCharCount = charachters;
    switch (node.nodeType) {
      case Node.ELEMENT_NODE: {
        switch (node.tagName) {
          case 'I':
          case 'B': {
            newCharCount += charsInNode(currentNode);
            break;
          }
          case 'IMG': {
            newCharCount += 2;
            break;
          }
          default: {
            throw Error('unknown element');
          }
        }
        break;
      }
      case Node.TEXT_NODE: {
        newCharCount += node.textContent.length;
      }
        // no default
    }
    return newCharCount;
  }, 0);
}

// Finds the number of charachters before a certain node in the scope of the limiter element.
function getCharsUntilNode(node, limiter) {
  if (limiter === node) {
    return 0;
  }
  return Array.from(node.parentElement.childNodes).reduce((charachters, currentNode, index) => {
    if (index >= Array.from(node.parentElement.childNodes).indexOf(node)) { return charachters; }
    const charachtersInCurrentNode = charsInNode(currentNode);
    return charachters + charachtersInCurrentNode;
  }, 0) + getCharsUntilNode(node.parentElement, limiter);
}

function getSelectionIndex(textArea, offset, node) {
  if (node !== textArea) {
    return getCharsUntilNode(node, textArea) + offset;
  }
  if (offset !== 0) {
    const children = Array.from(textArea.childNodes);
    const lastElement = children[offset - 1];
    return getCharsUntilNode(lastElement, textArea) + 2;
  }
  return 0;
}

export function getSelectionRange(textArea) {
  const globalSelection = window.getSelection();
  if ((!textArea.contains(globalSelection.anchorNode))
      || (!textArea.contains(globalSelection.focusNode))) {
    return null;
  }
  const selection = [getSelectionIndex(
    textArea,
    globalSelection.anchorOffset,
    globalSelection.anchorNode,
  ),
  getSelectionIndex(
    textArea,
    globalSelection.focusOffset,
    globalSelection.focusNode,
  )];

  const orderedSelection = { start: Math.min(...selection), end: Math.max(...selection) };
  return orderedSelection;
}

function getNodeAtChars(parent, index) {
  let baseCharachters = 0;
  let topNode = parent;
  // This runs for every level of the element tree
  while (topNode.nodeType === Node.ELEMENT_NODE && topNode.tagName !== 'IMG') {
    const children = Array.from(topNode.childNodes);
    let currentCharachter = 0;
    const target = index - baseCharachters;
    // find the node holding the index
    const nodeAtPosition = children.find((node) => {
      const newCharCount = currentCharachter + charsInNode(node);
      currentCharachter = newCharCount;
      if (newCharCount >= target) {
        return true;
      }
      return false;
    });
    topNode = nodeAtPosition;
    baseCharachters += currentCharachter - charsInNode(nodeAtPosition);
  }
  return { node: topNode, offset: index - baseCharachters };
}

export function SelectFromTo(startIndex, endIndex, textArea) {
  const globalSelection = window.getSelection();
  globalSelection.removeAllRanges();
  const newRange = new Range();
  const start = getNodeAtChars(textArea, startIndex);
  const end = getNodeAtChars(textArea, endIndex);
  if (start.node.tagName !== 'IMG') {
    newRange.setStart(start.node, start.offset);
  } else {
    newRange.setStart(textArea, Array.from(textArea.childNodes).indexOf(start.node) + 1);
  }
  if (end.node.tagName !== 'IMG') {
    newRange.setEnd(end.node, end.offset);
  } else {
    newRange.setEnd(textArea, Array.from(textArea.childNodes).indexOf(end.node) + 1);
  }
  globalSelection.addRange(newRange);
}
