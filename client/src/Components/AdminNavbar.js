import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import { useState } from "react";
import axios from "axios";
const AdminNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const logout = async (req, res) => {
    try {
      const data = await axios.get("/logout");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <nav>
      <Link className="title" to="/">
        UCF | Hack@UCF{" "}
      </Link>
      <div
        className="menu"
        onClick={() => {
          setMenuOpen(!menuOpen);
        }}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className={menuOpen ? "open" : ""}>
        <li>
          <NavLink to="http://localhost:3000/dashboard">Influx</NavLink>
        </li>
        <li>
          <NavLink to="/admin">Admin Home</NavLink>
        </li>
        <li>
          <NavLink to="/" onClick={logout}>
            Logout
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;
