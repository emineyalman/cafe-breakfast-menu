import React, { useState } from 'react';
import './Orders.css';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [orders, setOrders] = useState({
    active: [
      {
        id: '1234',
        status: 'preparing',
        items: [
          { id: 1, name: 'Turkish Coffee', quantity: 1, price: 4.50 },
          { id: 2, name: 'Baklava', quantity: 2, price: 12.00 },
          { id: 3, name: 'Iskender Kebab', quantity: 1, price: 28.50 }
        ],
        tableNo: '12',
        orderTime: '14:30',
        estimatedTime: '15 min',
        specialNotes: 'Extra sauce on the side'
      },
      {
        id: '1235',
        status: 'confirmed',
        items: [
          { id: 4, name: 'Turkish Tea', quantity: 2, price: 3.00 },
          { id: 5, name: 'Kunefe', quantity: 1, price: 15.00 }
        ],
        tableNo: '12',
        orderTime: '14:45',
        estimatedTime: '10 min',
        specialNotes: ''
      }
    ],
    completed: [
      {
        id: '1233',
        status: 'completed',
        items: [
          { id: 6, name: 'Turkish Breakfast Platter', quantity: 2, price: 35.00 },
          { id: 7, name: 'Turkish Tea', quantity: 4, price: 3.00 }
        ],
        tableNo: '12',
        orderTime: '13:15',
        completedTime: '13:45',
        totalTime: '30 min',
        rating: 5
      }
    ]
  });

  const handleQuantityChange = (orderId, itemId, change) => {
    setOrders(prevOrders => ({
      ...prevOrders,
      active: prevOrders.active.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            items: order.items.map(item => {
              if (item.id === itemId) {
                const newQuantity = item.quantity + change;
                return newQuantity > 0 
                  ? { ...item, quantity: newQuantity }
                  : null;
              }
              return item;
            }).filter(Boolean)
          };
        }
        return order;
      })
    }));
  };

  const handleRemoveItem = (orderId, itemId) => {
    setOrders(prevOrders => ({
      ...prevOrders,
      active: prevOrders.active.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            items: order.items.filter(item => item.id !== itemId)
          };
        }
        return order;
      }).filter(order => order.items.length > 0)
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: '#3498db',
      preparing: '#e67e22',
      completed: '#2ecc71',
      cancelled: '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
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
        {orders[activeTab].map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>Order #{order.id}</h3>
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="order-meta">
                <span className="table-number">
                  <i className="fas fa-chair"></i> Table {order.tableNo}
                </span>
                <span className="order-time">
                  <i className="far fa-clock"></i> {order.orderTime}
                </span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    {activeTab === 'active' ? (
                      <div className="quantity-controls">
                        <button 
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(order.id, item.id, -1)}
                        >
                          <i className="fas fa-minus"></i>
                        </button>
                        <span className="item-quantity">{item.quantity}</span>
                        <button 
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(order.id, item.id, 1)}
                        >
                          <i className="fas fa-plus"></i>
                        </button>
                      </div>
                    ) : (
                      <span className="item-quantity">{item.quantity}x</span>
                    )}
                    <span className="item-name">{item.name}</span>
                  </div>
                  <div className="item-actions">
                    <span className="item-price">${(item.quantity * item.price).toFixed(2)}</span>
                    {activeTab === 'active' && (
                      <button 
                        className="remove-item-btn"
                        onClick={() => handleRemoveItem(order.id, item.id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-details">
                {order.status !== 'completed' && (
                  <div className="estimated-time">
                    <i className="fas fa-hourglass-half"></i>
                    <span>Estimated Time: {order.estimatedTime}</span>
                  </div>
                )}
                {order.specialNotes && (
                  <div className="special-notes">
                    <i className="fas fa-comment-alt"></i>
                    <span>{order.specialNotes}</span>
                  </div>
                )}
                {order.status === 'completed' && (
                  <div className="order-rating">
                    {[...Array(5)].map((_, i) => (
                      <i 
                        key={i}
                        className={`fas fa-star ${i < order.rating ? 'rated' : ''}`}
                      ></i>
                    ))}
                  </div>
                )}
              </div>
              <div className="order-total">
                <span>Total:</span>
                <strong>${calculateTotal(order.items).toFixed(2)}</strong>
              </div>
            </div>

            {order.status !== 'completed' && (
              <div className="order-actions">
                <button className="action-button cancel">
                  <i className="fas fa-times"></i> Cancel Order
                </button>
                <button className="action-button track">
                  <i className="fas fa-map-marker-alt"></i> Track Order
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders; 