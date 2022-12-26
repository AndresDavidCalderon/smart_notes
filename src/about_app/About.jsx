import React from 'react';
import * as licenses from './software.json';
import './About.css';

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
    return (
      <div>
        <button type="button" id="open_about" aria-label="about smart notes" onClick={this.ToggleVisibility} />
        {
          visible ? (
            <div id="about_dialogue">
              <button type="button" id="close_about" onClick={this.ToggleVisibility}>x</button>
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

export default AboutApp;
