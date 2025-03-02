import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggleMenu = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  }

  render() {
    return (
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <h1>Cafe Bosphorus</h1>
            <span className="logo-accent">est. 2024</span>
          </Link>

          <div className={`navbar-links ${this.state.isOpen ? 'active' : ''}`}>
            <Link to="/" className="nav-link">
              <i className="fas fa-home"></i>
              Home
            </Link>
            <Link to="/menu" className="nav-link">
              <i className="fas fa-utensils"></i>
              Menu
            </Link>
            <Link to="/orders" className="nav-link">
              <i className="fas fa-clipboard-list"></i>
              Orders
            </Link>
            <Link to="/about" className="nav-link">
              <i className="fas fa-info-circle"></i>
              About
            </Link>
            <Link to="/contact" className="nav-link">
              <i className="fas fa-phone"></i>
              Contact
            </Link>
          </div>

          <div className="table-number">
            <span>Table</span>
            <strong>12</strong>
          </div>

          <button 
            className={`hamburger-menu ${this.state.isOpen ? 'active' : ''}`}
            onClick={this.toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    );
  }
}

export default Navbar; 