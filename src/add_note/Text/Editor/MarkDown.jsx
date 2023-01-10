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

function MarkDownEditor({ note, noteChanger }) {
  const textArea = useRef();

  const [selection, setSelection] = useState(0);
  const handleSelection = () => {
    if (getSelectionIndex(textArea.current) !== null) {
      setSelection(getSelectionIndex(textArea.current));
    }
  };
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);
    return () => { document.removeEventListener('selectionchange', handleSelection); };
  });

  return (
    <div ref={textArea} contentEditable suppressContentEditableWarning id="content">
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
