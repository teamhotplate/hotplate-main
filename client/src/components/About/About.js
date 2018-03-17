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
<<<<<<< HEAD
              <h2 style={{marginTop:0.00}}>Build wonderful things</h2>
=======
              <h2 style={{marginTop:15.00}}>Build wonderful things</h2>
>>>>>>> 92041ab2cd7a15023397ed612143cdd7b1e5f42b
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