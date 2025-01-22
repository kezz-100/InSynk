// Import necessary dependencies and components
import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function UserHeader() {
  // Initialize navigate hook for navigation
  const navigate = useNavigate();
  // State to store the username
  const [username, setUserName] = useState("");
  // State to toggle menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // useEffect hook to set the username from local storage on component mount
  useEffect(() => {
    setUserName(localStorage.getItem("username"));
  }, []);

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to handle logout
  const logout = (e) => {
    e.preventDefault();
    // Remove username from local storage
    localStorage.removeItem("username");
    // Navigate to the home page
    navigate("/");
  };

  /*
  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
*/

  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="/userdashboard">
          InSynk
        </a>
        <button className="navbar-toggler" type="button" onClick={toggleMenu}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mr-auto">
            <li className="nav-item active">
              <a className="nav-link">
                Welcome <span className="sr-only">(current)</span>
                {username}
              </a>
            </li>
            <li className="nav-item">
              <Link to="/mytasks" className="nav-link">
                My Tasks
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/alltasks" className="nav-link">
                All Tasks
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/timelineU" className="nav-link">
                Calendar
              </Link>
            </li>
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
              onClick={(e) => logout(e)}
            >
              Logout
            </button>
          </form>
        </div>
      </nav>
    </Fragment>
  );
}
