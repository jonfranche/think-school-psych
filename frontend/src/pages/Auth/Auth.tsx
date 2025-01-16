import React, { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { firebaseAuth } from "../../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import Input from "../../shared/components/Input/Input";
import Button from "../../shared/components/UIElements/Button";
import {
  email_validation,
  password_validation,
} from "../../util/inputValidation";

import "./Auth.css";
import { FirebaseError } from "@firebase/util";

type FormData = {
  email: string;
  password: string;
}

export default function Auth() {
  const [resetMode, setResetMode] = useState(false);
  const navigate = useNavigate();
  const methods = useForm<FormData>();
  const location = useLocation();
  let message;
  if (location.state !== null) {
    message = location.state.message;
  }

  const submitHandler: SubmitHandler<FormData> = async (data, event) => {
    event?.preventDefault();
    try {

      if (resetMode) {
        await sendPasswordResetEmail(firebaseAuth, data.email);
        setTimeout(() => {
          navigate("/reset-link-sent", { state: { email: data.email } });
        }, 1000);

        return;
      }

      await signInWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      );

      methods.reset();
      // add success message here
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      let errorCode = "500";
      let errorMessage = "Something went wrong. Please try again later.";
      if (error instanceof FirebaseError) {
        errorCode = error.code;
        resetMode
          ? (errorMessage = error.message)
          : (errorMessage =
              "Failed to log you in. Please check if your credentials were submitted correctly");
      }
      navigate("/error", {
        state: { code: errorCode, message: errorMessage },
      });
    }
  }

  const resetModeHandler = () => {
    if (!resetMode) {
      setResetMode(true);
      return;
    }
    setResetMode(false);
  };

  return (
    <>
      {!resetMode && (
        <div className="auth-container">
          {location.state !== null && <p>{message}</p>}
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
      )}
      {resetMode && (
        <div className="auth-container">
          <h2>Reset Password</h2>
          <FormProvider {...methods}>
            <form
              className="login-form"
              noValidate
              autoComplete="off"
              onSubmit={methods.handleSubmit(submitHandler)}
            >
              <div className="login-form__inputs">
                <Input {...email_validation} />
              </div>
              <Button submit={true} type="submit">
                Send Reset Password Link
              </Button>
            </form>
          </FormProvider>
        </div>
      )}
      <Button onClick={resetModeHandler} size="reset-password">
        {resetMode ? "Cancel" : "Reset Password"}
      </Button>
    </>
  );
};
