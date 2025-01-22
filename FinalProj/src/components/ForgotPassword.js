// Import necessary dependencies and components
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const navigate = useNavigate(); // Get navigation function from react-router
  // State variables to manage email and error message
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Function to handle forgot password
  const handleForgotPassword = (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Validate email
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }

    // Make API call to send reset password email
    const data = {
      Name: "",
      Email: email,
      Password: "",
      PhoneNo: "",
      UserType: "",
    };
    // Make POST request to send reset password email
    axios
      .post("https://localhost:7089/api/Registration/ForgotPassword", data)
      .then((response) => {
        if (response.status === 200) {
          // Email sent successfully
          navigate("/login");
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
      <div className="card text-center" style={{ width: "500px" }}>
        <div className="card-header h5 text-white bg-primary">
          Password Reset
        </div>
        <div className="card-body px-5 py-4">
          <p className="card-text mb-4">
            Enter your email address and we'll send you an email with a
            temporary password you can use to login.
          </p>
          <br />

          <div className="form-outline mb-3">
            <input
              type="email"
              id="typeEmail"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="form-label" htmlFor="typeEmail">
              Enter your Email
            </label>
          </div>
          {errorMessage && (
            <div className="alert alert-danger mb-3">{errorMessage}</div>
          )}
          <br />
          <button
            className="btn btn-primary w-100 mb-3"
            onClick={handleForgotPassword}
          >
            Show My New Password
          </button>
          <br />

          <div className="d-flex justify-content-between">
            <Link to="/login">Log in</Link>
            <Link to="/registration">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
