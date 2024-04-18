import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [password, setPassword] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setNewPasswordError("");
    setErrorMessage("");

    if (newPassword === "") {
      setNewPasswordError("New Password cannot be blank");
      return;
    }

    // Make API call to update password
    const updatePasswordData = {
      Email: email,
      Password: password,
      Name: "",
      PhoneNo: "",
      UserType: "",
    };

    axios
      .post(
        "https://localhost:7089/api/Registration/ResetPassword",
        updatePasswordData
      )
      .then((response) => {
        // Check if password update was successful
        if (response.data.statusCode === 200) {
          // Password updated successfully, navigate to login page
          navigate("/");
        } else {
          // Password update failed, handle error
          setErrorMessage(response.data.statusMessage);
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error updating password:", error);
        setErrorMessage("Failed to update password. Please try again.");
      });
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        width: "80%",
        margin: "0 auto",
        borderRadius: "11px",
      }}
    >
      <div className="mt-4" style={{ margin: "0 auto", width: "430px" }}>
        <h3>InSynk</h3>
      </div>

      <section className="vh-100">
        <div className="container py-5 h-100">
          <div className="row d-flex align-items-center justify-content-center h-100">
            <div className="col-md-8 col-lg-7 col-xl-6">
              <img
                src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                className="img-fluid"
                alt="Phone image"
              />
            </div>
            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
              <form>
                <div className="form-outline mb-4">
                  <input
                    type="email"
                    id="email"
                    className="form-control form-control-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="password"
                    id="newPassword"
                    className={`form-control form-control-lg ${
                      newPasswordError && "is-invalid"
                    }`}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <label className="form-label" htmlFor="newPassword">
                    New Password
                  </label>
                  {newPasswordError && (
                    <div className="invalid-feedback">{newPasswordError}</div>
                  )}
                </div>

                {errorMessage && (
                  <div className="alert alert-danger" role="alert">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  onClick={(e) => handleUpdatePassword(e)}
                >
                  Update
                </button>

                <div className="mt-3">
                  <Link to="/" className="btn btn-link">
                    Back to Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ResetPassword;
