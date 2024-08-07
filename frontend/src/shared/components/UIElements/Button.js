import React from "react";
import { Link } from "react-router-dom";

import "./Button.css";

const Button = (props) => {
  if (props.download) {
    return (
      <button className="download-button" onClick={props.onClick}>
        {props.children}
      </button>
    );
  }

  if (props.link) {
    return (
      <Link
        className="link-button"
        to={props.to}
        path="relative"
        state={props.state}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button
      className={`button button--${props.size || "default"} ${
        props.danger && "button--danger"
      } ${props.submit && "button--submit"}`}
      type={props.type}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
