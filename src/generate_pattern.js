import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import history from './history';
import logoImage from './images/logo.png';
import { absMovePen,
         addAbsLine,
       } from './svgHelpers/pathHelpers.jsx'

import {createPathElement} from './svgHelpers/elementHelpers.jsx'
import {STANDARD_MEASUREMENTS} from './constants.js'
import _ from 'lodash';

class GeneratePage extends Component {

  generate_sloper = (selected_size) => {
    console.log(selected_size)
    const measurments = _.find(STANDARD_MEASUREMENTS, {size: selected_size});
    console.log("standard measurements")
    console.log(measurments)
    let pathString = "";
    pathString = absMovePen(pathString, {x: 5, y: 12})
    pathString = addAbsLine(pathString, {x: 10, y: 3})
    pathString = addAbsLine(pathString, {x: 53, y: 63})
    pathString = addAbsLine(pathString, {x: 2, y: 69})
    pathString = addAbsLine(pathString, {x: 66, y: 9})
    let pathElement = createPathElement('id', pathString)
    return pathElement
  }

  render () {
    return (
      <div className="GeneratePage">
        <div className="LogoPanel">
          <img className="LogoImage" src={logoImage} alt="Modsewing"/>
        </div>
        <div className="ContentPanelPattern">
          <div className="PatternPreview">

          <svg>
          {this.generate_sloper(this.props.size) }
          </svg>



          </div>
          <div className="PrintButtonPanel">
            <PrintButton size={this.props.size}/>
          </div>
        </div>
      </div>
    )
  }
}
export default GeneratePage;


class PrintButton extends Component {
  PrintButtonClicked = (event) => {
    console.log("print button clicked")
  }

  render () {
    return (
      <div className="CuteButton PrintButton" onClick={this.PrintButtonClicked}> 
          Print Pattern
      </div>
    )
  }
}
