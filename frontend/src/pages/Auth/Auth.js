import React, { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import Input from "../../shared/components/Input/Input";
import Button from "../../shared/components/UIElements/Button";

import "./Auth.css";

const Auth = (props) => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const submitHandler = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    auth.login();
    navigate("/");
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form className="login-form" onSubmit={submitHandler}>
        <div className="login-form__inputs">
          <Input label="Email" type="email" htmlFor="email" name="email" />
          <Input
            label="Password"
            type="password"
            htmlFor="password"
            name="password"
          /> 
        </div>
        <Button submit={true} type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Auth;
