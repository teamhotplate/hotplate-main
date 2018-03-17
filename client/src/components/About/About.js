import React, { Component } from 'react';
import { Container, Row, Col, Card, CardTitle } from 'react-materialize';

import './About.css';
import aboutImg from './About.jpg';

import '../../css/full-width.css';

class About extends Component {
  render() {
    return (
      <div className="gradient-animated gradient full-width-bar">
        <Row>
          <Col s={12}>
            <span className="white-text">
              <h4>Hotplate will forever change the landscape of template generation.</h4>
              <h5>Hey! Hey! Hey!


              </h5>
            </span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default About;