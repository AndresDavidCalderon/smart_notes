import { useState, useEffect } from 'react';

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

function getChildren(string, index, endTag) {
  let nearestTag;
  const children = [];
  let length = index;
  while (true) {
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
      children.push(bbcodeString.substring(index));
      break;
    } else {
      children.push(bbcodeString.substring(index, tag.index));
      const newBlock = getChildren(bbcodeString, tag.index + tag.tag.length, getEnd(tag.tag));
      children.push(addChildrenToTag(tag.tag, newBlock.children, tag.index));
      index = newBlock.length;
    }
  }
  return children;
}

function MarkDownEditor({ note, noteChanger }) {
  return (
    <div contentEditable suppressContentEditableWarning id="content">
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
