import React, { Component } from 'react';
import { Row, Col } from 'react-materialize';
import { Link } from "react-router-dom";

import CodeIcon from "./code-icon.png";
import './About.css';
// import aboutImg from './About.jpg';

import '../../css/full-width.css';

class About extends Component {
  render() {
    return (
      <div>
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
                <img src={CodeIcon} alt="code-icon" height="200px" style={{marginTop:35.00}}/>
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
        <div className="white-text about-theme-light full-width-bar text-center">
          <Row>
            <Col s={3} />
            <Col s={6}>
              <h2 className="center-align">Create your own template!</h2>
            </Col>
          </Row>
          <Row>
            <Col s={5} />
            <Col s={2}>
              <Link to="/register">
                <button className="btn waves-effect waves-light" id="signup-button" name="action" href="/login">
                  Sign up
                </button>
              </Link>
            </Col>
            <Col s={5} />
          </Row>
          <Row>
            <Col s={2} />
            <Col s={8}>
              <div className="text-size-default center-align">
                Add your own templates to hotplate.<br />
                Why change what works? Keep that code around!<br />
                Don't start over. Load up a save!
              </div>
            </Col>
          </Row>
        </div>
      </div>
      
    );
  }
}

export default About;