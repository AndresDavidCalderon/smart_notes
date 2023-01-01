import React from 'react';

import PropTypes from 'prop-types';

import './Link.css';

class LinkAdder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addingLink: false,
      linkAdress: '',
      linkText: '',
    };
  }

  toggleLink = () => {
    this.setState((prevState) => ({ addingLink: !prevState.addingLink }));
  };

  setLinkText = (event) => {
    this.setState({ linkText: event.target.value });
  };

  setLinkAdress = (event) => {
    this.setState({ linkAdress: event.target.value });
  };

  addLink = () => {
    const { note, noteChanger } = this.props;
    const { linkAdress, linkText } = this.state;
    const newPlaceholders = { ...note.placeholders };
    newPlaceholders[linkText] = `<a href=${linkAdress} target="_blank">${linkText}</a>`;
    noteChanger({ text: `[${linkText}]`, placeholders: newPlaceholders });
    this.setState({ addingLink: false });
  };

  render() {
    const { linkAdress, linkText, addingLink } = this.state;
    return (
      <div id="add_link">
        <button type="button" onClick={this.toggleLink}>
          add link
        </button>

        <div id="link_dialogue" hidden={!addingLink}>
          <textarea placeholder="Link adress" onChange={this.setLinkAdress} value={linkAdress} />
          <textarea placeholder="visible text" onChange={this.setLinkText} value={linkText} />
          <button id="link_done" type="button" aria-label="add link" onClick={this.addLink} />
        </div>
      </div>
    );
  }
}

LinkAdder.propTypes = {
  note: PropTypes.shape({
    text: PropTypes.string,
    attached: PropTypes.arrayOf(PropTypes.string),
    placeholders: PropTypes.objectOf(PropTypes.string),
  }).isRequired,
  noteChanger: PropTypes.func.isRequired,
};

export default LinkAdder;
