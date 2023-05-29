import React, { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import Input from "../../shared/components/Input/Input";
import Button from "../../shared/components/UIElements/Button";

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
  }

  return (
    <div>
      <h2>Login</h2>
      <form className="login-form" onSubmit={submitHandler}>
        <Input label="Email" type="email" htmlFor="email" name="email"/>
        <Input label="Password" type="password" htmlFor="password" name="password"/>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default Auth;
