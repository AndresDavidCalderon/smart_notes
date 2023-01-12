import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import rawMethods from './bbcodeMethods';
import renderedMethods from './renderedMethods';

import './MarkDown.css';

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

function getChildren(string, index, endTag) {
  let nearestTag;
  const children = [];
  let length = index;
  while (length < string.length - 1 && (nearestTag === undefined || nearestTag.index !== -1)) {
    nearestTag = rawMethods.findNearestTag(string, length);
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
      const nextTag = getChildren(string, length, rawMethods.getEnd(nearestTag.tag));
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
    const tag = rawMethods.findNearestTag(bbcodeString, index);
    if (tag.index === -1) {
      children.push(bbcodeString.substring(index, tag.index));
      break;
    } else {
      children.push(bbcodeString.substring(index, tag.index));
      const newBlock = getChildren(
        bbcodeString,
        tag.index + tag.tag.length,
        rawMethods.getEnd(tag.tag),
      );
      children.push(addChildrenToTag(tag.tag, newBlock.children, tag.index));
      index = newBlock.length;
    }
  }
  return children;
}

// safe means it preserves bbcode tags, it only deletes them if they end up empty

function removeSubstringSafe(from, to, string) {

}

function MarkDownEditor({ note, noteChanger }) {
  const textArea = useRef();

  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const handleSelection = () => {
    if (renderedMethods.getSelectionIndex(textArea.current) !== null) {
      setSelection(renderedMethods.getSelectionIndex(textArea.current));
    }
  };
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);
    return () => { document.removeEventListener('selectionchange', handleSelection); };
  });
  useEffect(() => {
    renderedMethods.SelectFromTo(selection.start, selection.start, textArea.current);
  });
  const manageKey = (event) => {
    if (event.key.length === 1) {
      noteChanger({ text: `${note.text.substring(0, rawMethods.getRawIndex(note.text, selection.start))}${event.key}${note.text.substring(rawMethods.getRawIndex(note.text, selection.end))}` });
      setSelection({ start: selection.start + 1, end: selection.end + 1 });
      event.preventDefault();
    } else {
      switch (event.key) {
        case 'Backspace': {
          noteChanger({ text: `${note.text.substring(0, rawMethods.getRawIndex(note.text, selection.start - 1))}${note.text.substring(rawMethods.getRawIndex(note.text, selection.end))}` });
          setSelection({ start: selection.start - 1, end: selection.start - 1 });
          event.preventDefault();
        }
        // no default
      }
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
