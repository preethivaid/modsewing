import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';
import './App.css';
import history from './history';
import logoImage from './images/logo.png';
import { absMovePen,
         drawAbsLine,
         drawRelLine
       } from './svgHelpers/drawing'

import {createPathElement,
        centerAndScalePath} from './svgHelpers/elements'

class GeneratePage extends Component {

  preethi_fn = () => {
    let pathString = "";
    pathString = 'M 2 4 l 5 0 l 0 5 l -5 0 l 0 -5'
    let pathElement = createPathElement('id', pathString)
    pathElement = centerAndScalePath(pathElement, pathString);
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
          {this.preethi_fn() }
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
