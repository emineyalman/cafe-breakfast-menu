import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      
      <section className="about-section">
        <h2>Our Story</h2>
        <p>
          Founded in 2024, Cafe Bosphorus brings the authentic taste of Turkish cuisine 
          to your table. Our journey began with a passion for sharing traditional 
          flavors with a modern twist.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          We strive to provide an authentic Turkish dining experience while maintaining 
          the highest standards of quality and service. Each dish is prepared with 
          carefully selected ingredients and traditional recipes.
        </p>
      </section>

      <section className="about-section">
        <h2>Our Kitchen</h2>
        <p>
          Led by experienced chefs, our kitchen combines time-honored recipes with 
          contemporary techniques. We take pride in preparing each dish with care 
          and attention to detail.
        </p>
      </section>
    </div>
  );
};

export default About; 