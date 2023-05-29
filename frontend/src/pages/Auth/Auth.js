import React, { useState, useContext } from "react";

import { AuthContext } from "../../shared/context/auth-context";
import Input from "../../shared/components/Input/Input";

const Auth = (props) => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div>
      <h2>Login</h2>
      <Input label="Email" />
      <Input label="Password" />
    </div>
  );
};

export default Auth;
