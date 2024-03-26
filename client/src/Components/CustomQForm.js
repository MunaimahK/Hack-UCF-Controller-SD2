import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import "./CustomQForm.css";
import AdminNavbar from "./AdminNavbar";

// thsi fiel essentially should be on Main Server as Pop Up
const CustomQForm = () => {
  const [currentQ, setCurrentQ] = useState([]);
  const [data, setData] = useState({
    q: "",
  });

  const event = useEffect(() => {
    axios
      .get("/display-custom-questions")
      .then((res) => {
        console.log("CQ RETURNED", res.data.customquestion);
        setCurrentQ(res.data.customquestion);
      })
      .catch((err) => console.log(err));
  }, []);

  const addToCQList = async (req, res) => {
    console.log("HERE");
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const { q } = data;
    console.log("Q", q);
    try {
      const ep = await axios
        .get("/update-custom-questions", {
          params: { q },
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  const removeQ = async (name, req, res) => {
    console.log("REMOVED");
    //  const qName = name;
    const qID = name;
    console.log(qID);
    try {
      const ep = await axios
        .get("/remove-question", {
          params: { qID },
        })
        .then((res) => {
          console.log("IN DELETE", res.data.customquestion);

          setCurrentQ(res.data.customquestion);
        })
        .catch((err) => console.log(err));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <AdminNavbar />

      <h1>Add a Question to the Current Custom Question Form</h1>
      <div className="dynamic-output-q">
        {currentQ.map((output) => (
          <div>
            <li id="h1-d">
              {output.question}
              <button onClick={() => removeQ(output._id)} className="remove">
                X
              </button>
            </li>
          </div>
        ))}
      </div>
      <br></br>
      <form onSubmit={addToCQList}>
        <div id="add-q-wrapper">
          <label id="l">Question to Add</label>
          <br></br>
          <input
            id="i"
            placeholder="Enter the Question You'd like to add"
            value={data.q || ""}
            onChange={(e) => setData({ ...data, q: e.target.value })}
          ></input>
          <br></br>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CustomQForm;
