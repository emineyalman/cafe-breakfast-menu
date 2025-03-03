import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [basketItems, setBasketItems] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [orderComplete, setOrderComplete] = useState(false);
  const [specialNotes, setSpecialNotes] = useState('');

  const getData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const ordersArray = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Ensure price is a valid number
        const price = typeof data.price === 'string' ? 
          parseFloat(data.price.replace(/[^\d.-]/g, '')) : // Remove non-numeric chars except decimal
          typeof data.price === 'number' ? 
            data.price : 
            0; // Fallback to 0 if invalid

        ordersArray.push({ 
          id: doc.id, 
          ...data,
          price: Number(price) || 0, // Convert to number and handle NaN
          image: data.image || '/images/default-dish.png'
        });
      });
      setAllOrders(ordersArray);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleBasket = () => {
    setIsBasketOpen(!isBasketOpen);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleQuantityChange = (itemId, change) => {
    setBasketItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = item.quantity + change;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(Boolean)
    );
  };

  const handleRemoveItem = (itemId) => {
    setBasketItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const calculateTotal = () => {
    return basketItems.reduce((total, item) => {
      const price = typeof item.price === 'number' ? item.price : 0;
      return total + (item.quantity * price);
    }, 0);
  };

  const completeOrder = () => {
    setOrderComplete(true);
    setBasketItems([]);
    setSpecialNotes('');
    setTimeout(() => {
      setOrderComplete(false);
      setIsBasketOpen(false);
    }, 3000);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <h1>Cafe Bosphorus</h1>
          <span className="logo-accent">est. 2024</span>
        </Link>

        <div className={`navbar-links ${isOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link" onClick={handleLinkClick}>
            <i className="fas fa-home"></i>
            Home
          </Link>
          <Link to="/menu" className="nav-link" onClick={handleLinkClick}>
            <i className="fas fa-utensils"></i>
            Menu
          </Link>
          <Link to="/orders" className="nav-link" onClick={handleLinkClick}>
            <i className="fas fa-clipboard-list"></i>
            Orders
          </Link>
          <Link to="/about" className="nav-link" onClick={handleLinkClick}>
            <i className="fas fa-info-circle"></i>
            About
          </Link>
          <Link to="/contact" className="nav-link" onClick={handleLinkClick}>
            <i className="fas fa-phone"></i>
            Contact
          </Link>
        </div>

        <div className="nav-right">
          <div className="table-number">
            <span>Table</span>
            <strong>12</strong>
          </div>

          <button className="basket-button" onClick={toggleBasket}>
            <i className="fas fa-shopping-basket"></i>
            <span className="basket-count">{basketItems.length}</span>
          </button>

          <button 
            className={`hamburger-menu ${isOpen ? 'active' : ''}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {isBasketOpen && (
          <div className="basket-sidebar">
            <div className="basket-header">
              <h2>Your Orders</h2>
              <button className="close-basket" onClick={toggleBasket}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="basket-items">
              {allOrders.map((item) => (
                <div key={item.id} className="basket-item">
                  <div className="item-info">
                    <h3>{item.name}</h3>
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, -1)}
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <span className="item-quantity">{item.quantity}</span>
                      <button 
                        className="quantity-btn"
                        onClick={() => handleQuantityChange(item.id, 1)}
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="item-actions">
                    <span className="item-price">
                      ${(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </span>
                    <button 
                      className="remove-item-btn"
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="basket-footer">
              <textarea
                className="special-notes"
                placeholder="Add special notes for your order..."
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
              />
              
              <div className="order-total">
                <span>Total:</span>
                <strong>${calculateTotal().toFixed(2)}</strong>
              </div>

              {basketItems.length > 0 ? (
                <button className="complete-order-btn" onClick={completeOrder}>
                  Complete Order
                </button>
              ) : (
                <p className="empty-basket-message">Your basket is empty</p>
              )}
              
              {orderComplete && (
                <div className="order-success">
                  Your order has been received!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;