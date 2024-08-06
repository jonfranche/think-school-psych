import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { firebaseAuth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
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

  const submitHandler = async (data, e) => {
    e.preventDefault();
    try {
      const newUser = {
        username: data.username,
        email: data.email,
        password: data.password,
      };

      const user = await createUserWithEmailAndPassword(
        firebaseAuth,
        newUser.email,
        newUser.password
      )
        .then((userCredential) => {
          const user = userCredential.user;
          return user;
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(`${errorCode} + ${errorMessage}`);
        });

      const reqData = {
        username: newUser.username,
        id: user.uid,
        email: user.email,
      };

      const responseData = await fetch("/api/signup", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      });

      methods.reset();
      navigate("/");
    } catch (err) {}
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
