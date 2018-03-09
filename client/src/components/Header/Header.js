import React, { Component } from 'react';
import { Navbar } from 'react-materialize';
import { NavLink } from "react-router-dom";

import './Header.css';

class Header extends Component {
  render() {
    return (
      <Navbar className="Header red darken-4" brand='Hotplate' right>
        <li><NavLink to="">About</NavLink></li>
        <li><NavLink to="login">Log In</NavLink></li>
      </Navbar>
    );
  }
}

export default Header;
