import React, { Component } from 'react';
import { Navbar } from 'react-materialize';
import { NavLink } from "react-router-dom";
import Logo from "./logo-white.png";
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
      <Navbar className="Header header" brand={Img} right>
        { this.props.user ? <li><NavLink to="/create">Create</NavLink></li> : "" }
=======
      <Navbar className="Header" brand={Img} right>
>>>>>>> 92041ab2cd7a15023397ed612143cdd7b1e5f42b
        <li><NavLink to="/">Search</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        { this.props.user ?
          <li><NavLink to="/" onClick={this.handleLogout}>Log Out</NavLink></li> :
          <li><NavLink to="/login">Log In</NavLink></li> }     
      </Navbar>
    );
  }
}

export default Header;
