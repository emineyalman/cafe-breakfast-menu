import React, { useState } from 'react';
import './AddMenu.css';

const AddMenu = () => {
  const [menuItem, setMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add API call to save menu item
    console.log('Menu item to save:', menuItem);
  };

  return (
    <div className="add-menu-container">
      <h2>Add New Menu Item</h2>
      
      <form onSubmit={handleSubmit} className="add-menu-form">
        <div className="form-group">
          <label htmlFor="name">Item Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={menuItem.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={menuItem.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={menuItem.price}
            onChange={handleChange}
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={menuItem.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="breakfast">Breakfast</option>
            <option value="main">Main Course</option>
            <option value="desserts">Desserts</option>
            <option value="beverages">Beverages</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="image">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={menuItem.image}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Add Menu Item
        </button>
      </form>
    </div>
  );
};

export default AddMenu;