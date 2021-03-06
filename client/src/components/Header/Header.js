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
      <Navbar className="Header" brand={Img} right>
        { this.props.user ? <li><NavLink to="/create">Create</NavLink></li> : "" }
        <li><NavLink to="/">Search</NavLink></li>
        { this.props.user ?
          <li><NavLink to="/" onClick={this.handleLogout}>Log Out</NavLink></li> :
          <li><NavLink to="/login">Log In</NavLink></li> }
      </Navbar>
    );
  }
}

export default Header;
