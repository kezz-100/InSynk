// Import necessary dependencies and components
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";

function Registration() {
  // State variables to manage form inputs, errors, and UI states
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const [passwordColor, setPasswordColor] = useState("");
  const [passwordWidth, setPasswordWidth] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [phoneNoError, setPhoneNoError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // Added state for registration success
  const [showInfo, setShowInfo] = useState(false); // Added state for showing info

  // Function to handle form submission
  const handleSave = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    clearErrors();

    // Validate inputs
    let error = false;
    if (name === "") {
      setNameError("Name cannot be blank");
      error = true;
    }
    if (email === "") {
      setEmailError("Email cannot be blank");
      error = true;
    }
    if (password === "") {
      setPasswordError("Password cannot be blank");
      error = true;
    } else if (
      password.length < 8 ||
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      setPasswordError(
        "Password should be at least 8 characters long and contain special characters"
      );
      error = true;
    }
    if (phoneNo === "") {
      setPhoneNoError("Phone Number cannot be blank");
      error = true;
    }

    if (error) return;

    if (!/^\d{11}$/.test(phoneNo)) {
      setPhoneNoError("Incorrect phone number");
      return;
    }

    const emailDomains = [
      "gmail.com",
      "yahoo.com",
      "outlook.com",
      "hotmail.com",
      "live.com",
      "aol.com",
      "icloud.com",
      "mail.com",
      "protonmail.com",
      "yandex.com",
      "zoho.com",
      "gmx.com",
    ];

    const domain = email.split("@")[1];
    if (!emailDomains.includes(domain)) {
      setEmailError("Invalid email");
      return;
    }

    // Prepare data object for registration
    const data = {
      Name: name,
      Email: email,
      Password: password,
      PhoneNo: phoneNo,
      UserType: "",
    };

    const url = `https://localhost:7089/api/Registration/Registration`;
    axios
      .post(url, data)
      .then((result) => {
        clear();
        setRegistrationSuccess(true); // Set registration success to true
        setTimeout(() => setRegistrationSuccess(false), 2000); // Reset registration success after 2 seconds
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to navigate to login page
  const handleLogin = (e) => {
    navigate("/login");
  };

  // Function to clear form inputs
  const clear = () => {
    setName("");
    setEmail("");
    setPhoneNo("");
    setPassword("");
    setPasswordStrength("");
    setPasswordWidth(0);
  };

  // Function to clear form errors
  const clearErrors = () => {
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setPhoneNoError("");
  };

  // Function to check password strength and set meter width and color
  const checkPasswordStrength = (value) => {
    let strength = 0;
    if (value.length < 5) {
      setPasswordStrength("Weak");
      setPasswordColor("red");
      setPasswordWidth(33);
      return;
    } else if (value.length < 8) {
      setPasswordStrength("Medium");
      setPasswordColor("orange");
      setPasswordWidth(66);
    } else if (value.length >= 10 && /[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      setPasswordStrength("Strong");
      setPasswordColor("green");
      setPasswordWidth(100);
      return;
    } else {
      setPasswordStrength("Medium");
      setPasswordColor("orange");
      setPasswordWidth(66);
    }
  };

  // Function to handle password change event
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    checkPasswordStrength(value);
  };

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Function to handle form reset
  const handleReset = () => {
    clear();
  };

  // Function to check if email exists
  // Needs correcting but its fine
  const checkEmailExists = (email) => {
    return new Promise((resolve, reject) => {
      const url = `https://localhost:7089/api/Registration/RegistrationList`;
      const requestData = {
        UserType: "USER",
        Email: email,
      };
      axios
        .post(url, requestData)
        .then((result) => {
          const responseData = result.data;
          resolve(responseData.listRegistration.length > 0);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        width: "100%",
        margin: "0 auto",
        borderRadius: "11px",
      }}
    >
      <section className="h-100 ">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col">
              <div className="card card-registration my-4">
                <div className="row g-0">
                  <div className="col-xl-6 d-none d-xl-block">
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp"
                      alt="Sample photo"
                      className="img-fluid"
                      style={{
                        borderTopLeftRadius: ".25rem",
                        borderBottomLeftRadius: ".25rem",
                      }}
                    />
                  </div>
                  <div className="col-xl-6">
                    <div className="card-body p-md-5 text-black">
                      <h3 className="mb-5 text-uppercase">Register </h3>

                      {/* Success message */}
                      {registrationSuccess && (
                        <div
                          className="alert alert-success alert-dismissible fade show"
                          role="alert"
                        >
                          Registration Successful!
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="alert"
                            aria-label="Close"
                            onClick={() => setRegistrationSuccess(false)}
                          ></button>
                        </div>
                      )}

                      <div className="row text-center">
                        <div className="col-md-12 mb-4">
                          <div className="form-outline">
                            <input
                              type="text"
                              id="name"
                              className={`form-control form-control-lg ${
                                nameError && "is-invalid"
                              }`}
                              style={{ width: "100%" }}
                              onChange={(e) => setName(e.target.value)}
                              value={name}
                              autoComplete="name"
                            />
                            <label className="form-label" htmlFor="name">
                              Enter Name
                            </label>
                            {nameError && (
                              <div className="invalid-feedback">
                                {nameError}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="email"
                          className={`form-control form-control-lg ${
                            emailError && "is-invalid"
                          }`}
                          style={{ width: "100%" }}
                          onChange={(e) => setEmail(e.target.value)}
                          value={email}
                          autoComplete="email"
                        />
                        <label className="form-label" htmlFor="email">
                          Email
                        </label>
                        {emailError && (
                          <div className="invalid-feedback">{emailError}</div>
                        )}
                      </div>

                      <div className="form-outline mb-4 position-relative">
                        <div className="d-flex align-items-center flex-column">
                          <div className="position-relative d-flex justify-content-end">
                            <input
                              type={showPassword ? "text" : "password"}
                              id="Password"
                              className={`form-control form-control-lg ${
                                passwordError && "is-invalid"
                              }`}
                              style={{ width: "100%" }}
                              onChange={handlePasswordChange}
                              value={password}
                              autoComplete="new-password"
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={togglePasswordVisibility}
                              style={{ marginLeft: "5px" }}
                            >
                              {showPassword ? (
                                <FontAwesomeIcon icon={faEye} />
                              ) : (
                                <FontAwesomeIcon icon={faEyeSlash} />
                              )}
                            </button>
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              style={{ marginLeft: "5px" }}
                              onClick={() => setShowInfo(!showInfo)} // Toggle showInfo state
                            >
                              <FontAwesomeIcon icon={faInfoCircle} />
                            </button>
                          </div>
                          <div style={{ marginTop: "5px" }}>
                            <label className="form-label" htmlFor="Password">
                              Password
                            </label>
                            {passwordError && (
                              <div className="invalid-feedback">
                                {passwordError}
                              </div>
                            )}
                          </div>
                        </div>
                        <div style={{ marginTop: "5px" }}>
                          <div
                            style={{
                              width: `${passwordWidth}%`,
                              backgroundColor: passwordColor,
                              height: "10px",
                              borderRadius: "5px",
                              marginBottom: "5px",
                            }}
                          ></div>
                          <div className="text-muted">{passwordStrength}</div>
                        </div>
                      </div>

                      {/* Conditional rendering for info pop-up */}
                      {showInfo && (
                        <div className="alert alert-info" role="alert">
                          You can only set this password once. Keep it safe! In
                          the event it has been forgotten you can receive
                          temporary passwords sent by email.{" "}
                        </div>
                      )}

                      <div className="form-outline mb-4">
                        <input
                          type="text"
                          id="PhoneNo"
                          className={`form-control form-control-lg ${
                            phoneNoError && "is-invalid"
                          }`}
                          style={{
                            width: "100%",
                            borderColor: phoneNoError ? "red" : "",
                          }}
                          onChange={(e) => setPhoneNo(e.target.value)}
                          value={phoneNo}
                          autoComplete="tel"
                        />
                        <label className="form-label" htmlFor="PhoneNo">
                          Phone Number
                        </label>
                        {phoneNoError && (
                          <div className="invalid-feedback">{phoneNoError}</div>
                        )}
                      </div>

                      <div className="d-flex justify-content-end pt-3">
                        <button
                          style={{ backgroundColor: "#343a40", color: "white" }}
                          type="button"
                          className="btn btn-light btn-lg"
                          onClick={handleReset}
                        >
                          Reset
                        </button>
                        <button
                          style={{ backgroundColor: "#343a40", color: "white" }}
                          type="button"
                          className="btn btn-light btn-lg"
                          onClick={(e) => handleSave(e)}
                        >
                          Sign up
                        </button>
                        &nbsp;
                        <button
                          style={{ backgroundColor: "#343a40", color: "white" }}
                          type="button"
                          className="btn btn-light btn-lg"
                          onClick={(e) => handleLogin(e)}
                        >
                          Log in
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Registration;
