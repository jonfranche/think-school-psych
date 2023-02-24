import React from "react";

import "./Button.css";

const Button = (props) => {
  if (props.download) {
    return (<a className="download-button" href={props.href} download>{props.children}</a>)
  }
  return <button>{props.children}</button>;
};

export default Button;
