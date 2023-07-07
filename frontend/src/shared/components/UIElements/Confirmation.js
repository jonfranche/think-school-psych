import React from "react";

import Button from "./Button";

import "./Confirmation.css";

const Confirmation = (props) => {
  return (
    <div className="confirmation-modal">
      <p>{props.message}</p>
      <div className="confirmation-modal__buttons">
        <Button submit={true} onClick={props.yesButtonHandler}>
          Yes
        </Button>
        <Button onClick={props.noButtonHandler} danger={true}>
          No
        </Button>
      </div>
    </div>
  );
};

export default Confirmation;
