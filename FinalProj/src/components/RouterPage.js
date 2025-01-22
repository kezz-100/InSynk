// Import necessary dependencies and components
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import Login from "./Login";
import Registration from "./Registration";
import UserDashboard from "./UserDashboard";
import Initial from "./Initial";

import RegistrationList from "./RegistrationList";
import Tasks from "./Tasks";
import MyTasks from "./MyTasks";
import AllTasks from "./AllTasks";
import AllTasksAd from "./AllTasksAd";

import ApproveCompletion from "./ApproveCompletion";
import Timeline from "./Timeline";
import TimelineU from "./TimelineU";
import ForgotPassword from "./ForgotPassword";

export default function RouterPage() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        <Route path="/userdashboard" element={<UserDashboard />} />

        <Route path="/admindashboard" element={<AdminDashboard />} />

        <Route path="/registrationlist" element={<RegistrationList />} />

        <Route path="/" element={<Initial />} />

        <Route path="/tasks" element={<Tasks />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/timelineU" element={<TimelineU />} />

        <Route path="/mytasks" element={<MyTasks />} />

        <Route path="/alltasks" element={<AllTasks />} />
        <Route path="/alltasksad" element={<AllTasksAd />} />

        <Route path="/approvecompletion" element={<ApproveCompletion />} />
      </Routes>
    </Router>
  );
}
