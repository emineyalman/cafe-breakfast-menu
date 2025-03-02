import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-container">
      <h1>Contact Us</h1>

      <div className="contact-info">
        <div className="contact-section">
          <i className="fas fa-map-marker-alt"></i>
          <h3>Address</h3>
          <p>123 Restaurant Street</p>
          <p>Istanbul, Turkey</p>
        </div>

        <div className="contact-section">
          <i className="fas fa-phone"></i>
          <h3>Phone</h3>
          <p>+90 (212) 123 4567</p>
        </div>

        <div className="contact-section">
          <i className="fas fa-envelope"></i>
          <h3>Email</h3>
          <p>info@cafebosphorus.com</p>
        </div>
      </div>

      <div className="contact-form">
        <h2>Send us a Message</h2>
        <form>
          <div className="form-group">
            <input type="text" placeholder="Your Name" required />
          </div>
          <div className="form-group">
            <input type="email" placeholder="Your Email" required />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Subject" required />
          </div>
          <div className="form-group">
            <textarea placeholder="Your Message" required></textarea>
          </div>
          <button type="submit" className="submit-button">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact; 