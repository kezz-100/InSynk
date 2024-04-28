// Import necessary dependencies and components
import React, { Fragment, useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import axios from "axios";
import Footer from "./Footer";

export default function AllTasksAd() {
  // State variables to manage task data, form inputs, editing state, and search query
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [data, setData] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("asc"); // State variable to track sorting order

  // Constants for maximum title and content lengths
  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 1000;
  // State variables to track remaining characters for title and content
  const [titleLength, setTitleLength] = useState(MAX_TITLE_LENGTH);
  const [contentLength, setContentLength] = useState(MAX_CONTENT_LENGTH);

  // Effect hook to fetch data and approved users on component mount
  useEffect(() => {
    getData();
    getApprovedUsers();
  }, []);

  // Effect hook to update character counts when title or content changes
  useEffect(() => {
    setTitleLength(MAX_TITLE_LENGTH - title.length);
    setContentLength(MAX_CONTENT_LENGTH - content.length);
  }, [title, content]);

  // Function to fetch task data
  const getData = () => {
    const url = `https://localhost:7089/api/Tasks/TasksList`; // API endpoint to fetch task data
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

  // Function to get priority color based on due date
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

  // Function to scroll to top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Function to handle sorting based on due date
  const handleSortByDueDate = () => {
    const sortedData = [...data]; // Create a copy of the original data
    if (sortBy === "asc") {
      sortedData.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate)); // Sort in ascending order
      setSortBy("desc"); // Update sorting order to descending
    } else {
      sortedData.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)); // Sort in descending order
      setSortBy("asc"); // Update sorting order to ascending
    }
    setData(sortedData); // Update data with sorted data
  };

  // Filter data based on search query
  const filteredData = searchQuery
    ? data.filter((item) => {
        const assignedUserEmail =
          approvedUsers.find(
            (user) => user.id === parseInt(item.assignedUser, 10)
          )?.email || "";
        return assignedUserEmail
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      })
    : data;

  return (
    <Fragment>
      <UserHeader />
      <br />
      <div
        className="form-group col-md-12"
        style={{ width: "80%", backgroundColor: "white", margin: " auto" }}
      >
        <h3>{"All Tasks"}</h3>
      </div>
      <br />
      <div
        className="form-group col-md-12"
        style={{ width: "80%", backgroundColor: "white", margin: " auto" }}
      >
        <input
          type="text"
          placeholder="Enter Email to Filter Tasks"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "300px", paddingRight: "30px" }}
        />
        <span
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            cursor: "pointer",
          }}
        >
          <i className="fa fa-search" />
        </span>
      </div>
      <br />
      <div
        className="form-group col-md-12"
        style={{ width: "80%", backgroundColor: "white", margin: " auto" }}
      >
        <select
          value={sortBy}
          onChange={handleSortByDueDate}
          style={{ width: "300px" }}
        >
          <option value="asc">Earliest to Latest</option>
          <option value="desc">Latest to Earliest</option>
        </select>
      </div>
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
                  {/* Find the user object based on the assigned user ID */}
                  {val.assignedUser &&
                    approvedUsers.find(
                      (user) => user.id === parseInt(val.assignedUser, 10)
                    )?.email}
                </td>
                <td style={{ verticalAlign: "middle" }}>{val.content}</td>
                <td style={{ verticalAlign: "middle" }}>
                  {/* Display date and time with spacing */}
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
      <br />
      <Footer />
    </Fragment>
  );
}
