// Import necessary dependencies and components
import React, { Fragment, useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import axios from "axios";
import Footer from "./Footer";

export default function Tasks() {
  // Define state variables for task details, data, editing task ID, approved users, and errors
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [priority, setPriority] = useState("Low");
  const [data, setData] = useState([]);
  const [editingTasksId, setEditingTasksId] = useState(null);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [assignedUser, setAssignedUser] = useState("");
  const [titleError, setTitleError] = useState("");
  const [contentError, setContentError] = useState("");
  const [dueDateError, setDueDateError] = useState("");
  const [assignedUserError, setAssignedUserError] = useState("");
  const [reservedIntervals, setReservedIntervals] = useState([]);

  const MAX_TITLE_LENGTH = 100;
  const MAX_CONTENT_LENGTH = 1000;
  const [titleLength, setTitleLength] = useState(MAX_TITLE_LENGTH);
  const [contentLength, setContentLength] = useState(MAX_CONTENT_LENGTH);
  const [taskSaved, setTaskSaved] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");
  const [tasksDeleted, setTasksDeleted] = useState(false);

  const [tasksData, setTasksData] = useState([]);

  // Fetch initial data on component mount
  useEffect(() => {
    getData();
    getApprovedUsers();
  }, []);

  // Update title and content length counters when title or content changes
  useEffect(() => {
    setTitleLength(MAX_TITLE_LENGTH - title.length);
    setContentLength(MAX_CONTENT_LENGTH - content.length);
  }, [title, content]);

  /*
  // Function to format date and time string
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
  */

  // Function to fetch tasks data from the server
  const getData = () => {
    const url = `https://localhost:7089/api/Tasks/TasksList`;
    axios
      .get(url)
      .then((result) => {
        const data = result.data;
        if (data.statusCode === 200) {
          setData(data.listTasks);
          updateReservedIntervals(data.listTasks);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to update reserved intervals based on task due dates
  const updateReservedIntervals = (listTasks) => {
    const reserved = listTasks.map((tasks) => {
      const dueDateTime = new Date(tasks.dueDate);
      return dueDateTime.getHours() * 60 + dueDateTime.getMinutes();
    });
    setReservedIntervals(reserved);
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

  // Function to handle task save
  const handleSave = (e) => {
    e.preventDefault();

    let hasError = false;

    // Check for validation errors
    if (!title) {
      setTitleError("Title cannot be empty");
      hasError = true;
    } else {
      setTitleError("");
    }

    if (!content) {
      setContentError("Content cannot be empty");
      hasError = true;
    } else {
      setContentError("");
    }

    if (!dueDate) {
      setDueDateError("Due date cannot be empty");
      hasError = true;
    } else {
      setDueDateError("");
    }

    if (!assignedUser) {
      setAssignedUserError("Assigned user cannot be empty");
      hasError = true;
    } else {
      setAssignedUserError("");
    }

    if (hasError) {
      return;
    }

    const selectedDateTime = new Date(dueDate);

    // Round the selectedDateTime to the nearest 15-minute interval
    const roundedMinutes = Math.round(selectedDateTime.getMinutes() / 15) * 15;
    selectedDateTime.setMinutes(roundedMinutes);

    // Editing existing task, check for existing tasks with the same date and time interval
    if (editingTasksId !== null) {
      const existingTask = data.find((task) => {
        const taskDateTime = new Date(task.dueDate);
        return (
          taskDateTime.getTime() === selectedDateTime.getTime() &&
          task.id !== editingTasksId
        );
      });

      if (existingTask) {
        setDueDateError("Task already exists at this time");
        return;
      }

      // Proceed to update the task
      const updatedData = {
        Id: editingTasksId,
        Title: title,
        AssignedUser: assignedUser,
        Content: content,
        DueDate: dueDate,
        Priority: priority,
        Email: localStorage.getItem("loggedEmail"),
        CreatedOn: "",
      };

      const url = `https://localhost:7089/api/Tasks/EditTasks`;
      axios
        .put(url, updatedData)
        .then((result) => {
          const dt = result.data;
          if (dt.statusCode === 200) {
            getData();
            Clear();
            setTaskSaved(true);
            setSavedMessage("Task updated successfully.");
            setTimeout(() => {
              setTaskSaved(false);
              setSavedMessage("");
            }, 2000);
          } else {
            alert(dt.statusMessage);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // Check if there are any tasks with the same date and time interval
      const existingTask = data.find((task) => {
        const taskDateTime = new Date(task.dueDate);
        return taskDateTime.getTime() === selectedDateTime.getTime();
      });

      if (existingTask) {
        setDueDateError("Task already exists at this time");
        return;
      }

      // Proceed to save the task
      const newData = {
        Title: title,
        AssignedUser: assignedUser,
        Content: content,
        DueDate: dueDate,
        Priority: priority,
        Email: localStorage.getItem("loggedEmail"),
        CreatedOn: "",
      };

      const url = `https://localhost:7089/api/Tasks/AddTasks`;
      axios
        .post(url, newData)
        .then((result) => {
          const dt = result.data;
          if (dt.statusCode === 200) {
            getData();
            Clear();
            setTaskSaved(true);
            setSavedMessage("Task saved successfully.");
            setTimeout(() => {
              setTaskSaved(false);
              setSavedMessage("");
            }, 2000);
          } else {
            alert(dt.statusMessage);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // Function to handle task deletion
  const handleDelete = (id) => {
    const url = `https://localhost:7089/api/Tasks/DeleteTasks/${id}`;
    axios
      .delete(url)
      .then((result) => {
        const dt = result.data;
        if (dt.statusCode === 200) {
          setTasksDeleted(true); // Set tasksDeleted to true when tasks is deleted
          setTimeout(() => {
            setTasksDeleted(false); // Reset tasksDeleted after a short delay
            getData();
          }, 2000); // Adjust the delay as needed
        } else {
          alert(dt.statusMessage);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Function to handle task editing
  const handleEdit = (id) => {
    const tasksToEdit = data.find((tasks) => tasks.id === id);
    setTitle(tasksToEdit.title);
    setAssignedUser(tasksToEdit.assignedUser);
    setContent(tasksToEdit.content);
    setDueDate(tasksToEdit.dueDate);
    setPriority(tasksToEdit.priority);
    setEditingTasksId(id);
  };

  // Function to clear task details
  const Clear = () => {
    setTitle("");
    setAssignedUser("");
    setContent("");
    setDueDate("");
    setPriority("Low");
    setEditingTasksId(null);
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

  // Function to scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Function to handle due date change
  const handleDueDateChange = (e) => {
    // Convert the selected date and time to the user's local time zone
    const selectedDateTime = new Date(e.target.value);
    const userOffset = selectedDateTime.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localDateTime = new Date(selectedDateTime.getTime() - userOffset);

    // Round the minutes to the nearest 15-minute interval
    let minutes = localDateTime.getHours() * 60 + localDateTime.getMinutes();
    const roundedMinutes = Math.round(minutes / 15) * 15;

    // Convert the rounded minutes back to hours and minutes
    const roundedHours = Math.floor(roundedMinutes / 60);
    const roundedMins = roundedMinutes % 60;

    // Set the rounded time to the selected date
    localDateTime.setHours(roundedHours, roundedMins);

    // Update the state with the adjusted date and time
    setDueDate(localDateTime.toISOString().slice(0, 16));
  };

  // Function to get minimum date and time for due date selection
  const getMinimumDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = Math.ceil(now.getMinutes() / 15) * 15;
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Function to get step value for due date selection
  const getStepValue = () => {
    return "900";
  };

  return (
    <Fragment>
      <AdminHeader />
      <br />

      <form>
        <div
          className="form-row"
          style={{ width: "80%", backgroundColor: "white", margin: " auto" }}
        >
          <div className="form-group col-md-12">
            <h3>{"Add Task"}</h3>
          </div>

          <div className="form-group col-md-12">
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              className={`form-control ${titleError && "is-invalid"}`}
              maxLength={MAX_TITLE_LENGTH}
              required
              value={title}
            />
            {titleError && <div className="invalid-feedback">{titleError}</div>}
            <small>{titleLength} characters remaining</small>
          </div>
          <div className="form-group col-md-12">
            <textarea
              className={`form-control ${contentError && "is-invalid"}`}
              id="validationTextarea"
              placeholder="Enter Content"
              rows={5}
              onChange={(e) => setContent(e.target.value)}
              maxLength={MAX_CONTENT_LENGTH}
              required
              value={content}
            ></textarea>
            {contentError && (
              <div className="invalid-feedback">{contentError}</div>
            )}
            <small>{contentLength} characters remaining</small>
          </div>

          <div
            className="form-row"
            style={{ width: "100%", backgroundColor: "white", margin: "auto" }}
          >
            <div className="form-group col-md-6">
              <label htmlFor="dueDate">Due Date and Time:</label>
              <input
                type="datetime-local"
                id="dueDate"
                className={`form-control ${dueDateError && "is-invalid"}`}
                onChange={(e) => handleDueDateChange(e)}
                value={dueDate}
                min={getMinimumDateTime()}
                step={getStepValue()}
              />
              {dueDateError && (
                <div className="invalid-feedback">{dueDateError}</div>
              )}
            </div>

            <div className="form-group col-md-6">
              <label htmlFor="assignedUser">Assigned User:</label>
              <select
                id="assignedUser"
                className={`form-control ${assignedUserError && "is-invalid"}`}
                value={assignedUser}
                onChange={(e) => setAssignedUser(e.target.value)}
              >
                <option value="" disabled>
                  Select an approved user
                </option>
                {approvedUsers.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {assignedUserError && (
                <div className="invalid-feedback">{assignedUserError}</div>
              )}
            </div>
          </div>

          <div className="form-group col-md-12 text-center">
            <div style={{ display: "inline-block" }}>
              <button
                className="btn btn-dark"
                style={{ width: "150px", marginRight: "10px" }}
                onClick={(e) => handleSave(e)}
              >
                {"Save"}
              </button>
              <button
                className="btn btn-dark"
                style={{ width: "150px" }}
                onClick={(e) => Clear(e)}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </form>
      <br />
      {taskSaved && (
        <div className="text-center">
          <p style={{ color: "green", fontSize: "1.5em" }}>{savedMessage}</p>
        </div>
      )}
      {tasksDeleted && (
        <div className="text-center">
          <p style={{ color: "red", fontSize: "1.5em" }}>
            Task deleted successfully.
          </p>
        </div>
      )}
      <br />
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
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((val, index) => (
              <tr
                key={index}
                style={{ verticalAlign: "middle", marginBottom: "250px" }}
              >
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
                  <div>
                    <button
                      className="btn btn-dark"
                      onClick={() => handleEdit(val.id)}
                      style={{ marginBottom: "5px", width: "80%" }}
                    >
                      Edit
                    </button>
                  </div>
                  <div>
                    <button
                      className="btn btn-dark"
                      onClick={() => handleDelete(val.id)}
                      style={{ marginBottom: "5px", width: "80%" }}
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
      <Footer />
    </Fragment>
  );
}
