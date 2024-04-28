// Import necessary dependencies and components
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const navigate = useNavigate(); // Get navigation function from react-router
  // State variables to manage email, password, and error messages
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Function to handle login
  const handleLogin = (e) => {
    e.preventDefault();
    setEmailError("");
    setPasswordError("");

    // Validation
    let error = "";
    if (email === "") {
      setEmailError("Email address cannot be blank");
      error = "Email";
    }

    if (password === "") {
      setPasswordError("Password cannot be blank");
      error = error ? `${error} and Password` : "Password";
    }

    if (error) {
      return;
    }

    // Create data object with email and password
    const data = {
      Email: email,
      Password: password,
      Name: "",
      PhoneNo: "",
      UserType: "",
    };

    // POST request to login endpoint
    const url = `https://localhost:7089/api/Registration/Login`;
    axios
      .post(url, data)
      .then((result) => {
        const dt = result.data;
        if (dt.statusCode === 200) {
          localStorage.setItem("loggedEmail", email);
          localStorage.setItem("username", dt.registration.name);

          // Redirect based on user type
          if (dt.registration.userType.toUpperCase() === "ADMIN") {
            navigate("/admindashboard");
          } else {
            navigate("/userdashboard");
          }
        } else {
          // Set error messages
          setEmailError("Email or password is incorrect. Please try again.");
          setPasswordError("Email or password is incorrect. Please try again.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        width: "80%",
        margin: "0 auto",
        borderRadius: "11px",
        //marginBottom: "80px",
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
                    id="form1Example13"
                    className={`form-control form-control-lg ${
                      emailError && "is-invalid"
                    }`}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label className="form-label" htmlFor="form1Example13">
                    Email address
                  </label>
                  {emailError && (
                    <div className="invalid-feedback">{emailError}</div>
                  )}
                </div>

                <div className="form-outline mb-4">
                  <input
                    type="password"
                    id="form1Example23"
                    className={`form-control form-control-lg ${
                      passwordError && "is-invalid"
                    }`}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label className="form-label" htmlFor="form1Example23">
                    Password
                  </label>
                  {passwordError && (
                    <div className="invalid-feedback">{passwordError}</div>
                  )}
                </div>

                <div className="d-flex justify-content-around align-items-center mb-4">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="form1Example3"
                    />
                    <label className="form-check-label" htmlFor="form1Example3">
                      Remember me
                    </label>
                  </div>
                  <Link to="/forgotpassword">Forgot Password?</Link>{" "}
                  {/* Forgot password link */}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg btn-block"
                  onClick={(e) => handleLogin(e)}
                >
                  Log in
                </button>

                <a
                  className="btn btn-light btn-lg"
                  style={{
                    backgroundColor: "#343a40",
                    color: "white",
                    width: "100%",
                  }}
                  href="/registration"
                  role="button"
                >
                  <i className="fab fa-twitter me-2"></i>Sign up
                </a>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
