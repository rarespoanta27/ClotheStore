import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Site from "./Site";
import AddProduct from "./AddProduct";
import Login from "./Login";
import Checkout from "./Checkout";
import Register from "./Register";
import AccountDetails from "./AccountDetails";
import ProductList from "./ProductList";
import Cart from "./Cart";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    const storedUserEmail = localStorage.getItem("userEmail");
    const storedLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (storedLoggedIn && storedUserName && storedUserEmail) {
      setIsLoggedIn(true);
      setUserName(storedUserName);
      setUserEmail(storedUserEmail);
    }
  }, []);

  const handleLogin = (name, email) => {
    setIsLoggedIn(true);
    setUserName(name);
    setUserEmail(email);

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("userName", name);
    localStorage.setItem("userEmail", email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserEmail("");

    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");

    alert("You have been logged out.");
  };

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.name} has been added to the cart!`);
  };

  const removeFromCart = (product) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== product._id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = async (orderDetails) => {
    try {
      const response = await fetch("http://localhost:3001/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cart,
          ...orderDetails,
        }),
      });

      if (response.ok) {
        alert("Your order has been placed successfully!");
        clearCart();
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error connecting to the server.");
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Site
              isLoggedIn={isLoggedIn}
              userName={userName}
              userEmail={userEmail}
              onLogout={handleLogout}
              cart={cart}
              addToCart={addToCart}
            />
          }
        />
        <Route
          path="/add-product"
          element={
            isLoggedIn && userEmail === "admin111@yahoo.com" ? (
              <AddProduct />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            isLoggedIn ? (
              <Navigate to="/" replace />
            ) : (
              <Login
                setIsLoggedIn={setIsLoggedIn}
                setUserName={setUserName}
                setUserEmail={setUserEmail}
              />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/account-details"
          element={
            isLoggedIn ? (
              <AccountDetails userName={userName} userEmail={userEmail} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/checkout"
          element={<Checkout cart={cart} clearCart={clearCart} placeOrder={placeOrder} />}
        />
        <Route path="/products" element={<ProductList addToCart={addToCart} />} />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              removeFromCart={removeFromCart}
              proceedToCheckout={() => Navigate("/checkout")}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;