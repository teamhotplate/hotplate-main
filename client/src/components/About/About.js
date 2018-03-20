import React, { Component } from 'react';
import { Container, Row, Col } from 'react-materialize';

import CodeIcon from "./code-icon.png";
import './About.css';
// import aboutImg from './About.jpg';

import '../../css/full-width.css';

class About extends Component {
  render() {
    return (
      <div className="full-width-bar">
        <Row>
          <Col s={8}>
            <div className="white-text about-theme-light full-width-bar">
              <h2 style={{marginTop:0.00}}>Create wonderful things</h2>
              <div className="text-size-default container-size">
                hotplate is a platform for building customizable and reusable template code. Find a template, and use it in your project.
              </div>
            </div>
          </Col>
        </Row>
        <div className="white-text about-theme-dark full-width-bar">
          <Row>
            <Col s={4}>
              <div>
                <img src={CodeIcon} alt="code-icon" height="200px" style={{marginTop:25.00}}/>
              </div>
            </Col>
            <Col s={8}>
                <h2>Hotplate, What's Cooking?</h2>
                <div className="text-size-default" style={{marginBottom:20.00}}>
                Cook up your own projects using Hotplate. Building a new website? Just search a template, personalize it, download and customize it to your liking.
                </div>
            </Col>
          </Row>
        </div>
      </div>
      
    );
  }
}

export default About;