import React from "react";

const Input = (props) => {
  const input = <input />;
  return (
    <div>
      <label>{props.label}: </label>
      {input}
    </div>
  );
};

export default Input;
