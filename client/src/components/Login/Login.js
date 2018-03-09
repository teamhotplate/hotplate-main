import React, { Component } from 'react';
import { Container, Row, Col } from 'react-materialize';
import { Redirect } from 'react-router-dom';

import './Login.css';

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  handleFormChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleFormSubmit = (event) => {
    event.preventDefault();
    const { username, password } = this.state;
    this.setState({
      username: "",
      password: ""
    });
    this.props.loginHandler(username, password);
  }

  render() {
    if (this.props.userToken) {
      return <Redirect to="/" />
    }
    return (
      <Container>
        <form onSubmit={this.handleFormSubmit}>
          <Row className="LoginFormInputRow">
            <Col s={12}>
              <Row>
                <Col s={6} className="input-field">
                  <input 
                    id="username"
                    name="username"
                    type="text"
                    className="validate"
                    placeholder="Username"
                    value={this.state.username}
                    onChange={this.handleFormChange}
                  />
                  <label htmlFor="username">Username</label>
                </Col>
                <Col s={6} className="input-field">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="validate"
                    placeholder="Password"
                    value={this.state.password}
                    onChange={this.handleFormChange}
                  />
                  <label htmlFor="password">Password</label>
                </Col>
              </Row>
              <Row>
                <Col s={3}>
                  <button className="btn waves-effect waves-light red darken-4" type="submit" name="action">Submit
                    <i className="material-icons right">send</i>
                  </button>
                </Col>
                <Col s={9}></Col>
              </Row>
            </Col>
          </Row>
        </form>
      </Container>
    );
  }
}

export default Login;