import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as rawMethods from './bbcodeMethods';
import * as renderedMethods from './renderedMethods';

import './TextEditor.css';

// the index is used as key
function addChildrenToTag(tag, children, index) {
  switch (tag) {
    case '[b]': {
      return <b key={index}>{children}</b>;
    }
    case '[i]': {
      return <i key={index}>{children}</i>;
    }
    case '[img]': {
      return <img width={80} alt="uploaded" src={children} key={index} />;
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
    if (nearestTag.index !== -1 && !nearestTag.tag.startsWith('[/')) {
      const nextTag = getChildren(string, length, rawMethods.getEnd(nearestTag.tag));
      children.push(addChildrenToTag(nearestTag.tag, nextTag.children, length));
      length = nextTag.length;
    }
  }
  return { children, endTag: nearestTag, length };
}

function fillInAttachments(text, attachments) {
  let index = 0;
  let newText = text;
  while (index !== -1 && index < text.length) {
    index = newText.indexOf('@', index + 1);
    const attachmentIndex = parseInt(newText[index + 1], 10);
    if (index !== -1 && !Number.isNaN(attachmentIndex)) {
      if (attachments[attachmentIndex] !== undefined) {
        newText = `${newText.substring(0, index)}${attachments[attachmentIndex]}${newText.substring(index + 2)}`;
      } else {
        newText = `${newText.substring(0, index - 1)}[missing attachment]${newText.substring(index + 2)}`;
      }
    }
  }
  return newText;
}

function bbcodeToHtml(bbcodeString) {
  let index = 0;
  const children = [];
  while (index < bbcodeString.length) {
    const tag = rawMethods.findNearestTag(bbcodeString, index);
    if (tag.index === -1) {
      children.push(bbcodeString.substring(index));
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
function MarkDownEditor({ note, noteChanger, editable }) {
  const textArea = useRef();

  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const handleSelection = () => {
    const newSelection = renderedMethods.getSelectionRange(textArea.current);
    if (JSON.stringify(newSelection) !== JSON.stringify(selection) || newSelection !== null) {
      setSelection(newSelection);
    }
  };
  useEffect(() => {
    document.addEventListener('selectionchange', handleSelection);
    return () => { document.removeEventListener('selectionchange', handleSelection); };
  });
  useEffect(() => {
    const indexes = renderedMethods.getSelectionRange(textArea.current);
    if (JSON.stringify(indexes) !== JSON.stringify(selection) && indexes !== null) {
      renderedMethods.SelectFromTo(selection.start, selection.start, textArea.current);
    }
  });
  const manageKey = (event) => {
    if (event.key.length === 1) {
      noteChanger({ text: `${note.text.substring(0, rawMethods.getRawIndex(note.text, selection.start))}${event.key}${note.text.substring(rawMethods.getRawIndex(note.text, selection.end))}` });
      setSelection({ start: selection.start + 1, end: selection.end + 1 });
      event.preventDefault();
    } else {
      switch (event.key) {
        case 'Backspace': {
          if (selection.end === selection.start) {
            if (selection.start !== 0) {
              noteChanger({
                text: rawMethods.removeSubstringSafe(
                  rawMethods.getRawIndex(note.text, selection.start - 1),
                  rawMethods.getRawIndex(note.text, selection.end),
                  note.text,
                ),
              });
              setSelection({ start: selection.start - 1, end: selection.start - 1 });
            }
          } else {
            noteChanger({
              text: rawMethods.removeSubstringSafe(
                rawMethods.getRawIndex(note.text, selection.start),
                rawMethods.getRawIndex(note.text, selection.end),
                note.text,
              ),
            });
          }

          event.preventDefault();
        }
        // no default
      }
    }
  };

  return (
    <div ref={textArea} contentEditable={editable} onKeyDown={manageKey} suppressContentEditableWarning id="content">
      {bbcodeToHtml(fillInAttachments(note.text, note.attachments))}
    </div>
  );
}
MarkDownEditor.defaultProps = {
  editable: false,
};

MarkDownEditor.propTypes = {
  note: PropTypes.shape({
    text: PropTypes.string,
    attachments: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  noteChanger: PropTypes.func.isRequired,
  editable: PropTypes.bool,
};

export default MarkDownEditor;
