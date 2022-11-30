import React from 'react';

import PropTypes from 'prop-types';

export default class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMarkdown: 'markdown',
    };
  }

  onNoteTextChanged = (event) => {
    const { noteChanger } = this.props;
    noteChanger({ text: event.target.value });
  };

  onMarkdown = () => {
    this.setState({ isMarkdown: true });
  };

  onPreview = () => {
    this.setState({ isMarkdown: false });
  };

  render() {
    const { note } = this.props;
    const { isMarkdown } = this.state;
    return (
      <div>
        <div>
          <label htmlFor="markdown">
            markdown

            <input type="radio" id="markdown" name="text-mode" onInput={this.onMarkdown} value={isMarkdown} checked required />
          </label>
          <label htmlFor="preview" name="text-mode">
            preview

            <input type="radio" id="preview" name="text-mode" onInput={this.onPreview} value={!isMarkdown} />
          </label>
        </div>

        {isMarkdown ? <textarea onChange={this.onNoteTextChanged} value={note.text} id="note_edit" /> : false}

      </div>
    );
  }
}

TextEditor.propTypes = {
  noteChanger: PropTypes.func.isRequired,
  note: PropTypes.shape({
    text: PropTypes.string,
  }).isRequired,
};
