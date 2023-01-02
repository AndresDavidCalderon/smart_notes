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
    newPlaceholders[linkText] = `<a href="${linkAdress}" target="_blank">${linkText}</a>`;
    noteChanger({ text: `${note.text}[${linkText}]`, placeholders: newPlaceholders });
    this.setState({ addingLink: false, linkText: '', linkAdress: '' });
  };

  cancelLink = () => {
    this.setState({
      linkAdress: '',
      linkText: '',
      addingLink: false,
    });
  };

  render() {
    const { linkAdress, linkText, addingLink } = this.state;
    return (
      <div id="add_link">
        <button id="add_link_opener" aria-label="add_link" type="button" onClick={this.toggleLink} />

        <div id="link_dialogue" hidden={!addingLink}>
          <textarea placeholder="Link adress" onChange={this.setLinkAdress} value={linkAdress} />
          <textarea placeholder="visible text" onChange={this.setLinkText} value={linkText} />
          <div id="close_link_options">
            <button id="link_done" type="button" aria-label="add link" onClick={this.addLink} />
            <button id="cancel_link" type="button" aria-label="cancel link" onClick={this.cancelLink} />
          </div>
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
