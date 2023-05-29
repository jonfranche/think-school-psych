import React from "react";

import "./Input.css";

const Input = (props) => {
  const input = <input className="input-text" type={props.type} name={props.name}/>;
  return (
    <div>
      <label htmlFor={props.htmlFor}>{props.label}: </label>
      {input}
    </div>
  );
};

export default Input;
