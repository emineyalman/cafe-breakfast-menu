import React, { useState } from 'react';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState({
    active: [
      {
        id: '1234',
        status: 'hazırlanıyor',
        items: [
          { id: 1, name: 'Türk Kahvesi', quantity: 1, price: 4.50 },
          { id: 2, name: 'Baklava', quantity: 2, price: 12.00 }
        ],
        tableNo: '12',
        orderTime: '14:30',
        estimatedTime: '15 dk'
      }
    ],
    completed: [
      {
        id: '1233',
        status: 'tamamlandı', 
        items: [
          { id: 3, name: 'Künefe', quantity: 1, price: 15.00 }
        ],
        tableNo: '8',
        orderTime: '13:15',
        completedTime: '13:45',
        totalTime: '30 dk'
      }
    ]
  });

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prevOrders => {
      const allOrders = [...prevOrders.active, ...prevOrders.completed];
      const updatedOrder = allOrders.find(order => order.id === orderId);
      
      if (updatedOrder) {
        const updatedOrderObj = {...updatedOrder, status: newStatus};
        
        return {
          active: newStatus === 'hazırlanıyor' ? 
            [...prevOrders.active.filter(o => o.id !== orderId), updatedOrderObj] :
            prevOrders.active.filter(o => o.id !== orderId),
          completed: newStatus === 'tamamlandı' ?
            [...prevOrders.completed.filter(o => o.id !== orderId), updatedOrderObj] :
            prevOrders.completed.filter(o => o.id !== orderId)
        };
      }
      return prevOrders;
    });
  };

  const getFilteredOrders = () => {
    switch(activeTab) {
      case 'active':
        return orders.active;
      case 'completed':
        return orders.completed;
      default:
        return [...orders.active, ...orders.completed];
    }
  };

  return (
    <div className="admin-container">
      <h1>Admin Paneli</h1>
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          Tüm Siparişler
        </button>
        <button 
          className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Hazırlanan Siparişler
        </button>
        <button 
          className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Tamamlanan Siparişler
        </button>
      </div>

      <div className="menu-grid">
        {getFilteredOrders().map(order => (
          <div key={order.id} className="menu-item order-card">
            <div className="order-header">
              <h3>Masa No: {order.tableNo}</h3>
              <div className="status-controls">
                <button 
                  className={`status-button ${order.status === 'hazırlanıyor' ? 'active' : ''}`}
                  onClick={() => handleStatusChange(order.id, 'hazırlanıyor')}
                >
                  Hazırlanıyor
                </button>
                <button 
                  className={`status-button ${order.status === 'tamamlandı' ? 'active' : ''}`}
                  onClick={() => handleStatusChange(order.id, 'tamamlandı')}
                >
                  Tamamlandı
                </button>
              </div>
            </div>

            <div className="order-items">
              {order.items.map(item => (
                <div key={item.id} className="order-item">
                  <div className="item-info">
                    <span className="item-name">{item.name}</span>
                    <span className="item-quantity">x{item.quantity}</span>
                  </div>
                  <span className="item-price">₺{item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-meta">
                <span><i className="far fa-clock"></i>{order.orderTime}</span>
                {order.status === 'hazırlanıyor' ? (
                  <span><i className="fas fa-hourglass-half"></i>{order.estimatedTime}</span>
                ) : (
                  <span><i className="fas fa-stopwatch"></i>{order.totalTime}</span>
                )}
              </div>
              <div className="order-total">
                <span>Toplam:</span>
                <strong>₺{calculateTotal(order.items).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;