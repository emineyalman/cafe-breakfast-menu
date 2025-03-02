import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Cafe Bosphorus</h1>
          <p>Experience authentic Turkish cuisine in a modern setting</p>
          <Link to="/menu" className="cta-button">View Menu</Link>
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <i className="fas fa-utensils"></i>
          <h3>Traditional Cuisine</h3>
          <p>Authentic Turkish dishes prepared with care</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-coffee"></i>
          <h3>Fresh Coffee</h3>
          <p>Traditional Turkish coffee and tea</p>
        </div>
        <div className="feature-card">
          <i className="fas fa-clock"></i>
          <h3>Quick Service</h3>
          <p>Fast and efficient table service</p>
        </div>
      </section>

      <section className="special-offers">
        <h2>Today's Specials</h2>
        <div className="offers-grid">
          <div className="offer-card">
            <img src="/images/turkish-breakfast.jpg" alt="Turkish Breakfast" />
            <h3>Turkish Breakfast</h3>
            <p>Complete breakfast experience</p>
            <span className="price">$35.00</span>
          </div>
          <div className="offer-card">
            <img src="/images/iskender.jpg" alt="Iskender Kebab" />
            <h3>Iskender Kebab</h3>
            <p>Our signature dish</p>
            <span className="price">$28.00</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home; 