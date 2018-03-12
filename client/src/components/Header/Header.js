import React, { Component } from 'react';
import { Navbar } from 'react-materialize';
import { NavLink } from "react-router-dom";
import Logo from "./logo.png";
import './Header.css';

const Img = <img src={Logo} alt={"Hotplate"} className={"logo"}/>;

class Header extends Component {
  handleLogout = (event) => {
    event.preventDefault();
    this.props.handleLogout();
  }
  render() {
    return (
      <Navbar className="Header pink lighten-5" brand={Img} right>
        <li><NavLink to="/" className="black-text">Search</NavLink></li>
        <li><NavLink to="/about" className="black-text">About</NavLink></li>
        { this.props.user ?
          <li><NavLink to="/" onClick={this.handleLogout} className="black-text">Log Out</NavLink></li> :
          <li><NavLink to="/login" className="black-text">Log In</NavLink></li> }     
      </Navbar>
    );
  }
}

export default Header;
