import React, { useState, useEffect } from 'react';
import './Admin.css';
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

const Admin = () => {
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
    const interval = setInterval(getOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "NewOrders", orderId);
      await updateDoc(orderRef, {
        status: newStatus
      });
      await getOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const orderRef = doc(db, "NewOrders", orderId);
      await deleteDoc(orderRef);
      await getOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const deleteAllOrders = async (status) => {
    try {
      const ordersToDelete = orders.filter(order => order.status === status);
      await Promise.all(ordersToDelete.map(order => deleteOrder(order.id)));
      await getOrders();
    } catch (error) {
      console.error("Error deleting orders:", error);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const getStatusColor = (status) => {
    const colors = {
      pending: '#95a5a6',
      preparing: '#e67e22',
      completed: '#2ecc71',
      cancelled: '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'active') {
      return order.status === 'pending';
    } else if (activeTab === 'preparing') {
      return order.status === 'preparing';
    } else if (activeTab === 'cancelled') {
      return order.status === 'cancelled';
    } else {
      return order.status === 'completed';
    }
  });

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Panel</h1>
        <div className="order-tabs">
          <button 
            className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => setActiveTab('active')}
          >
            Active Orders
          </button>
          <button 
            className={`tab-button ${activeTab === 'preparing' ? 'active' : ''}`}
            onClick={() => setActiveTab('preparing')}
          >
            Getting Ready Orders
          </button>
          <button 
            className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed Orders
          </button>
          <button 
            className={`tab-button ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled Orders
          </button>
        </div>
        {(activeTab === 'completed' || activeTab === 'cancelled') && (
          <div className="bulk-actions">
            <button 
              className="action-button delete"
              onClick={() => deleteAllOrders(activeTab === 'completed' ? 'completed' : 'cancelled')}
            >
              Delete All {activeTab === 'completed' ? 'Completed' : 'Cancelled'} Orders
            </button>
          </div>
        )}
      </div>

      <div className="menu-grid">
        {filteredOrders.map(order => (
          <div key={order.id} className="menu-item order-card">
            {activeTab === 'active' && (
                <div className="order-actions">
                  <button 
                    className="action-button preparing"
                    onClick={() => updateOrderStatus(order.id, 'preparing')}
                  >
                    Getting Ready
                  </button>
                  <button 
                    className="action-button cancel"
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  >
                    Cancel Order
                  </button>
                </div>
            )}
            {activeTab === 'preparing' && (
                <div className="order-actions">
                  <button 
                    className="action-button complete"
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                  >
                     Completed 
                  </button>
                  <button 
                    className="action-button cancel"
                    onClick={() => updateOrderStatus(order.id, 'cancelled')}
                  >
                    Cancel Order
                  </button>
                </div>
            )}
            {(activeTab === 'completed' || activeTab === 'cancelled') && (
                <div className="order-actions">
                  <button 
                    className="action-button delete"
                    onClick={() => deleteOrder(order.id)}
                  >
                    Delete Order
                  </button>
                </div>
            )}
            <div className="order-header">
              <div className="order-info">
                <h3>Order #{order.id}</h3>
                
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
              {order.specialNotes && (
                <div className="special-notes">
                  <p><strong>Special Notes:</strong></p>
                  <p>{order.specialNotes}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;