import React from "react";

const Input = (props) => {
  const input = <input type={props.type} name={props.name}/>;
  return (
    <div>
      <label htmlFor={props.htmlFor}>{props.label}: </label>
      {input}
    </div>
  );
};

export default Input;
