import React, { useState, useEffect } from 'react';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import './Basket.css';

const Basket = () => {
  const [basketItems, setBasketItems] = useState([]);
  const [orderComplete, setOrderComplete] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getBasketItems();
  }, []);

  const getBasketItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const items = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          ...data,
          quantity: data.quantity || 1,
          price: Number(data.price) || 0
        });
      });
      setBasketItems(items);
      calculateTotal(items);
    } catch (error) {
      console.error("Error fetching basket items:", error);
    }
  };

  const handleQuantityChange = (itemId, change) => {
    setBasketItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const newQuantity = Math.max(0, item.quantity + change);
          return { ...item, quantity: newQuantity };
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const calculateTotal = (items) => {
    const sum = items.reduce((acc, item) => {
      return acc + (item.price * item.quantity);
    }, 0);
    setTotal(sum);
  };

  useEffect(() => {
    calculateTotal(basketItems);
  }, [basketItems]);

  const completeOrder = () => {
    setOrderComplete(true);
    setBasketItems([]);
    setTimeout(() => {
      setOrderComplete(false);
    }, 3000);
  };

  return (
    <div className="basket-container">
      <h2>Your Basket ({basketItems.length} items)</h2>
      
      <div className="basket-items">
        {basketItems.map((item) => (
          <div key={item.id} className="basket-item">
            <div className="item-details">
              <h3>{item.name}</h3>
              <p className="price">${item.price.toFixed(2)}</p>
            </div>
            
            <div className="quantity-controls">
              <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      {basketItems.length > 0 ? (
        <div className="basket-footer">
          <div className="total">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <button className="complete-order" onClick={completeOrder}>
            Complete Order
          </button>
        </div>
      ) : (
        <p className="empty-message">Your basket is empty</p>
      )}

      {orderComplete && (
        <div className="order-success">
          Order completed successfully!
        </div>
      )}
    </div>
  );
};

export default Basket