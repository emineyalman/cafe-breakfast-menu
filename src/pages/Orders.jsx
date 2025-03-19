import React, { useState, useEffect } from 'react';
import './Orders.css';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "NewOrders"));
      const ordersArray = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ordersArray.push({
          id: doc.id,
          ...data
        });
      });
      setOrders(ordersArray);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      preparing: '#e67e22',
      completed: '#2ecc71',
      cancelled: '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Order History</h1>
      </div>

      <div className="orders-container">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Order #{order.id}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status === 'preparing' ? 'Getting Ready' : 
                    order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Getting Ready'}
                </span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-info">
                    <span className="item-quantity">{item.quantity}x</span>
                    <span className="item-name">{item.name}</span>
                  </div>
                  <div className="item-actions">
                    <span className="item-price">${(item.quantity * item.price).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-total">
                <span>Total:</span>
                <strong>${order.totalAmount.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;