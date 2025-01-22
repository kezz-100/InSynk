// Import necessary dependencies and components
import React, { Fragment, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function AdminHeader() {
  // Initialize navigate hook for navigation
  const navigate = useNavigate();
  // State to toggle menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to handle logout
  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("username");
    navigate("/");
  };

  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="/adminDashboard">
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
                Admin
              </a>
            </li>
            <li className="nav-item">
              <Link to="/registrationlist" className="nav-link">
                Registration Management
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/tasks" className="nav-link">
                Task Assignment
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/alltasksad" className="nav-link">
                All Tasks
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/timeline" className="nav-link">
                Calendar
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/approvecompletion" className="nav-link">
                Approve Completion
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

export default AdminHeader;
