import React, { Component } from 'react';
import { Container, Row, Col, Card, CardTitle } from 'react-materialize';

import './About.css';
import aboutImg from './About.jpg';

import '../../css/full-width.css';

class About extends Component {
  render() {
    return (
      <div className="about-theme full-width-bar">
        <Row>
          <Col s={12}>
            <span className="white-text">
              <h2 style={{marginTop:15.00}}>Build wonderful things</h2>
              <div className="text-size-default">
                hotplate is a platform for building customizable and reusable template code. Find a template, and use it in your project.
              </div>
            </span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default About;