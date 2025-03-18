// Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Basket from './Basket';

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
        const data = doc.data();
        if (!data?.name || typeof data.name !== 'string' || 
            !data?.price || typeof parseFloat(data.price) !== 'number') {
          console.warn(`Skipping document ${doc.id} due to invalid or missing fields`);
          return;
        }
  
        const price = parseFloat(data.price);
        const quantity = parseInt(data.quantity) || 1;
  
        // Ensure id is a string by removing any numeric id from data
        const { id: numericId, ...dataWithoutId } = data;
  
        if (ordersMap.has(data.name)) {
          const existingItem = ordersMap.get(data.name);
          existingItem.quantity += quantity;
        } else {
          ordersMap.set(data.name, {
            id: doc.id, // Use Firestore's auto-generated string ID
            ...dataWithoutId, // Use data without numeric id
            price,
            quantity
          });
        }
      });
  
      const ordersArray = Array.from(ordersMap.values());
      setAllOrders(ordersArray);
      setTotalQuantity(ordersArray.reduce((sum, item) => sum + item.quantity, 0));
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
    setAllOrders(prevOrders => 
      prevOrders.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(0, item.quantity + change) } 
          : item
      )
    );
  
    setTotalQuantity(prev => Math.max(0, prev + change));
    setError('');
  };
  
  const handleDelete = async (id) => {
    if (!id || typeof id !== 'string' || id.trim() === "") {
      console.error("Invalid ID provided for deletion:", id);
      setError("Failed to delete item: Invalid ID provided");
      return;
    }
  
    try {
      const itemRef = doc(db, "orders", String(id));
      const itemSnap = await getDoc(itemRef);
  
      if (!itemSnap.exists()) {
        console.error("Item not found in Firestore:", id);
        setError("Failed to delete item: Item not found in database");
        return;
      }
  
      await deleteDoc(itemRef);
      
      setAllOrders(prevOrders => prevOrders.filter(item => item.id !== id));
      setTotalQuantity(prev => Math.max(0, prev - (itemSnap.data().quantity || 0)));
      
      setError(null);
      await getData();
  
    } catch (error) {
      console.error("Error deleting item:", error);
      setError("Failed to delete item: " + (error.message || "Unknown error"));
    }
  };
  
  const clearBasket = async () => {
    try {
      // Delete all items from Firestore
      const deletePromises = allOrders.map(item => 
        deleteDoc(doc(db, "orders", String(item.id)))
      );
      await Promise.all(deletePromises);
      
      // Clear local state
      setAllOrders([]);
      setTotalQuantity(0);
      setSpecialNotes('');
      setError('');
    } catch (error) {
      console.error("Error clearing basket:", error);
      setError("Failed to clear basket: " + error.message);
    }
  };

  const calculateTotal = () => {
    return allOrders.reduce((total, item) => {
      if (!item?.id || !item?.price || !item?.quantity) {
        return total;
      }
      return total + (item.price * item.quantity);
    }, 0);
  };

  const completeOrder = async () => {
    try {
      const activeOrders = allOrders.filter(item => 
        item?.id && item?.name && item?.quantity > 0 && item?.price
      );

      if (activeOrders.length === 0) {
        throw new Error('No valid items in order');
      }
      
      const orderData = {
        items: activeOrders.map(item => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: calculateTotal(),
        specialNotes: specialNotes || '',
        orderDate: new Date().toISOString(),
        status: 'pending',
        tableNumber: 12
      };

      try {
        const docRef = await addDoc(collection(db, "NewOrders"), orderData);
        orderData.id = docRef.id;
        
        // Clear the basket after successful order
        await clearBasket();
        
      } catch (error) {
        if (error.message.includes("Missing or insufficient permissions")) {
          throw new Error("You don't have permission to place orders");
        }
        throw error;
      }

      setOrderComplete(true);
      setError('');

      setTimeout(() => {
        getData();
        setOrderComplete(false);
        setIsBasketOpen(false);
      }, 3000);

    } catch (error) {
      console.error("Error completing order:", error);
      setError(error.message || 'Failed to complete order. Please check your permissions and try again.');
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
          <Basket 
            isBasketOpen={isBasketOpen}
            toggleBasket={toggleBasket}
            allOrders={allOrders}
            handleQuantityChange={handleQuantityChange}
            handleDelete={handleDelete}
            calculateTotal={calculateTotal}
            totalQuantity={totalQuantity}
            specialNotes={specialNotes}
            setSpecialNotes={setSpecialNotes}
            completeOrder={completeOrder}
            orderComplete={orderComplete}
            error={error}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;