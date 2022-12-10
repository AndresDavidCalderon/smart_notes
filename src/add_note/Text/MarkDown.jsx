import React from 'react';

import PropTypes from 'prop-types';

// adds enclosing to the start and the end of the selection of the given text and returns the result
function encloseAreaWith(start, end, closing, text) {
  return (`${text.slice(0, start)}${closing}${text.slice(start, end)}${closing}${text.slice(end)}`);
}

function isPointEnclosed(point, text, enclosing) {
  let index = 0;
  let enclosed = true;
  while (index < point) {
    index = text.indexOf(enclosing, index);
    index += 1;
    enclosed = !enclosed;
    if (index === 0) {
      break;
    }
  }
  return enclosed;
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
      bold: isPointEnclosed(start, props.note.text, '**'),
      italics: isPointEnclosed(start, props.note.text, '__'),
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
