import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = ({ setIsLoggedIn, setUserName, setUserEmail }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form submitted with:", { email, password });

    // Validate fields
    if (!email || !password) {
      setError("All fields are required!");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email format!");
      return;
    }

    try {
      setIsLoading(true); // Show the loading spinner
      console.log("Sending login request to server...");

      // Send login request to the server
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      console.log("Server response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Data received from server:", data);

        // Ensure we have the required data from the server
        if (!data.fullName || !data.email) {
          setError("Unexpected server response. Please try again.");
          console.error("Missing fullName or email in server response.");
          return;
        }

        // Update the login state
        setIsLoggedIn(true);
        setUserName(data.fullName);
        setUserEmail(data.email);

        console.log("User logged in with:", { fullName: data.fullName, email: data.email });

        // Persist the login state in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", data.fullName);
        localStorage.setItem("userEmail", data.email);

        // Clear the input fields and error message
        setEmail("");
        setPassword("");
        setError("");

        // Redirect to the homepage
        navigate("/");
      } else {
        // Handle server errors
        const data = await response.json();
        console.error("Server error response:", data);
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      setError("Failed to connect to the server. Please try again later.");
    } finally {
      setIsLoading(false); // Hide the loading spinner
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome to ClotheStore</h2>
      <p className="login-tagline">Shop the latest trends with ease!</p>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(""); // Clear error when user starts typing
          }}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(""); // Clear error when user starts typing
          }}
          required
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account?{" "}
        <Link to="/register" className="register-link">
          Create one!
        </Link>
      </p>
    </div>
  );
};

export default Login;
