import React, { Component } from 'react';
import { Container, Row, Col } from 'react-materialize';

import './Login.css';

class Login extends Component {
  render() {
    return (
      <Container>
        <Row className="LoginFormInputRow">
          <Col s={12}>
            <Row>
              <Col s={6} className="input-field">
                <input placeholder="Username" id="username" type="text" className="validate" />
                <label htmlFor="username">Username</label>
              </Col>
              <Col s={6} className="input-field">
                <input placeholder="Password" id="password" type="text" className="validate" />
                <label htmlFor="username">Password</label>
              </Col>
            </Row>
            <Row>
              <Col s={3}>
                <button className="btn waves-effect waves-light blue lighten-1" type="submit" name="action">Submit
                  <i className="material-icons right">send</i>
                </button>
              </Col>
              <Col s={9}></Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Login;