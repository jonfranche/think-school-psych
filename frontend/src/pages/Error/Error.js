import React from "react";
import { useLocation } from "react-router-dom";

import "./Error.css";

export default function Error() {
  const location = useLocation();
  const message = location.state.message;
  const code = location.state.code;

  return (
    <div className="error-container">
      <h2>Error {code}:</h2>
      <p>{message}</p>
    </div>
  );
}
