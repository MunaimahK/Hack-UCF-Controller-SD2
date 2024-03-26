import React from "react";
import "./Admin.css";
import Navbar from "./Navbar";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import { useNavigate } from "react-router";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  console.log(user);

  // async functions envelope navigation to respective pages
  const event = async (e) => {
    e.preventDefault();

    navigate("/event/create");
  };
  const attendance = async (e) => {
    e.preventDefault();
    navigate("http://localhost:3003/attendance");
  };
  const dues = async (e) => {
    e.preventDefault();
    window.location.replace("http://localhost:3003/dues");
  };
  const QForm = async (e) => {
    e.preventDefault();
    navigate("/customquestion/form");
  };

  const member = async (e) => {
    e.preventDefault();
    navigate("/member/details");
  };
  const logOut = async (e) => {
    axios.defaults.withCredentials = true;
    e.preventDefault();
    try {
      await axios.get("/logout", {}, { withCredentials: true }).then((res) => {
        console.log(res);
        navigate("/login");
      });
    } catch (err) {
      console.log(err);
    }
    // navigate("/admin/login");
  };
  return (
    <div id="main">
      <AdminNavbar />
      <div className="welcome">{!!user && <h1>Hi {user.username}!</h1>}</div>
      <div className="features">
        <br></br>
        <ul>
          <button class="button-17" onClick={event}>
            Create Event
          </button>
          <br></br>
          <button class="button-17" onClick={attendance}>
            Check Attendance
          </button>
          <br></br>
          <button class="button-17" onClick={dues}>
            Check Dues
          </button>
          <br></br>
          <button class="button-17" onClick={QForm}>
            Custom Question Form
          </button>
          <button class="button-17" onClick={member}>
            Member Details
          </button>
          <button class="button-17" onClick={logOut}>
            Log Out
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Admin;
