// Import necessary dependencies and components
import React, { useEffect, useState } from "react";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  DayView,
  WeekView,
  MonthView,
  Toolbar,
  DateNavigator,
  TodayButton,
  Appointments,
} from "@devexpress/dx-react-scheduler-material-ui";
import AdminHeader from "./AdminHeader";
import axios from "axios";
import Footer from "./Footer";

export default function Timeline() {
  const [tasksData, setTasksData] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [approvedUsers, setApprovedUsers] = useState([]);

  useEffect(() => {
    fetchTasksData();
    fetchApprovedUsers();
  }, []);

  const fetchTasksData = () => {
    const url = `https://localhost:7089/api/Tasks/TasksList`;
    axios
      .get(url)
      .then((response) => {
        const data = response.data;
        if (data.statusCode === 200) {
          setTasksData(data.listTasks);
        }
      })
      .catch((error) => {
        console.error("Error fetching tasks data:", error);
      });
  };

  const fetchApprovedUsers = () => {
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
      .then((response) => {
        const data = response.data;
        if (data.statusCode === 200) {
          setApprovedUsers(data.listRegistration);
        }
      })
      .catch((error) => {
        console.error("Error fetching approved users:", error);
      });
  };

  // Convert tasks data to scheduler appointments
  const convertToAppointments = (tasksData, approvedUsers) => {
    return tasksData.map((tasks) => {
      // Find the user object based on the assigned user ID
      const assignedUser = approvedUsers.find(
        (user) => user.id === parseInt(tasks.assignedUser, 10)
      );
      // Extract the email from the user object
      const assignedUserEmail = assignedUser ? assignedUser.email : "";
      return {
        id: tasks.id,
        header: "VIEW", // Only text in appointment
        title: tasks.title,
        startDate: new Date(tasks.dueDate),
        endDate: new Date(tasks.dueDate),
        priority: tasks.priority,
        content: tasks.content,
        assignedUser: assignedUserEmail,
        isCompleted: tasks.isCompleted,
      };
    });
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const schedulerData = convertToAppointments(tasksData, approvedUsers);

  // Function to customize appointment appearance based on priority and due date
  const appointmentStyle = (appointment) => {
    const timeRemaining =
      new Date(appointment.endDate).getTime() - new Date().getTime();
    const weeksRemaining = timeRemaining / (1000 * 60 * 60 * 24 * 7);

    let color;
    if (weeksRemaining <= 1) {
      color = "red";
    } else if (weeksRemaining <= 2) {
      color = "orange";
    } else {
      color = "green";
    }

    return {
      backgroundColor: color,
      width: "100%", // Ensure appointments fill the entire width of the tile
      height: "100%", // Allow height to adjust based on content
      display: "flex",
      flexDirection: "column", // Stack appointments vertically
      justifyContent: "center", // Center appointments vertically
    };
  };

  // Function to handle appointment click
  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  // Function to clear selected appointment
  const clearSelectedAppointment = () => {
    setSelectedAppointment(null);
  };

  return (
    <div>
      <AdminHeader />
      <br />
      <div
        className="form-group col-md-12"
        style={{ width: "80%", backgroundColor: "white", margin: " auto" }}
      >
        <h3>{"Calender"}</h3>
      </div>

      <div
        style={{
          width: "80%",
          margin: "20px auto 0 auto",
          marginBottom: "250px",
        }}
      >
        <Scheduler data={schedulerData}>
          <ViewState />
          <DayView startDayHour={0} endDayHour={24} intervalCount={7} />
          <WeekView startDayHour={0} endDayHour={7} />
          <MonthView />

          <Toolbar />
          <DateNavigator />
          <TodayButton />

          {/* Appointment appearance and click event */}

          <Appointments
            appointmentComponent={({ style, data, onClick }) => (
              <Appointments.Appointment
                style={{ ...style, ...appointmentStyle(data) }}
                onClick={() => handleAppointmentClick(data)}
              >
                <div style={{ fontSize: "22px" }}>VIEW</div>
              </Appointments.Appointment>
            )}
          />
        </Scheduler>
      </div>

      {/* Display appointment details */}
      {selectedAppointment && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            backgroundColor: "white",
            border: "1px solid black",
            zIndex: "999",
          }}
        >
          <p>
            Task Completed: {selectedAppointment.isCompleted ? "Yes" : "No"}
          </p>
          <h3>{selectedAppointment.title}</h3>

          <p>{selectedAppointment.content}</p>
          <p>Assigned User: {selectedAppointment.assignedUser}</p>

          <p>Due Date: {selectedAppointment.endDate.toLocaleString()}</p>

          <button onClick={clearSelectedAppointment}>Close</button>
        </div>
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
    </div>
  );
}
