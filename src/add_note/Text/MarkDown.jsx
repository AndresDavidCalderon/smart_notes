import React from 'react';

import PropTypes from 'prop-types';

import './MarkDown.css';

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

export default class MarkDownEditor extends React.Component {
  constructor(props) {
    super(props);
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
    if (!bold) {
      const { note, noteChanger } = this.props;
      const { selectionStart, selectionEnd } = this.state;
      noteChanger({ text: encloseAreaWith(selectionStart, selectionEnd, '**', note.text) });
    }
    this.setState((prevState, _props) => ({ bold: !prevState.bold }));
  };

  setItalics = (_event) => {
    const { italics } = this.state;
    if (!italics) {
      const { note, noteChanger } = this.props;
      const { selectionStart, selectionEnd } = this.state;
      noteChanger({ text: encloseAreaWith(selectionStart, selectionEnd, '__', note.text) });
    }
    this.setState((prevState, _props) => ({ italics: !prevState.italics }));
  };

  render() {
    const { note } = this.props;
    const { bold, italics } = this.state;
    return (
      <div>
        <div>
          <label htmlFor="bold">
            <strong>B</strong>
            <input type="checkbox" id="bold" onInput={this.setBold} checked={bold} />
          </label>
          <label htmlFor="italics">
            <i>I</i>
            <input type="checkbox" id="italics" onInput={this.setItalics} checked={italics} />
          </label>
        </div>
        <textarea id="markdown_area" value={note.text} onInput={this.setText} />
      </div>
    );
  }
}

MarkDownEditor.propTypes = {
  note: PropTypes.shape({ text: PropTypes.string }).isRequired,
  noteChanger: PropTypes.func.isRequired,
};
