import React, { Component } from 'react';
import { Navbar } from 'react-materialize';
import { NavLink } from "react-router-dom";

import './Header.css';

class Header extends Component {
  handleLogout = (event) => {
    event.preventDefault();
    this.props.handleLogout();
  }
  render() {
    return (
      <Navbar className="Header red darken-4" brand='Hotplate' right>
        <li><NavLink to="">About</NavLink></li>
        { this.props.userToken ?
           <li><NavLink to="/" onClick={this.handleLogout}>Log Out</NavLink></li> :
           <li><NavLink to="login">Log In</NavLink></li> }     
      </Navbar>
    );
  }
}

export default Header;
