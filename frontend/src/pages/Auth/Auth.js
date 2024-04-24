import React from "react";

import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import Input from "../../shared/components/Input/Input";
import Button from "../../shared/components/UIElements/Button";
import {
  email_validation,
  password_validation,
} from "../../util/inputValidation";

import "./Auth.css";

const Auth = () => {
  const navigate = useNavigate();
  const methods = useForm();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const form = e.target;
      const formData = new FormData(form);
      const formJson = Object.fromEntries(formData.entries());

      signInWithEmailAndPassword(
        firebaseAuth,
        formJson.email,
        formJson.password
      )
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(`${errorCode} + ${errorMessage}`);
        });

      methods.reset();
      // add success message here
      setTimeout(function () {
        // function code goes here
        navigate("/");
      }, 1000);
    } catch (err) {
      console.log(err);
    }
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
      <Button link={true} to="/signup" className="signup-button">
        Create A New Account
      </Button>
    </div>
  );
};

export default Auth;
