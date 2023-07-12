import React, { useContext } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";

import Input from "../../shared/components/Input/Input";
import Button from "../../shared/components/UIElements/Button";

import { DUMMY_USERS } from "../../DummyData";
import "./Auth.css";

import {
  email_validation,
  username_validation,
  password_validation,
} from "../../util/inputValidation";

const Signup = () => {
  const navigate = useNavigate();
  const methods = useForm();
  const auth = useContext(AuthContext);

  const submitHandler = (data, e) => {
    e.preventDefault();

    const newUser = {
      id: Math.floor(Math.random() * 10000),
      joinDate: new Date(),
      name: data.username,
      email: data.email,
      password: data.password,
      isAdmin: false,
    };

    DUMMY_USERS.push(newUser);
    console.log(DUMMY_USERS);
    methods.reset();
    auth.login();
    navigate("/");
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <FormProvider {...methods}>
        <form
          className="login-form"
          onSubmit={methods.handleSubmit(submitHandler)}
        >
          <Input {...email_validation} />
          <Input {...username_validation} />
          <Input {...password_validation} />
          <Input name="confirm-password" label="Confirm Password" />
          <p className="password-rules">Your password must :</p>
          <ul className="password-rules-list">
            <li>Be between 8 to 32 characters long</li>
            <li>Include at least one lowercase letter</li>
            <li>Include at least one uppercase letter</li>
            <li>Include at least one number from 0-9</li>
            <li>Include at least one special character(!@#$%^&*)</li>
          </ul>
          <Button type="submit" submit={true}>
            Submit
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default Signup;
