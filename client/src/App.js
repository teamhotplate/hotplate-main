import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";

import About from './components/About';
import Header from './components/Header';
import Login from './components/Login';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Header />
            <Route exact path="/" component={About} />
            <Route exact path="/login" component={Login} />
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
