import React from 'react';

import PropTypes from 'prop-types';
import MarkDownEditor from './MarkDown';

export default class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMarkdown: 'markdown',
    };
  }

  onMarkdown = (enabled) => {
    this.setState({ isMarkdown: enabled });
  };

  render() {
    const { note, noteChanger } = this.props;
    const { isMarkdown } = this.state;
    return (
      <div>
        <div>
          <label htmlFor="markdown">
            markdown

            <input type="radio" id="markdown" name="text-mode" onInput={() => { this.onMarkdown(true); }} required />
          </label>
          <label htmlFor="preview" name="text-mode">
            preview

            <input type="radio" id="preview" name="text-mode" onInput={() => { this.onMarkdown(false); }} />
          </label>
        </div>

        {isMarkdown ? <MarkDownEditor noteChanger={noteChanger} note={note} /> : false}

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
