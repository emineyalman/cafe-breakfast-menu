import React, { useState, useEffect } from 'react';
import './Menu.css';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const Menu = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menuItems, setMenuItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  const addData = async (item) => {
    const quantity = quantities[item.id] || 1; // Get quantity (default: 1)
    try {
      const docRef = await addDoc(collection(db, "orders"), {
        id: item.id,
        name: item.name,
        pieces: quantity, // Use quantity
        price: item.price * quantity, // Calculate total price
      });
      console.log("Order added successfully, ID:", docRef.id);
      alert('Your order has been received!');
    } catch (error) {
      console.error("Error adding order:", error);
      alert('An error occurred while adding your order. Please try again.');
    }
  };

  const handleQuantityChange = (itemId, value) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [itemId]: value,
    }));
  };

  useEffect(() => {
    fetch('/menu.json')
      .then((response) => response.json())
      .then((data) => setMenuItems(data))
      .catch((error) => console.error('Error loading menu:', error));
  }, []);

  const categories = [
    { id: 'all', name: 'All Menu' },
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'main', name: 'Main Dishes' },
    { id: 'desserts', name: 'Desserts' },
    { id: 'drinks', name: 'Drinks' },
    { id: 'salads', name: 'Salads' },
    { id: 'sides', name: 'Sides' },
    { id: 'beverages', name: 'Beverages' },
    { id: 'alcohol', name: 'Non-Alcoholic Drinks' },
    { id: 'alcoholic', name: 'Alcoholic Drinks' }
  ];

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="menu-container">
      <h1 className="menu-title">Our Menu</h1>

      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredItems.map(item => (
          <div key={item.id} className="menu-item">
            <div className="menu-item-image">
              <img src={item.image} alt={item.name} />
            </div>
            <div className="menu-item-content">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <div className="menu-item-footer">
                <span className="price">${item.price}</span>
                <input
                  type="number"
                  min="1"
                  value={quantities[item.id] || 1}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  className="quantity-input"
                  placeholder="Quantity"
                />
                <button className="order-button" onClick={() => addData(item)}>
                  <i className="fas fa-plus"></i>
                  Order Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Menu;