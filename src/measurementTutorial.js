import React, { Component } from 'react';
import _ from 'lodash';
import { get_measurements } from 'constants.js';
import { isPositiveValidNumber,
        brokePattern } from 'measurementHelpers.js';
import { front,
        back } from 'slopers/bodice.js'

class TutorialPage extends Component {

  state = {
      measurementIndex: 0,
      measurements: get_measurements({use_defaults: true}),
      testMeasurements: get_measurements({}),
      measurementError: '',
      displayText: '1'
  }

  updateMeasurement = (value) => {
    let newMeasurement = this.state.measurements;
    newMeasurement[this.state.measurementIndex].measurement = parseFloat(value);
    this.setState({measurements: newMeasurement});
  }

  updateTestMeasurement = (value) => {
    let newMeasurement = this.state.testMeasurements;
    newMeasurement[this.state.measurementIndex].measurement = parseFloat(value);
    this.setState({testMeasurements: newMeasurement});
  }

  advanceTutorial = () => {
    let newMeasurementIndex = this.state.measurementIndex + 1;
    let newMeasurement = this.state.measurements;
    this.setState({measurementIndex: newMeasurementIndex,
                  displayText: `${this.state.measurements[newMeasurementIndex].measurement} inches`
                });
  }

  handleChange = (event) => {
    this.setState({displayText: event.currentTarget.value});
  }

  handleFocus = () => {
    this.setState({displayText: ''});
    console.log(this.getCurrentMeasurement().friendlyName)
          console.log(this.getCurrentMeasurement().measurement)
  }

  handleNextClick = () => {
    let input = this.state.displayText.replace(" inches", "")
    if (!isPositiveValidNumber(input)) {
      this.setState({measurementError: 'Make sure you enter a valid measurement in inches!'});
    } else {
        this.setState({measurementError: ''});
        const oldTestMeasurement = this.state.testMeasurements[this.state.measurementIndex].measurement
        this.updateTestMeasurement(input);
        if (brokePattern(this.state.testMeasurements)) {
          this.updateTestMeasurement(oldTestMeasurement);
          this.setState({measurementError: 'Hm, something went wrong with this measurement! Sorry, I\'m still working on making this site work... but feel free to email easysloper@gmail.com with suggestions!!'});
        } else {
          this.updateMeasurement(input);
          this.advanceTutorial();
        }
      }
    }

  handleBackClick = () => {
    let newMeasurementIndex = this.state.measurementIndex - 1;
    this.setState({measurementIndex: newMeasurementIndex,
                  displayText: `${this.state.measurements[newMeasurementIndex].measurement} inches`,
                  measurementError: ''})
  }

  showFinishButton = () => {
    return this.state.measurementIndex === this.state.measurements.length - 1;
  }

  showBackButton = () => {
    return this.state.measurementIndex !== 0;
  }

  generatePattern = (event) => {
    this.props.history.replace('/generatePattern')
  }

  getCurrentMeasurement = () => {
    return this.state.measurements[this.state.measurementIndex]
  }

  render () {
    return (
      <div className="TutorialPage">
        <div className="TutorialPanel">
          <div className="DescriptionPanel">
            { this.state.measurementIndex > 0 && <div className="DescriptionTitle"> { this.getCurrentMeasurement().friendlyName } ({this.state.measurementIndex} / {this.state.measurements.length - 1})</div> }
            <div className="DescriptionText">
              { this.getCurrentMeasurement().helpText }
            </div>
            <div className="InputPanel">
              { this.state.measurementIndex > 0 && <input
                className="MeasurementInput"
                onFocus={this.handleFocus}
                onChange={this.handleChange}
                type="text"
                name="value"
                value= {this.state.displayText}
              /> }
              { this.showBackButton() && <div className="CuteButton BackBtn" onClick={ this.handleBackClick }>&#8592;</div> }
              { !this.showFinishButton() && <div className="CuteButton NextBtn" onClick={ this.handleNextClick }>&#8594;</div> }
              { this.showFinishButton() && <div className="CuteButton FinishBtn" onClick={ this.generatePattern }>&#x2714;</div> }
            </div>
            <div className="ErrorPanel">
            { this.state.measurementError }
            </div>
          </div>
          <img className="MeasurementImage" src={ this.getCurrentMeasurement().image } alt="instruction"/>
          </div>
      </div>
    )
  }
}
export default TutorialPage;