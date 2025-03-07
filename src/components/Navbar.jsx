import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBasketOpen, setIsBasketOpen] = useState(false);
  const [allOrders, setAllOrders] = useState([]);
  const [orderComplete, setOrderComplete] = useState(false);
  const [specialNotes, setSpecialNotes] = useState('');
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [error, setError] = useState('');

  const getData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const ordersMap = new Map();
      
      querySnapshot.forEach((doc) => {
        if (!doc.id) {
          console.error("Document missing ID");
          return;
        }

        const data = doc.data();
        if (!data.name) {
          console.error("Document missing name field");
          return;
        }
        if (!data.price) {
          console.error("Document missing price field"); 
          return;
        }
        

        const price = typeof data.price === 'string' ? 
          parseFloat(data.price.replace(/[^\d.-]/g, '')) : 
          typeof data.price === 'number' ? 
            data.price : 
            0;

        const quantity = data.quantity || 1;
        
        if (ordersMap.has(data.name)) {
          const existingItem = ordersMap.get(data.name);
          existingItem.quantity += quantity;
        } else {
          ordersMap.set(data.name, {
            id: doc.id,
            ...data,
            price: Number(price) || 0,
            quantity: quantity,
           
          });
        }
      });

      const ordersArray = Array.from(ordersMap.values());
      const total = ordersArray.reduce((sum, item) => sum + item.quantity, 0);

      setAllOrders(ordersArray);
      setTotalQuantity(total);
      setError('');
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError('Failed to load orders. Please try again.');
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
    if (!itemId || typeof itemId !== 'string') {
      console.error("Invalid item ID");
      setError('Unable to update quantity. Please try again.');
      return;
    }

    setAllOrders(prevOrders => 
      prevOrders.map(item => {
        if (item.id === itemId) {
          const newQuantity = (item.quantity || 0) + change;
          return newQuantity >= 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );

    setTotalQuantity(prev => Math.max(0, prev + change));
    setError('');
  };

  const handleDelete = async (id) => {
    try {
      const itemRef = doc(db, "orders", id);
      await deleteDoc(itemRef);
      
      // Update local state after successful deletion
      setAllOrders(prevOrders => {
        const itemToDelete = prevOrders.find(item => item.id === id);
        const quantityToRemove = itemToDelete ? itemToDelete.quantity : 0;
        setTotalQuantity(prev => Math.max(0, prev - quantityToRemove));
        return prevOrders.filter(item => item.id !== id);
      });
    } catch (error) {
      console.error("Error deleting item:", error);
      setError("Failed to delete item. Please try again.");
    }
  };

  const calculateTotal = () => {
    return allOrders.reduce((total, item) => {
      if (!item.id) {
        console.error("Item missing ID");
        return total;
      }
      const price = typeof item.price === 'number' ? item.price : 0;
      return total + (price * (item.quantity || 0));
    }, 0);
  };

  const completeOrder = async () => {
    try {
      const activeOrders = allOrders.filter(item => {
        if (!item.id) {
          console.error("Item missing ID field");
          return false;
        }
        if (!item.name) {
          console.error("Item missing name field");
          return false;
        }
        if (!item.quantity) {
          console.error("Item missing quantity field");
          return false;
        }
        if (!item.price) {
          console.error("Item missing price field");
          return false;
        }
        return item.quantity > 0;
      });

      if (activeOrders.length === 0) {
        setError('No valid items in order');
        return;
      }
      
      const orderData = {
        items: activeOrders.map(item => ({
          name: item.name || '',
          quantity: item.quantity || 0,
          price: item.price || 0
        })),
        totalAmount: calculateTotal() || 0,
        specialNotes: specialNotes || '',
        orderDate: new Date().toISOString(),
        status: 'pending',
        tableNumber: 12
      };

      await addDoc(collection(db, "NewOrders"), orderData);

      setOrderComplete(true);
      setError('');
      
      setAllOrders(prevOrders => 
        prevOrders.map(item => ({...item, quantity: 0}))
      );
      setTotalQuantity(0);
      setSpecialNotes('');

      setTimeout(() => {
        getData();
        setOrderComplete(false);
        setIsBasketOpen(false);
      }, 3000);

    } catch (error) {
      console.error("Error completing order:", error);
      setError('Failed to complete order. Please try again.');
    }
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
            <span className="basket-count">{totalQuantity}</span>
          </button>

          <button 
            className={`hamburger-menu ${isOpen ? 'active' : ''}`}
            onClick={toggleMenu}
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
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
            {error && <div className="error-message">{error}</div>}
            <div className="basket-items">
              {allOrders.filter(item => item.quantity > 0 && item.id).map((item) => (
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
                      ${(item.price * (item.quantity || 0)).toFixed(2)}
                    </span>
                    <button 
                      className="remove-item-btn"
                      onClick={() => handleDelete(item.id)}
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

              {totalQuantity > 0 ? (
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



