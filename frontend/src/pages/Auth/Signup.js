import React, { useContext } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../shared/context/auth-context";

import Input from "../../shared/components/Input/Input";
import Button from "../../shared/components/UIElements/Button";
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

  const submitHandler = async (data, e) => {
    e.preventDefault();
    try {
      const newUser = {
        username: data.username,
        email: data.email,
        password: data.password,
      };

      const responseData = await fetch("http://localhost:8010/api/signup", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      methods.reset();
      auth.login(responseData.userId, responseData.token);
      navigate("/");
    } catch (err) {
      // TODO: add error handling for this function
    }
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
