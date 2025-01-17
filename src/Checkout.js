import React, { useState } from "react";
import "./Checkout.css";

const Checkout = ({ cart, clearCart, placeOrder }) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash-on-delivery");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !address) {
      alert("Please fill in all the required fields.");
      return;
    }

    const orderData = {
      items: cart,
      customerName: name,
      address,
      paymentMethod,
    };

    try {
      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        setMessage("Order placed successfully!");
        clearCart(); // Golește coșul după plasare
        setName("");
        setAddress("");
        setPaymentMethod("cash-on-delivery");
      } else {
        const errorData = await response.json();
        setMessage(errorData.error || "Failed to place order.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setMessage("Error connecting to the server.");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Delivery Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="payment">Payment Method:</label>
          <select
            id="payment"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="cash-on-delivery">Cash on Delivery</option>
          </select>
        </div>
        <button type="submit" className="place-order-button">
          Place Order
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Checkout;
