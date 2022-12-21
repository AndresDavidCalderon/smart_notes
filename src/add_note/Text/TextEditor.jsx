import React from 'react';
import PropTypes from 'prop-types';

import MarkDownEditor from './Editor/MarkDown';
import MarkDownRender from './MarkDownRender';

export default class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isMarkdown: true,
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
            <input type="radio" id="markdown" name="text-mode" onChange={() => { this.onMarkdown(!isMarkdown); }} required checked={isMarkdown} value="0" />
          </label>
          <label htmlFor="preview" name="text-mode">
            preview
            <input type="radio" id="preview" name="text-mode" onChange={() => { this.onMarkdown(!isMarkdown); }} checked={!isMarkdown} value="0" />
          </label>
        </div>

        {isMarkdown ? <MarkDownEditor noteChanger={noteChanger} note={note} />
          : <MarkDownRender text={note.text} attached={note.attached} />}

      </div>
    );
  }
}

TextEditor.propTypes = {
  noteChanger: PropTypes.func.isRequired,
  note: PropTypes.shape({
    text: PropTypes.string,
    attached: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
