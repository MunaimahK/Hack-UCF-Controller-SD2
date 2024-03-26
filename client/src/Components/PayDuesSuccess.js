import React, { useState } from "react";
import Navbar from "./Navbar.js";
import axios from "axios";

const PayDues = () => {
  const [paid, setPaid] = useState(false);
  const paidDues = false;
  const headers = {
    headers: {
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin:": "http://localhost:3003",
    },
  };
  const createSession = async (req, res) => {
    axios.defaults.withCredentials = true;
    try {
      /*
      const data = await fetch(
        "http://localhost:8001/create-checkout-session",
        {
          method: "POST",
          headers: headers,
        }
      ).then((res) => {
        console.log(res.data.msg);
      });*/

      const data = axios
        .get("http://localhost:8001/create-checkout-session", {
          headers: {
            "Content-Type": "application/json",
            // "Access-Control-Allow-Origin:": "http://localhost:3003",
          },
        })
        .then((res) => {
          console.log(res.data.msg);
          window.location.replace(res.data.msg);
          // if success_url, then update paidDues to true
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="W">
      <Navbar />
      <div>
        {!paid ? (
          <div>
            <p>
              {" "}
              As a member of Hack@UCF, you must pay your dues.<br></br>{" "}
              <br></br>You will be navigated to a Stripe session.
            </p>
            <button
              onClick={
                createSession /*
                () => {
                  setPaid(true);
                }*/
              }
            >
              Pay Dues!
            </button>
          </div>
        ) : (
          <div>You've paid your dues!</div>
        )}
      </div>
    </div>
  );
};

export default PayDues;
