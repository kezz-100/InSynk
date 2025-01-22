// Import necessary dependencies and components
import React, { Fragment, useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import axios from "axios";
import Footer from "./Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Center } from "@react-three/drei";

export default function MyTasks() {
  // State variables to manage task data, approved users, and UI states
  const [data, setData] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [adminChecking, setAdminChecking] = useState(false);
  const [adminDeleteMessage, setAdminDeleteMessage] = useState("");

  // useEffect hook to fetch data on component mount
  useEffect(() => {
    getData(); // Fetch task data
    getApprovedUsers();
    logLoggedInUser();
  }, []);

  // Function to fetch task data from the server
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

  // Function to handle task deletion
  const handleDelete = (id) => {
    const url = `https://localhost:7089/api/Tasks/DeleteTasks/${id}`;
    axios
      .delete(url)
      .then((result) => {
        const dt = result.data;
        if (dt.statusCode === 200) {
          getData();
          setAdminDeleteMessage("Task Deleted Successfully.");
          setTimeout(() => {
            setAdminDeleteMessage("");
          }, 2000);
        } else {
          alert(dt.statusMessage);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to get priority color based on due date
  const getPriorityColor = (priority, dueDate) => {
    const timeRemaining = new Date(dueDate).getTime() - new Date().getTime();
    const weeksRemaining = timeRemaining / (1000 * 60 * 60 * 24 * 7);

    if (weeksRemaining <= 1) {
      return { color: "red", text: "High" };
    } else if (weeksRemaining <= 2) {
      return { color: "orange", text: "Medium" };
    } else {
      return { color: "green", text: "Low" };
    }
  };

  // Function to fetch approved users from the server
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
      .post(url, requestData)
      .then((result) => {
        const responseData = result.data;
        if (responseData.statusCode === 200) {
          const approvedUsers = responseData.listRegistration.filter(
            (user) => user.isApproved === 1
          );
          setApprovedUsers(approvedUsers);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to mark task as complete
  const handleComplete = (id) => {
    const requestData = {
      Id: id,
      Email: "", // Dummy value
      Title: "", // Dummy value
      Content: "", // Dummy value
      Priority: "", // Dummy value
      CreatedOn: "", // Dummy value
      AssignedUser: "", // Dummy value
    };

    const url = `https://localhost:7089/api/Tasks/UserComplete`;

    axios
      .post(url, requestData)
      .then((result) => {
        const responseData = result.data;
        if (responseData.statusCode === 200) {
          setAdminChecking(true);
          getData();
          setTimeout(() => {
            setAdminChecking(false);
          }, 2000);
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

  // Get logged-in user email from local storage
  const loggedEmail = localStorage.getItem("loggedEmail");

  // Filter task data based on logged-in user
  const filteredData = data.filter((tasks) =>
    approvedUsers.some(
      (user) =>
        user.email.toLowerCase() === loggedEmail.toLowerCase() &&
        user.id.toString() === tasks.assignedUser
    )
  );

  // Log the logged-in user
  const logLoggedInUser = () => {
    const loggedEmail = localStorage.getItem("loggedEmail");
    console.log("Logged In User:", loggedEmail);
  };

  // Get top two tasks based on due date
  const getTopTwoTasks = () => {
    const filteredData = data.filter((tasks) =>
      approvedUsers.some(
        (user) =>
          user.email === loggedEmail &&
          user.id.toString() === tasks.assignedUser
      )
    );
    const sortedData = filteredData.sort((a, b) =>
      a.dueDate > b.dueDate ? 1 : -1
    );
    return sortedData.slice(0, 2);
  };

  // Get remaining time for a task
  const getTimeRemaining = (dueDate) => {
    const timeRemaining = new Date(dueDate).getTime() - new Date().getTime();
    const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
    return daysRemaining;
  };

  // Function to render circular countdowns for tasks
  const renderCircularCountdowns = () => {
    const topTwoTasks = getTopTwoTasks();

    return (
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {topTwoTasks.map((task, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <h4>{task.title}</h4>
            <div
              style={{
                position: "relative",
                width: "150px",
                height: "150px",
              }}
            >
              <svg
                height="150"
                width="150"
                style={{ position: "absolute", zIndex: "1" }}
              >
                <circle
                  cx="75"
                  cy="75"
                  r="70"
                  stroke="#e6e6e6"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="75"
                  cy="75"
                  r="70"
                  stroke="red"
                  strokeWidth="10"
                  fill="transparent"
                  strokeDasharray={`${
                    (getTimeRemaining(task.dueDate) / 7) * 180
                  }, 439`}
                  transform="rotate(-90 75 75)"
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  top: "2px",
                  right: "-130px",
                  zIndex: "2",
                  fontSize: "1em",
                  transform: "translate(25%, -50%)",
                }}
              >
                Time Remaining:
              </div>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translate(300%, -160%)",
                  zIndex: "2",
                  fontSize: "1.5em",
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                {getTimeRemaining(task.dueDate)} Days
              </div>
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "calc(5% - 20px)", // Adjust the position as needed
                  transform: "translateY(320%)",
                  zIndex: "2",
                  fontSize: "1.5em",
                  color: "red",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Fragment>
      <UserHeader />
      <br />
      <div
        className="form-group col-md-12"
        style={{ width: "80%", backgroundColor: "white", margin: " auto" }}
      >
        <h3>{"My Tasks"}</h3>
      </div>
      <br />
      {renderCircularCountdowns()}
      <br />
      {adminChecking && (
        <div className="text-center">
          <p style={{ color: "green", fontSize: "1.5em" }}>
            Admin is checking...
          </p>
        </div>
      )}
      {adminDeleteMessage && (
        <div className="text-center">
          <p style={{ color: "red", fontSize: "1.5em" }}>
            {adminDeleteMessage}
          </p>
        </div>
      )}
      <br />
      {filteredData.length > 0 ? (
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
              <th scope="col">Admin Response</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((val, index) => (
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
                    ? "Admin is Checking..."
                    : "Let Admin Know This Task is Complete"}
                </td>

                <td style={{ verticalAlign: "middle" }}>
                  <div>
                    <button
                      className="btn btn-dark"
                      onClick={() => handleComplete(val.id)}
                      style={{
                        marginBottom: "5px",
                        width: "80%",
                      }}
                      disabled={val.completeRequest === 1}
                    >
                      Complete
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn btn-dark"
                      onClick={() => handleDelete(val.id, val.isCompleted)}
                      style={{ marginBottom: "5px", width: "80%" }}
                      disabled={val.isCompleted === 0}
                    >
                      Delete
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
        &#9650;
      </div>
      <br />
      <Footer />
    </Fragment>
  );
}
