import React from "react";
import spinner from "../assets/spinner.svg";
import pulse from "../assets/pulse.svg";
import Loading from "../styles/Loading.scss";

export default function Loader() {
  return (
    <div className="register-body">
      <div className="loading-container">
        <img src={pulse} alt="loading" />
      </div>
    </div>
  );
}
