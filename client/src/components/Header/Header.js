import React, { Component } from 'react';
import { Navbar } from 'react-materialize';
import { NavLink } from "react-router-dom";
import Logo from "./logo.png";
import './Header.css';

const Img = <img src={Logo} alt={"Hotplate"} className={"logo"}/>;

class Header extends Component {
  render() {
    return (
      <Navbar className="Header red lighten-5" brand={Img} right>
        <li><NavLink to="" className="black-text">About</NavLink></li>
        <li><NavLink to="login" className="black-text">Log In</NavLink></li>
      </Navbar>
    );
  }
}

export default Header;
