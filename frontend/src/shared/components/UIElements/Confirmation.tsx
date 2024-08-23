import React from "react";

import Button from "./Button";

import "./Confirmation.css";

type ConfirmationProps = {
  message: string;
  yesButtonHandler: () => {};
  noButtonHandler: () => {};
};

function Confirmation({
  message,
  yesButtonHandler,
  noButtonHandler,
}: ConfirmationProps) {
  return (
    <div className="confirmation-modal">
      <p>{message}</p>
      <div className="confirmation-modal__buttons">
        <Button submit={true} onClick={yesButtonHandler}>
          Yes
        </Button>
        <Button onClick={noButtonHandler} danger={true}>
          No
        </Button>
      </div>
    </div>
  );
}

export default Confirmation;
