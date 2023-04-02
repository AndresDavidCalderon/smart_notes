import React from 'react';
import PropTypes from 'prop-types';
import * as licenses from './software';
import './About.css';

const text = {
  title: {
    en: 'Third party licenses',
    es: 'Licensias de software de terceros',
  },
};

class AboutApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      openLicense: undefined,
    };
  }

  ToggleVisibility = () => {
    this.setState((prevState) => ({
      visible: !prevState.visible,
    }));
  };

  displayLicense = (software) => {
    this.setState({
      openLicense: software,
    });
  };

  closeLicense = () => {
    this.setState({
      openLicense: undefined,
    });
  };

  render() {
    const { visible, openLicense } = this.state;
    const { language } = this.props;
    return (
      <div>
        <button type="button" id="open_about" aria-label="about smart notes" onClick={this.ToggleVisibility} />
        {
          visible ? (
            <div id="about_dialogue">
              <button type="button" id="close_about" onClick={this.ToggleVisibility}>x</button>
              <h1>{text.title[language]}</h1>
              {
                licenses.software.map((software) => <button className="software" key={software.name} onClick={() => { this.displayLicense(software); }} type="button">{software.name}</button>)
              }
            </div>
          ) : false
        }
        {
          openLicense === undefined ? false
            : (
              <div id="current_license">
                <h1>{openLicense.name}</h1>
                <p id="license_text">{licenses.licenses[openLicense.license_name].join('\n').replace('COPYRIGHT', `${openLicense.copyright}\n`)}</p>
                <button id="close_license" onClick={this.closeLicense} type="button">x</button>
              </div>
            )
        }
      </div>
    );
  }
}

AboutApp.propTypes = {
  language: PropTypes.string.isRequired,
};

export default AboutApp;
