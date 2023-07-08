import React, { useContext } from "react";

import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";
import Input from "../../shared/components/Input/Input";
import Button from "../../shared/components/UIElements/Button";
import {
  email_validation,
  password_validation,
} from "../../util/inputValidation";

import "./Auth.css";

const Auth = (props) => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const methods = useForm();

  const submitHandler = (data, e) => {
    e.preventDefault();
    console.log(data);
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
    methods.reset();
    auth.login();
    // add success message here
    setTimeout(function () {
      // function code goes here
      navigate("/");
    }, 1000);
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <FormProvider {...methods}>
        <form
          className="login-form"
          noValidate
          autoComplete="off"
          onSubmit={methods.handleSubmit(submitHandler)}
        >
          <div className="login-form__inputs">
            <Input {...email_validation} />
            <Input {...password_validation} />
          </div>
          <Button submit={true} type="submit">
            Submit
          </Button>
        </form>
      </FormProvider>
      <Button link={true} to="/signup" className="signup-button">Create A New Account</Button> 
    </div>
  );
};

export default Auth;
