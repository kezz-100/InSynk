import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleResetPassword = (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate email
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    // Make API call to send reset password email
    axios
      .post("https://localhost:7089/api/Registration/ForgotPassword", {
        Email: email, // Corrected the field name to 'email'
      })
      .then((response) => {
        if (response.status === 200) {
          // Email sent successfully
          navigate("/resetpassword");
        } else {
          // Failed to send email, display error message
          setErrorMessage(response.data.statusMessage);
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error sending reset password email:", error);
        setErrorMessage(
          "Failed to send reset password email. Please try again."
        );
      });
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="card text-center" style={{ width: "300px" }}>
        <div className="card-header h5 text-white bg-primary">
          Password Reset
        </div>
        <div className="card-body px-5">
          <p className="card-text py-2">
            Enter your email address and we'll send you an email with
            instructions to reset your password.
          </p>
          <div className="form-outline">
            <input
              type="email"
              id="typeEmail"
              className="form-control my-3"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="form-label" htmlFor="typeEmail">
              Enter your Email
            </label>
          </div>
          {errorMessage && (
            <div className="alert alert-danger">{errorMessage}</div>
          )}
          <button
            className="btn btn-primary w-100"
            onClick={handleResetPassword}
          >
            Reset password
          </button>
          <div className="d-flex justify-content-between mt-4">
            <Link to="/">Login</Link>
            <Link to="/registration">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
