import React from 'react';

import PropTypes from 'prop-types';

import LinkAdder from './Link';

import './MarkDown.css';

const localText = {
  tools: {
    bold: {
      en: 'B',
      es: 'N',
    },
    italics: {
      en: 'I',
      es: 'I',
    },
  },
};

// adds enclosing to the start and the end of the selection of the given text and returns the result
function encloseAreaWith(start, end, closing, text) {
  return (`${text.slice(0, start)}${closing}${text.slice(start, end)}${closing}${text.slice(end)}`);
}

function isAreaEnclosed(start, end, text, enclosing) {
  let index = -1;
  let enclosed = false;
  while (index < start) {
    const newIndex = text.indexOf(enclosing, index);
    if (newIndex >= start || newIndex === -1) {
      if (enclosed) {
        return newIndex === -1 || newIndex >= end;
      }
      return false;
    }
    index = newIndex + 1;
    enclosed = !enclosed;
  }
  return true;
}

function removeEffectInArea(start, end, tag, text) {
  if (text.substring(start - tag.length, start) === tag
  && text.substring(end, end + tag.length) === tag) {
    return `${text.slice(0, start - tag.length)}${text.slice(start, end)}${text.slice(end + tag.length, end + tag.length + 1)}`;
  }
  let finalText = text;
  let closingStart = start;
  let closingEnd = end;
  if (text[start - 1] === ' ') {
    closingStart -= 1;
  }
  if (text[end] === ' ') {
    closingEnd += 1;
  }
  finalText = encloseAreaWith(closingStart, closingEnd, tag, text);
  return finalText;
}

export default class MarkDownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.imageAdder = React.createRef();
    this.state = {
      selectionStart: 0,
      selectionEnd: 0,
      bold: false,
      italics: false,
    };
  }

  componentDidMount() {
    document.addEventListener('selectionchange', (_event) => {
      if (document.activeElement.id === 'markdown_area') {
        this.setSelection(
          document.activeElement.selectionStart,
          document.activeElement.selectionEnd,
        );
      }
    });
  }

  setSelection = (start, end) => {
    this.setState((_prevState, props) => ({
      selectionStart: start,
      selectionEnd: end,
      bold: isAreaEnclosed(start, end, props.note.text, '**') || isAreaEnclosed(start, end, props.note.text, '***'),
      italics: (isAreaEnclosed(start, end, props.note.text, '*') && !isAreaEnclosed(start, end, props.note.text, '**')) || isAreaEnclosed(start, end, props.note.text, '***'),
    }));
  };

  setText = (e) => {
    const { noteChanger } = this.props;
    noteChanger({ text: e.target.value });
  };

  setBold = (_event) => {
    const { bold } = this.state;
    const { note, noteChanger } = this.props;
    const { selectionStart, selectionEnd } = this.state;
    if (!bold) {
      noteChanger({ text: encloseAreaWith(selectionStart, selectionEnd, '**', note.text) });
    } else {
      noteChanger({ text: removeEffectInArea(selectionStart, selectionEnd, '**', note.text) });
    }
    this.setState((prevState, _props) => ({ bold: !prevState.bold }));
  };

  setItalics = (_event) => {
    const { italics } = this.state;
    const { note, noteChanger } = this.props;
    const { selectionStart, selectionEnd } = this.state;
    if (!italics) {
      noteChanger({ text: encloseAreaWith(selectionStart, selectionEnd, '*', note.text) });
    } else {
      noteChanger({ text: removeEffectInArea(selectionStart, selectionEnd, '*', note.text) });
    }
    this.setState((prevState, _props) => ({ italics: !prevState.italics }));
  };

  addImageTrigger = () => {
    this.imageAdder.current.click();
  };

  uploadImage = (event) => {
    const { note, noteChanger } = this.props;
    Array.from(event.target.files).forEach((image) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(image);
      fileReader.onloadend = () => {
        noteChanger({ attached: [...note.attached, `![uploaded image](${fileReader.result})`] });
        noteChanger({ text: `${note.text}[attachment #${note.attached.length}]` });
      };
    });
  };

  render() {
    const { note, noteChanger, language } = this.props;
    const { bold, italics } = this.state;
    return (
      <div>
        <div>
          <label htmlFor="bold">
            <strong>{localText.tools.bold[language]}</strong>
            <input type="checkbox" id="bold" onChange={this.setBold} checked={bold} />
          </label>
          <label htmlFor="italics">
            <i>{localText.tools.italics[language]}</i>
            <input type="checkbox" id="italics" onChange={this.setItalics} checked={italics} />
          </label>
          <LinkAdder noteChanger={noteChanger} note={note} />
          <button type="button" onClick={this.addImageTrigger} aria-label="add image" id="image_add_trigger" />
          <input onChange={this.uploadImage} type="file" id="add_image" accept=".png,.jpeg,.webp,.jpg" ref={this.imageAdder} hidden />
        </div>
        <textarea id="markdown_area" value={note.text} onInput={this.setText} />
      </div>
    );
  }
}

MarkDownEditor.propTypes = {
  note: PropTypes.shape({
    text: PropTypes.string,
    attached: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  noteChanger: PropTypes.func.isRequired,
  language: PropTypes.string.isRequired,
};
