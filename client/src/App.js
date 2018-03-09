import axios from 'axios';
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
      isLoggedIn: false
    };
  }

  handleLogin = async (username, password) => {
    console.log(`In App.handleLogin(). Username: ${username} Password: ${password}`);
    try {
      const loginResponse = await axios.post('/auth/login', { username, password });
      console.log(`Login result: ${JSON.stringify(loginResponse)}`);
      const loginResult = loginResponse.data.result;
      if (loginResult === 'success') {
        console.log("Login succeeded.");
      }
    } catch(error) {
      console.error(error);
    }
  }

  render() {

    return (
      <div className="App">
        <Router>
          <div>
            <Header />
            <Route exact path="/" component={About} />
            <Route exact path="/login" render={props => <Login loginHandler={this.handleLogin} {...props} />} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
