import React, { useState, useEffect } from 'react';
import './Orders.css';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('active');

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
      confirmed: '#3498db',
      preparing: '#e67e22', 
      completed: '#2ecc71',
      cancelled: '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>Your Orders</h1>
        <div className="order-tabs">
          <button 
            className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Orders
          </button>
          <button 
            className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Order History
          </button>
        </div>
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
                  {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Pending'}
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