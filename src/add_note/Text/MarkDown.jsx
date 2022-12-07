import React from 'react';

import PropTypes from 'prop-types';

export default class MarkDownEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectionStart: 0,
      selectionEnd: 0,
    };
  }

  componentDidMount() {
    document.addEventListener('selectionchange', (event) => {
      
    });
  }

  setText = (e) => {
    const { noteChanger } = this.props;
    noteChanger({ text: e.target.value });
  };

  setBold = () => {
    const { note } = this.props;
    const { selectionStart, selectionEnd } = this.state;
    note.text = `${note.text.slice(0, selectionStart - 1)}**${note.text.slice(selectionStart, selectionEnd)}**${note.text.slice(selectionEnd + 1)}`;
  };

  render() {
    const { note } = this.props;
    return (
      <div>
        <div>
          <label htmlFor="bold">
            <strong>B</strong>
            <input type="checkbox" id="bold" onInput={this.setBold} />
          </label>
          <label htmlFor="italics">
            <i>I</i>
            <input type="checkbox" id="italics" onInput={this.setBold} />
          </label>
        </div>
        <textarea value={note.text} onInput={this.setText} />
      </div>
    );
  }
}

MarkDownEditor.propTypes = {
  note: PropTypes.shape({ text: PropTypes.string }).isRequired,
  noteChanger: PropTypes.func.isRequired,
};
