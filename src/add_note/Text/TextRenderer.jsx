import { forwardRef } from 'react';
import PropTypes from 'prop-types';
import * as rawMethods from './bbcodeMethods';
import './TextRenderer.css';

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

const TextRenderer = forwardRef(({
  note, editable, inputManager,
}, ref) => (
  <div
    ref={ref}
    contentEditable={editable}
    onInput={inputManager}
    suppressContentEditableWarning
    // This is due to the input method not being cancellable, adding children makes text duplicate.
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML={{
      __html: bbcodeToHtml(fillInAttachments(note.text, note.attachments)),
    }}
    id="content"
  />
));
TextRenderer.defaultProps = {
  inputManager: () => undefined,
};

TextRenderer.propTypes = {
  note: PropTypes.shape({
    text: PropTypes.string,
    attachments: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  editable: PropTypes.bool.isRequired,
  inputManager: PropTypes.func,
};

TextRenderer.displayName = 'TextRenderer';

export default TextRenderer;
