import React from "react";

const Basket = ({
  isBasketOpen,
  toggleBasket,
  allOrders,
  handleQuantityChange,
  handleDelete,
  calculateTotal,
  specialNotes,
  setSpecialNotes,
  totalQuantity,
  completeOrder,
  orderComplete,
  error,
}) => {
  return (
    <>
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
            {allOrders
              .filter((item) => item.quantity > 0 && item.id)
              .map((item) => (
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
    </>
  );
};

export default Basket;
