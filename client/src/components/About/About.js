import React, { Component } from 'react';
import { Container, Row, Col, Card, CardTitle } from 'react-materialize';

import './About.css';
import aboutImg from './About.jpg';

class About extends Component {
  render() {
    return (
      <Container>
        <Row>
          <Col s={12}>
            <Card className="red darken-4" header={<CardTitle image={aboutImg}>Hotplate</CardTitle>}>
              <span>Hotplate will forever change the landscape of template generation.</span>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default About;