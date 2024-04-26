// Import necessary dependencies and components
import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import AdminHeader from "./AdminHeader";
import Footer from "./Footer";

export default function ApproveCompletion() {
  // State variables to manage task data, approved users, and completion approval status
  const [data, setData] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [completionApproved, setCompletionApproved] = useState(false);

  // Effect hook to fetch data and approved users on component mount
  useEffect(() => {
    getData();
    getApprovedUsers();
  }, []);

  // Function to fetch task data
  const getData = () => {
    const url = `https://localhost:7089/api/Tasks/TasksList`;
    axios
      .get(url)
      .then((result) => {
        const data = result.data;
        if (data.statusCode === 200) {
          setData(data.listTasks);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to get priority color based on due date
  //dynamic change
  const getPriorityColor = (priority, dueDate) => {
    const timeRemaining = new Date(dueDate).getTime() - new Date().getTime();
    const weeksRemaining = timeRemaining / (1000 * 60 * 60 * 24 * 7);

    // Determine priority color based on weeks remaining
    if (weeksRemaining <= 1) {
      return { color: "red", text: "High" };
    } else if (weeksRemaining <= 2) {
      return { color: "orange", text: "Medium" };
    } else {
      return { color: "green", text: "Low" };
    }
  };

  // Function to fetch approved users
  const getApprovedUsers = () => {
    const url = `https://localhost:7089/api/Registration/RegistrationList`;
    const requestData = {
      UserType: "USER",
      Name: "name",
      Email: "email",
      Password: "password",
      PhoneNo: "phoneNo",
    };
    axios
      .post(url, requestData) // Send POST request to fetch users
      .then((result) => {
        const responseData = result.data; // Extract data from response
        if (responseData.statusCode === 200) {
          const approvedUsers = responseData.listRegistration.filter(
            (user) => user.isApproved === 1
          ); // Filter approved users from response data
          setApprovedUsers(approvedUsers); // Update approved users state with fetched data
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to handle completion approval
  const handleApprove = (id) => {
    const requestData = {
      Id: id,
      Email: "", // Dummy value
      Title: "", // Dummy value
      Content: "", // Dummy value
      Priority: "", // Dummy value
      CreatedOn: "", // Dummy value
      AssignedUser: "", // Dummy value
    };

    const url = `https://localhost:7089/api/Tasks/TasksApproval`; // API endpoint for completion approval

    axios
      .post(url, requestData) // Send POST request for completion approval
      .then((result) => {
        const responseData = result.data;
        if (responseData.statusCode === 200) {
          setCompletionApproved(true);
          getData();
          setTimeout(() => {
            setCompletionApproved(false);
          }, 2000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to scroll to top of the page
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
        <h3>{"Approve Completion"}</h3>
      </div>

      {completionApproved && (
        <div className="text-center">
          <p style={{ color: "green", fontSize: "1.5em" }}>
            Completion approved successfully.
          </p>
        </div>
      )}

      {data ? (
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
              <th scope="col">Title</th>
              <th scope="col">Assigned User</th>
              <th scope="col">Content</th>
              <th scope="col">Due Date</th>
              <th scope="col">Priority</th>
              <th scope="col">Date Created</th>
              <th scope="col">Progress</th>
              <th scope="col">User Response</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val, index) => (
              <tr key={index} style={{ verticalAlign: "middle" }}>
                <th style={{ verticalAlign: "middle" }} scope="row">
                  {index + 1}
                </th>
                <td style={{ verticalAlign: "middle" }}>{val.title}</td>
                <td style={{ verticalAlign: "middle" }}>
                  {val.assignedUser &&
                    approvedUsers.find(
                      (user) => user.id === parseInt(val.assignedUser, 10)
                    )?.email}
                </td>
                <td style={{ verticalAlign: "middle" }}>{val.content}</td>
                <td style={{ verticalAlign: "middle" }}>
                  {val.dueDate && (
                    <div style={{ verticalAlign: "middle" }}>
                      <div>{new Date(val.dueDate).toLocaleDateString()}</div>
                      <div>{new Date(val.dueDate).toLocaleTimeString()}</div>
                    </div>
                  )}
                </td>
                <td
                  style={{
                    backgroundColor: getPriorityColor(val.priority, val.dueDate)
                      .color,
                    verticalAlign: "middle",
                  }}
                >
                  {getPriorityColor(val.priority, val.dueDate).text}
                </td>
                <td style={{ verticalAlign: "middle" }}>{val.createdOn}</td>
                <td style={{ verticalAlign: "middle" }}>
                  {val.isCompleted === 1 ? "Finished" : "In Progress"}
                </td>
                <td style={{ verticalAlign: "middle" }}>
                  {val.completeRequest === 1
                    ? "Awaiting Approval"
                    : "Not Complete"}
                </td>
                <td style={{ verticalAlign: "middle" }}>
                  <div>
                    <button
                      className="btn btn-dark"
                      onClick={() => handleApprove(val.id)}
                      style={{ marginBottom: "5px", width: "100%" }}
                      disabled={val.isCompleted === 1}
                    >
                      Approve Complete
                    </button>
                  </div>
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
}
