import React, { useState } from "react";
import "./AccountDetails.css";

const AccountDetails = ({ userName, userEmail }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setMessage("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        const data = await response.json();
        setMessage(data.error || "Failed to update password.");
      }
    } catch (err) {
      setMessage("Error connecting to the server. Please try again.");
    }
  };

  return (
    <div className="account-details-container">
      <h2>Account Details</h2>
      <div className="account-info">
        <p><strong>Full Name:</strong> {userName || "Not provided"}</p>
        <p><strong>Email:</strong> {userEmail || "Not provided"}</p>
      </div>
      <form className="password-change-form" onSubmit={handlePasswordChange}>
        <h3>Change Password</h3>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
        />
        <button type="submit">Update Password</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default AccountDetails;
