import React from "react";
import { FaTrash } from "react-icons/fa";
import "./Cart.css";
import { useNavigate } from "react-router-dom";

const Cart = ({ cart, proceedToCheckout, removeFromCart }) => {
  const navigate = useNavigate();

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.length > 0 ? (
        <div className="cart-list">
          {cart.map((product, index) => (
            <div className="cart-item" key={index}>
              {product.image && (
                <img
                  src={`http://localhost:3001${product.image}`}
                  alt={product.name}
                  className="cart-item-image"
                />
              )}
              <div className="cart-item-details">
                <h3>{product.name}</h3>
                <p>Price: ${product.price}</p>
                {product.selectedSize && <p>Size: {product.selectedSize}</p>} {/* Display selected size */}
                {product.description && <p>{product.description}</p>}
              </div>
              <FaTrash
                className="remove-item-icon"
                title="Remove from Cart"
                onClick={() => removeFromCart(product)}
              />
            </div>
          ))}
          <button
            className="proceed-to-checkout-button"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
