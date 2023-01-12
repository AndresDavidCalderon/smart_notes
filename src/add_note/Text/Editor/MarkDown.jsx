import { useState, useEffect, useRef } from 'react';

import PropTypes from 'prop-types';

import './MarkDown.css';

const tags = ['[b]', '[/b]', '[i]', '[/i]'];

function getEnd(openTag) {
  return `[/${openTag.substring(1)}`;
}

// the index is used as key
function addChildrenToTag(tag, children, index) {
  switch (tag) {
    case '[b]': {
      return <b key={index}>{children}</b>;
    }
    case '[i]': {
      return <i key={index}>{children}</i>;
    }
    case 'none': {
      return <span key={index}>{children}</span>;
    }
    default: {
      return 'invalid tag';
    }
  }
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

function getIndexAsRendered(text, index) {
  let currentTagIndex = 0;
  let newIndex = index;
  while (currentTagIndex < index) {
    const tag = findNearestTag(text, currentTagIndex);
    if (tag.index < index) {
      currentTagIndex += tag.index + tag.tag.length;
      newIndex -= tag.tag.length;
    } else {
      break;
    }
  }
  return newIndex;
}

function getRawIndex(text, renderIndex) {
  let finalIndex = renderIndex;
  let currentIndex = 0;
  let tag;
  while (currentIndex < finalIndex) {
    tag = findNearestTag(text, currentIndex);
    currentIndex = tag.index + tag.tag.length;
    finalIndex += tag.tag.length;
  }
  return finalIndex - tag.tag.length;
}

function getChildren(string, index, endTag) {
  let nearestTag;
  const children = [];
  let length = index;
  while (length < string.length - 1 && (nearestTag === undefined || nearestTag.index !== -1)) {
    nearestTag = findNearestTag(string, length);
    // add text before next tag
    children.push(nearestTag.index === -1
      ? string.substring(length)
      : string.substring(length, nearestTag.index));

    length = nearestTag.index + nearestTag.tag.length;

    if (nearestTag.tag === endTag) {
      break;
    }

    length = nearestTag.index + nearestTag.tag.length;
    if (nearestTag.index !== -1 && nearestTag.tag.substring(0, 1) !== '[/') {
      const nextTag = getChildren(string, length, getEnd(nearestTag.tag));
      children.push(addChildrenToTag(nearestTag.tag, nextTag.children, length));
      length = nextTag.length;
    }
  }
  return { children, endTag: nearestTag, length };
}

function bbcodeToHtml(bbcodeString) {
  let index = 0;
  const children = [];
  while (index < bbcodeString.length - 1) {
    const tag = findNearestTag(bbcodeString, index);
    if (tag.index === -1) {
      children.push(bbcodeString.substring(index, tag.index));
      break;
    } else {
      children.push(bbcodeString.substring(index, tag.index));
      const newBlock = getChildren(
        bbcodeString,
        tag.index + tag.tag.length,
        getEnd(tag.tag),
      );
      children.push(addChildrenToTag(tag.tag, newBlock.children, tag.index));
      index = newBlock.length;
    }
  }
  return children;
}
function charsInNode(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent.length;
  }
  return Array.from(node.childNodes).reduce((charachters, currentNode) => {
    let newCharCount = charachters;
    switch (node.nodeType) {
      case Node.ELEMENT_NODE: {
        newCharCount += charsInNode(currentNode);
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
    return charachters + charsInNode(currentNode);
  }, 0) + getCharsUntilNode(node.parentElement, limiter);
}
function getSelectionIndex(textArea) {
  const globalSelection = window.getSelection();
  if ((!textArea.contains(globalSelection.anchorNode))
    || (!textArea.contains(globalSelection.focusNode))) {
    return null;
  }
  const selection = {
    start: getCharsUntilNode(globalSelection.anchorNode, textArea) + globalSelection.anchorOffset,

    end: getCharsUntilNode(globalSelection.focusNode, textArea) + globalSelection.focusOffset,
  };
  return selection;
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
      if (newCharCount >= target - 1) {
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
  globalSelection.collapse(textArea);
  const newRange = new Range();
  const start = getNodeAtChars(textArea, startIndex);
  const end = getNodeAtChars(textArea, endIndex);
  newRange.setStart(start.node, start.offset);
  newRange.setEnd(end.node, end.offset);
}

function MarkDownEditor({ note, noteChanger }) {
  const textArea = useRef();

  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const handleSelection = () => {
    if (getSelectionIndex(textArea.current) !== null) {
      setSelection(getSelectionIndex(textArea.current));
    }
  };
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);
    return () => { document.removeEventListener('selectionchange', handleSelection); };
  });
  const manageKey = (event) => {
    if (event.key.length === 1) {
      noteChanger({ text: `${note.text.substring(0, getRawIndex(note.text, selection.start))}${event.key}${note.text.substring(getRawIndex(note.text, selection.end))}` });
      SelectFromTo(selection.start + 1, selection.start + 1, textArea.current);
      event.preventDefault();
    }
  };

  return (
    <div ref={textArea} contentEditable onKeyDown={manageKey} suppressContentEditableWarning id="content">
      {bbcodeToHtml(note.text)}
    </div>
  );
}

MarkDownEditor.propTypes = {
  note: PropTypes.shape({
    text: PropTypes.string,
  }).isRequired,
  noteChanger: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};

export default MarkDownEditor;
