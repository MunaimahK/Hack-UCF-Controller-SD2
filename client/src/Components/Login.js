import React from "react";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Navbar from "./Navbar";

const Login = () => {
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const loginUser = async (e) => {
    const headers = {
      "Content-Type": "application/json;charset=UTF-8",
      "Access-Control-Allow-Origin:": "http://localhost:3000",
    };
    axios.defaults.withCredentials = true;
    e.preventDefault();

    const { username, password } = data;
    try {
      const { data } = await axios
        .post(
          "http://localhost:8001/login",
          {
            username,
            password,
          },
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        )
        .then((res) => {
          if (res.data.error) {
            console.log(res.data.error);
          } else {
            setData({});
            console.log("Success!");
            toast.success("Welcome!");
            navigate("/admin", { replace: true });
          }
        });
      /*
      if (data.error) {
        toast.error(data.error);
      } else {
        setData({});
        console.log("Success!");
        toast.success("Welcome!");
        navigate("/admin", { replace: true });
      }*/
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div id="bg">
      <Navbar />
      <form onSubmit={loginUser} className="form-div">
        <div className="entry">
          <div className="e1">
            <label>Username</label>
            <input
              type="text"
              placeholder="Username"
              value={data.username}
              id="in"
              onChange={(e) => setData({ ...data, username: e.target.value })}
            ></input>
          </div>
          <div className="e1">
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={data.password}
              id="in"
              onChange={(e) => setData({ ...data, password: e.target.value })}
            ></input>
          </div>
        </div>
        <div className="e2">
          <button type="submit" className="submit">
            Login!
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;
