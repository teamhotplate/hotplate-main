import axios from 'axios';
import jwtDecode from 'jwt-decode';

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import About from './components/About';
import Header from './components/Header';
import Login from './components/Login';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userToken: null
    };
  }

  handleLogin = async (username, password) => {
    console.log(`In App.handleLogin(). Username: ${username} Password: ${password}`);
    try {
      const loginResponse = await axios.post('/auth/login', { username, password });
      const jwt = loginResponse.data.jwt;
      console.log(`Login succeeded. Storing JWT: ${JSON.stringify(jwtDecode(jwt))}`);
      this.setState({ userToken: jwt });
    } catch(error) {
      this.setState({ userToken: false });
      console.error(error);
    }
  }

  handleLogout = () => {
    this.setState({ userToken: null });
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Header userToken={this.state.userToken} handleLogout={this.handleLogout}/>
            <Route exact path="/" render={props => <About userToken={this.state.userToken} {...props}/>} />
            <Route exact path="/login" render={props => <Login loginHandler={this.handleLogin} userToken={this.state.userToken} {...props} />} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
