import React from 'react';
import PropTypes from 'prop-types';

import MarkDownEditor from './Editor/MarkDown';
import MarkDownRender from './MarkDownRender';

const text = {
  preview: {
    en: 'preview',
    es: 'vista previa',
  },
};

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
    const { note, noteChanger, language } = this.props;
    const { isMarkdown } = this.state;
    return (
      <div>
        <div>
          <label htmlFor="markdown">
            markdown
            <input type="radio" id="markdown" name="text-mode" onChange={() => { this.onMarkdown(!isMarkdown); }} required checked={isMarkdown} value="0" />
          </label>
          <label htmlFor="preview" name="text-mode">
            {text.preview[language]}
            <input type="radio" id="preview" name="text-mode" onChange={() => { this.onMarkdown(!isMarkdown); }} checked={!isMarkdown} value="0" />
          </label>
        </div>

        {isMarkdown ? <MarkDownEditor noteChanger={noteChanger} note={note} language={language} />
          : (
            <MarkDownRender
              text={note.text}
              attached={note.attached}
              placeholders={note.placeholders}
            />
          )}

      </div>
    );
  }
}

TextEditor.propTypes = {
  noteChanger: PropTypes.func.isRequired,
  note: PropTypes.shape({
    text: PropTypes.string,
    attached: PropTypes.arrayOf(PropTypes.string),
    placeholders: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
  language: PropTypes.string.isRequired,
};
