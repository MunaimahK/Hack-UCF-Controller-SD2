import React, { useState } from "react";
import Navbar from "./Navbar.js";
import axios from "axios";

const PayDues = () => {
  const [paid, setPaid] = useState(false);

  const headers = {
    headers: {
      "Content-Type": "application/json",
      // "Access-Control-Allow-Origin:": "http://localhost:3003",
    },
  };
  const createSession = async (req, res) => {
    let paidStatus = false;
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
        .get("http://localhost:8000/checkout-session", {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then(async (res) => {
          console.log(res.data.msg);
          console.log("2: ", res.data.msg);
          const red_url = res.data.msg;
          // window.location.replace(res.data.msg);
          try {
            // redirect to payment IF member's paid dues is false
            const check = await axios
              .get("/paid-dues-check")
              .then(async (res) => {
                console.log("RES AFTER CHECK:", res);
                paidStatus = res.data.paidDues;
                setPaid(res.data.paidDues);
                if (!res.data.paidDues) {
                  window.location.replace(red_url);
                  console.log("PRESENT");
                  /*const update = await axios
                    //  .post(`${res.data.msg}`, {
                    .get("http://localhost:8000/paid-dues", {
                      headers: {
                        "Content-Type": "application/json",
                      },
                    })
                    .then((res) => {
                      console.log(res.data);
                    });*/
                }
              });
          } catch (err) {
            console.log(err);
          }
          // setPaid(paidStatus);

          // if success_url, then update paidDues to true
        });
    } catch (err) {
      console.log(err);
    }
    // setPaid(paidStatus);
  };
  return (
    <div className="W">
      <Navbar />
      <div>
        <div>
          <p>
            {" "}
            As a member of Hack@UCF, you must pay your dues.<br></br> <br></br>
            You will be navigated to a Stripe session.
          </p>
          {!paid ? (
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
          ) : (
            <div>You've paid your dues!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PayDues;
