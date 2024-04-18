import React, { Fragment, useEffect, useState } from "react";
import UserHeader from "./UserHeader";
import axios from "axios";
import Footer from "./Footer";

export default function News() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Low");
  const [data, setData] = useState([]);
  const [editingNewsId, setEditingNewsId] = useState(null);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [assignedUser, setAssignedUser] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 1000;
  const [titleLength, setTitleLength] = useState(MAX_TITLE_LENGTH);
  const [contentLength, setContentLength] = useState(MAX_CONTENT_LENGTH);

  useEffect(() => {
    getData();
    getApprovedUsers();
  }, []);

  useEffect(() => {
    setTitleLength(MAX_TITLE_LENGTH - title.length);
    setContentLength(MAX_CONTENT_LENGTH - content.length);
  }, [title, content]);

  const formatDateTime = (dateTimeString) => {
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleDateString("en-US", options);
  };

  const getData = () => {
    const url = `https://localhost:7089/api/News/NewsList`;
    axios
      .get(url)
      .then((result) => {
        const data = result.data;
        if (data.statusCode === 200) {
          setData(data.listNews);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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

  const handleSave = (e) => {
    e.preventDefault();

    const data = {
      Title: title,
      AssignedUser: assignedUser,
      Content: content,
      DueDate: dueDate,
      Priority: priority,
      Email: localStorage.getItem("loggedEmail"),
      CreatedOn: "",
    };

    console.log("Data being sent:", data);

    const url = `https://localhost:7089/api/News/AddNews`;
    axios
      .post(url, data)
      .then((result) => {
        const dt = result.data;
        if (dt.statusCode === 200) {
          getData();
          Clear();
          alert("News Added");
        } else {
          alert(dt.statusMessage);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this news?"
    );

    if (confirmDelete) {
      const url = `https://localhost:7089/api/News/DeleteNews/${id}`;
      axios
        .delete(url)
        .then((result) => {
          const dt = result.data;
          if (dt.statusCode === 200) {
            getData();
            alert("News Deleted");
          } else {
            alert(dt.statusMessage);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleComplete = (id) => {
    const newsToEdit = data.find((news) => news.id === id);
    setTitle(newsToEdit.title);
    setAssignedUser(newsToEdit.assignedUser);
    setContent(newsToEdit.content);
    setDueDate(newsToEdit.dueDate);
    setPriority(newsToEdit.priority);
    setEditingNewsId(id);
    // setSelectedUser(
    //   newsToEdit.assignedUser ? newsToEdit.assignedUser.id.toString() : ""
    // );
  };

  const Clear = () => {
    setTitle("");
    setAssignedUser("");
    setContent("");
    setDueDate("");
    setPriority("Low");
    setEditingNewsId(null);
    //setSelectedUser("");
  };

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
          bottom: "50px",
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
