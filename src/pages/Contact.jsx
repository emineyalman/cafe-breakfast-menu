import React from 'react';
import './Contact.css';

const Contact = () => {
  const handleDirections = () => {
    window.open('https://www.google.com/maps/dir/36.0431018,-86.7239125/La+Jarocha,+5455+Nolensville+Pk,+Nashville,+TN+37211/@36.0462262,-86.7241757,1430m/data=!3m2!1e3!4b1!4m19!1m8!3m7!1s0x88646faa20d8f9e9:0xb203b5e85b9cfc0b!2sLa+Jarocha!8m2!3d36.0490415!4d-86.7141866!15sCghyZXN0b3JhbloKIghyZXN0b3JhbpIBEm1leGljYW5fcmVzdGF1cmFudOABAA!16s%2Fg%2F11rd27mwqq!4m9!1m1!4e1!1m5!1m1!1s0x88646faa20d8f9e9:0xb203b5e85b9cfc0b!2m2!1d-86.7142539!2d36.0490755!3e0?entry=ttu&g_ep=EgoyMDI1MDMxNi4wIKXMDSoASAFQAw%3D%3D');
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>

      <div className="contact-info">
      <div className="contact-section">
      <i className="fas fa-map-marker-alt"></i>
        <h3>Address</h3>
        <p>5455 Nolensville Pk</p>
        <p>Nashville, TN 37211</p>
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
      <div className="contact-section " onClick={handleDirections} style={{ cursor: 'pointer', marginTop: '20px' }}>
        <iframe
          title="Restaurant Location on Google Maps"
          width="100%"
          height="300"
          frameBorder="0"
          style={{ border: 0 }}
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.279637789123!2d28.9784!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzI5LjUiTiAyOMKwNTgnNDIuMyJF!5e0!3m2!1sen!2str!4v1631234567890!5m2!1sen!2str"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default Contact;