import React from "react";
import "./EventsNew.css";
import Navbar from "./Navbar";
import toast from "react-hot-toast";
import axios from "axios";
import { useState, useEffect } from "react";

const EventsNew = () => {
  return (
    <div>
      <Navbar />
      <div className="events-container">
        <div className="event-box">
          <div className="event-details">
            <div className="event-title">Intro to Computation</div>
            <div className="event-date">Date/Time: March 6, 2024 - 4:30 PM</div>
            <div className="event-description">
              Description: Want to learn more about the field of computer
              science? Join our workshop to learn all about Computer Science
              history, principles, and applications!
            </div>
            <div className="rsvp-buttons">
              <button className="rsvp-yes">RSVP Yes</button>
              <button className="rsvp-no">RSVP No</button>
            </div>
          </div>
        </div>
        <div className="event-box">
          <div className="event-details">
            <div className="event-title">CS1: Data Structures & Algorithms</div>
            <div className="event-date">Date/Time: March 8, 2024 - 4:30 PM</div>
            <div className="event-description">
              Next up in our Hello World workshop series, we will continue to
              build upon the basics and explore additional data structures and
              algorithms!
            </div>
            <div className="rsvp-buttons">
              <button className="rsvp-yes">RSVP Yes</button>
              <button className="rsvp-no">RSVP No</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsNew;
