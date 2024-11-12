import React, { useState, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";

import { firebaseAuth } from "../../firebase";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  confirmPasswordReset,
  updateProfile,
} from "firebase/auth";
import Input from "../../shared/components/Input/Input";
import Button from "../../shared/components/UIElements/Button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./Auth.css";

import {
  email_validation,
  password_validation,
} from "../../util/inputValidation";

type FormData = {
  username: string;
  email: string;
  password: string;
};

export default function SignupAndResetPassword() {
  const [resetMode, setResetMode] = useState(false);
  const { sendRequest } = useHttpClient();
  const location = useLocation();
  const navigate = useNavigate();
  const methods = useForm<FormData>();

  useEffect(() => {
    if (location.state !== null) {
      setResetMode(true);
    }
  }, [location.state]);

  const submitHandler: SubmitHandler<FormData> = async (data, event) => {
    event?.preventDefault();

    // This is the submit to firebase flow if the user is resetting their password
    if (resetMode) {
      const newPassword = data.password;

      try {
        await confirmPasswordReset(
          firebaseAuth,
          location.state.code,
          newPassword
        );
        methods.reset();
        navigate("/login", {
          state: {
            message: "Password reset successful, you may now login in again.",
          },
        });
      } catch (error) {
        let errorCode = "500";
        let errorMessage = "Something went wrong. Please try again later.";
        if (error instanceof FirebaseError) {
          errorCode = error.code;
          errorMessage = error.message;
        }
        navigate("/error", {
          state: {
            code: errorCode,
            message: errorMessage,
          },
        });
      }
      return;
    }

    // this is the submit flow if the user is creating a new account.
    try {
      const newUser = {
        email: data.email,
        password: data.password,
      };

      const firebaseResponse = await createUserWithEmailAndPassword(
        firebaseAuth,
        newUser.email,
        newUser.password
      );

      const user = firebaseResponse.user;

      const reqData = {
        id: user.uid,
        email: user.email,
      };

      const resData = await sendRequest(
        "/api/signup",
        "POST",
        JSON.stringify(reqData),
        { "Content-Type": "application/json" }
      );

      // update firebase with the username generated
      await updateProfile(user, {displayName: resData.username})

      methods.reset();
      if (firebaseAuth.currentUser) {
        await sendEmailVerification(firebaseAuth.currentUser);
        navigate("/verify-email", {
          state: { email: firebaseAuth.currentUser.email },
        });
      } else throw new Error("no user found");
    } catch (error) {
      let errorCode = "500";
      let errorMessage = "Something went wrong. Please try again.";
      if (error instanceof FirebaseError) {
        errorCode = error.code;
        errorMessage = error.message;
      }
      navigate("/error", {
        state: {
          code: errorCode,
          message: errorMessage,
        },
      });
    }
  };

  return (
    <div className="auth-container">
      <h2>{resetMode ? "Reset Password" : "Sign Up"}</h2>
      <FormProvider {...methods}>
        <form
          className="login-form"
          onSubmit={methods.handleSubmit(submitHandler)}
        >
          {!resetMode && (
            <>
              <Input {...email_validation} />
            </>
          )}
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
}
