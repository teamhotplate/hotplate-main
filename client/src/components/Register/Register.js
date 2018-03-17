import axios from 'axios';
import React, { Component } from 'react';
import { Container, Row, Col } from 'react-materialize';
import { Redirect } from 'react-router-dom';
import './Register.css';

class Register extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: ""
    };
  }

  handleFormChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleFormSubmit = async (event) => {
    event.preventDefault();
    const { username, password, email } = this.state;
    console.log(`Ready to send registration request with state: ${JSON.stringify(this.state)}`);
    this.setState({
      username: "",
      password: "",
      email: ""
    });
    const createUserUrl = "/auth/users";
    try {
      await axios.post(createUserUrl, { username: username, password: password, email: email });
      window.location = "/login";
    } catch(err) {
      console.error(err);
    }
    
  }

  render() {
    if (this.props.user) {
      return <Redirect to="/" />
    }
    return (
      <Container>
        <form onSubmit={this.handleFormSubmit}>
          <Row className="RegisterFormInputRow">
            <Col s={12}>
              <Row>
                <Col s={6} className="input-field">
                  <input 
                    id="username"
                    name="username"
                    type="text"
                    className="validate"
                    value={this.state.username}
                    onChange={this.handleFormChange}
                  />
                  <label htmlFor="username">Username</label>
                </Col>
                <Col s={6} className="input-field">
                  <input 
                    id="email"
                    name="email"
                    type="text"
                    className="validate"
                    value={this.state.email}
                    onChange={this.handleFormChange}
                  />
                  <label htmlFor="email">Email</label>
                </Col>
              </Row>
              <Row>
                <Col s={12} className="input-field">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="validate"
                    value={this.state.password}
                    onChange={this.handleFormChange}
                  />
                  <label htmlFor="password">Password</label>
                </Col>
              </Row>
              <Row>
                <Col s={3}>
                  <button className="btn waves-effect waves-light red darken-4" type="submit" name="action">Register
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

export default Register;