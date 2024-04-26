// Import necessary dependencies and components
import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import Footer from "./Footer";

const RegistrationList = () => {
  // State variables to manage data and UI states
  const [data, setData] = useState([]);
  const [registrationApproved, setRegistrationApproved] = useState(false);
  const [registrationDeleted, setRegistrationDeleted] = useState(false);

  // useEffect hook to fetch data when component mounts
  useEffect(() => {
    getData(); // Call the getData function to fetch registration data
  }, []);

  // Function to fetch registration data from the server
  const getData = () => {
    const url = `https://localhost:7089/api/Registration/RegistrationList`; // API endpoint to fetch registration data
    const requestData = {
      // Request data object
      UserType: "USER",
      Name: "name",
      Email: "email",
      Password: "password",
      PhoneNo: "phoneNo",
    };
    axios
      .post(url, requestData) // POST request to fetch registration data
      .then((result) => {
        const responseData = result.data;
        if (responseData.statusCode === 200) {
          setData(responseData.listRegistration);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to handle approval of a registration
  const handleApprove = (id) => {
    const requestData = {
      Id: id,
      UserType: "USER",
      Name: "name",
      Email: "email",
      Password: "password",
      PhoneNo: "phoneNo",
    };
    const url = `https://localhost:7089/api/Registration/UserApproval`;
    axios
      .post(url, requestData)
      .then((result) => {
        const responseData = result.data;
        if (responseData.statusCode === 200) {
          setRegistrationApproved(true);
          getData();
          setTimeout(() => {
            setRegistrationApproved(false);
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to handle deletion of a registration
  const handleDelete = (id) => {
    const url = `https://localhost:7089/api/Registration/DeleteRegistration/${id}`;
    axios
      .delete(url)
      .then((result) => {
        const dt = result.data;
        if (dt.statusCode === 200) {
          getData();
          setRegistrationDeleted(true);
          setTimeout(() => {
            setRegistrationDeleted(false);
          }, 2000);
        } else {
          alert("Error deleting registration.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Fragment>
      <AdminHeader />
      <br />

      <div
        className="form-group col-md-12"
        style={{ width: "80%", backgroundColor: "white", margin: " auto" }}
      >
        <h3>{"Approve Registration"}</h3>
      </div>

      {registrationApproved && (
        <div className="text-center">
          <p style={{ color: "green", fontSize: "1.5em" }}>
            Registration approved successfully.
          </p>
        </div>
      )}

      {registrationDeleted && (
        <div className="text-center">
          <p style={{ color: "red", fontSize: "1.5em" }}>
            Registration deleted successfully.
          </p>
        </div>
      )}

      {data && data.length > 0 ? (
        <table
          className="table stripped table-hover mt-4"
          style={{
            backgroundColor: "white",
            width: "80%",
            margin: "0 auto",
            marginBottom: "250px",
          }}
        >
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone No</th>
              <th scope="col">Approved</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val, index) => (
              <tr key={val.id}>
                <th scope="row">{index + 1}</th>
                <td>{val.name}</td>
                <td>{val.email}</td>
                <td>{val.phoneNo}</td>
                <td>{val.isApproved === 1 ? "YES" : "NO"}</td>
                <td>
                  <Fragment>
                    <button
                      className="btn btn-dark"
                      onClick={() => handleApprove(val.id)}
                      style={{ marginBottom: "5px", width: "80%" }}
                      disabled={val.isApproved === 1}
                    >
                      Mark Approved
                    </button>{" "}
                    <button
                      className="btn btn-dark"
                      onClick={() => handleDelete(val.id)}
                      style={{ marginBottom: "5px", width: "80%" }}
                    >
                      Delete
                    </button>
                  </Fragment>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        "No data found"
      )}

      {/* Up Arrow */}
      <div
        style={{
          position: "fixed",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          cursor: "pointer",
          fontSize: "2em",
        }}
        onClick={scrollToTop}
      >
        &#9650; {/* Unicode character for an upward arrow */}
      </div>
      <Footer />
    </Fragment>
  );
};

export default RegistrationList;
