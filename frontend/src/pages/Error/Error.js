import React from "react";
import { useLocation } from "react-router-dom";

export default function Error() {
  const location = useLocation();
  const message = location.state.message;
  const code = location.state.code;

  return (
    <div>
      <h2>
        Error {code}: {message}
      </h2>
    </div>
  );
}
