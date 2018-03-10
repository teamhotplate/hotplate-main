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
<<<<<<< HEAD
      <Navbar className="Header red lighten-5" brand={Img} right>
        <li><NavLink to="" className="black-text">About</NavLink></li>
        <li><NavLink to="login" className="black-text">Log In</NavLink></li>
=======
      <Navbar className="Header red darken-4" brand='Hotplate' right>
        <li><NavLink to="">About</NavLink></li>
        { this.props.userToken ?
           <li><NavLink to="/" onClick={this.handleLogout}>Log Out</NavLink></li> :
           <li><NavLink to="login">Log In</NavLink></li> }     
>>>>>>> 2d4f8e8d700ae5c7fd353c2dbaaa3cb5b87340b0
      </Navbar>
    );
  }
}

export default Header;
