function charsInNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent.length;
  }
  if (node.tagName === 'IMG') {
    return 1;
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
            newCharCount += 1;
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

function getSelectionIndex(textArea) {
  const globalSelection = window.getSelection();
  if ((!textArea.contains(globalSelection.anchorNode))
      || (!textArea.contains(globalSelection.focusNode))) {
    return null;
  }
  let selection = {};
  if (globalSelection.anchorNode !== textArea) {
    selection = {
      start: getCharsUntilNode(globalSelection.anchorNode, textArea) + globalSelection.anchorOffset,

      end: getCharsUntilNode(globalSelection.focusNode, textArea) + globalSelection.focusOffset,
    };
  } else {
    const children = Array.from(textArea.childNodes);
    const lastElement = children[globalSelection.focusOffset - 1];
    selection.start = getCharsUntilNode(lastElement, textArea) + 1;
    selection.end = selection.start;
  }
  const orderedSelection = { ...selection };
  if (selection.end < selection.start) {
    orderedSelection.start = selection.end;
    orderedSelection.end = selection.start;
  }
  return orderedSelection;
}

function getNodeAtChars(parent, index) {
  let baseCharachters = 0;
  let topNode = parent;
  // This runs for every level of the element tree
  while (topNode.nodeType === Node.ELEMENT_NODE) {
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

function SelectFromTo(startIndex, endIndex, textArea) {
  const globalSelection = window.getSelection();
  globalSelection.removeAllRanges();
  const newRange = new Range();
  const start = getNodeAtChars(textArea, startIndex);
  const end = getNodeAtChars(textArea, endIndex);
  newRange.setStart(start.node, start.offset);
  newRange.setEnd(end.node, end.offset);
  globalSelection.addRange(newRange);
}

export default {
  charsInNode,
  getCharsUntilNode,
  getSelectionIndex,
  getNodeAtChars,
  SelectFromTo,
};
