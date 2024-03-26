import "./mainpage.css";
import Navbar from "./Navbar";
const Mainpage = (props) => {
  return (
    <div id="main-rso">
      <Navbar title="Hack@UCF" />
      <div className="container">
        <div className="intro">
          <div className="intro-text">
            {props.title}
            <div className="about">
              <p>{props.body}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Mainpage;
