import axios from 'axios';
import jwtDecode from 'jwt-decode';

import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import About from './components/About';
import CreateProjectPage from './components/CreateProjectPage';
import Header from './components/Header';
import Login from './components/Login';
import Project from './components/Project';
import SearchPage from './components/SearchPage';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  componentDidMount() {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      console.log(`Restoring saved user: ${savedUser}`);
      this.setState({ user: JSON.parse(savedUser) });
    }
  }

  handleLogin = async (username, password) => {
    console.log(`In App.handleLogin(). Username: ${username} Password: ${password}`);
    try {
      const loginResponse = await axios.post('/auth/login', { username, password });
      const jwt = jwtDecode(loginResponse.data.jwt);
      console.log(`Login succeeded. Received JWT ${JSON.stringify(jwt)} in body. Extracted _id ${jwt.user._id} and username ${jwt.user.username} from JWT and saved to app state. JWT will be available as an httponly cookie.`);
      this.setState({ user: { id: jwt.user._id, name: jwt.user.username }});
      localStorage.setItem("user", JSON.stringify(this.state.user));
    } catch(error) {
      this.setState({ user: null });
      console.error(error);
    }
  }

  handleLogout = async () => {
    console.log("Logging out.");
    await axios.post('/auth/logout', {});
    localStorage.removeItem("user");
    this.setState({ user: null });
    window.location = "/";
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Header user={this.state.user} handleLogout={this.handleLogout}/>
            <Route exact path="/" render={props => <SearchPage {...props}/>} />
            <Route exact path="/about" render={props => <About {...props}/>} />
            <Route exact path="/login" render={props => <Login loginHandler={this.handleLogin} user={this.state.user} {...props} />} />
            <Route exact path="/newproject" render={props => <CreateProjectPage user={this.state.user} {...props} />} />
            <Route path="/p/:projectName" render={props => <Project user={this.state.user} {...props} />} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
