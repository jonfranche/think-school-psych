import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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

const Auth = () => {
  const [resetMode, setResetMode] = useState(false);
  const navigate = useNavigate();
  const methods = useForm();

  async function submitHandler(data, e) {
    e.preventDefault();
    try {
      const form = e.target;
      const formData = new FormData(form);
      const formJson = Object.fromEntries(formData.entries());

      if (resetMode) {
        await sendPasswordResetEmail(firebaseAuth, formJson.email);
        setTimeout(() => {
          navigate("/reset-link-sent", { state: { email: formJson.email } });
        }, 1000);

        return;
      }

      await signInWithEmailAndPassword(
        firebaseAuth,
        formJson.email,
        formJson.password
      );

      methods.reset();
      // add success message here
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      const errorCode = error.code;
      let errorMessage;
      resetMode
        ? (errorMessage = error.Message)
        : (errorMessage =
            "Failed to log you in. Please check if your credentials were submitted correctly");
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

export default Auth;
