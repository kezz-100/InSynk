import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import Login from "./Login";
import Registration from "./Registration";
import UserDashboard from "./UserDashboard";

import RegistrationList from "./RegistrationList";
//import TaskList from "./TaskList";
import News from "./News";
//import UserTask from "./UserTask";
import MyNews from "./MyNews";
import AllNews from "./AllNews";
import AllNewsAd from "./AllNewsAd";

import ApproveCompletion from "./ApproveCompletion";
import Timeline from "./Timeline";
import TimelineU from "./TimelineU";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";

//import UserHeader from "./UserHeader"; //?
//import AdminHeader from "./AdminHeader"; // ?
//?
//<Route path="/tasklist" element={<TaskList />} />
//<Route path="/usertask" element={<UserTask />} />

export default function RouterPage() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />

        <Route path="/userdashboard" element={<UserDashboard />} />

        <Route path="/admindashboard" element={<AdminDashboard />} />

        <Route path="/registrationlist" element={<RegistrationList />} />

        <Route path="/news" element={<News />} />
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/timelineU" element={<TimelineU />} />

        <Route path="/mynews" element={<MyNews />} />

        <Route path="/allnews" element={<AllNews />} />
        <Route path="/allnewsad" element={<AllNewsAd />} />

        <Route path="/approvecompletion" element={<ApproveCompletion />} />
      </Routes>
    </Router>
  );
}
