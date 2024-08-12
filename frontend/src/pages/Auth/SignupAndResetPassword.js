import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";

import { firebaseAuth } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  confirmPasswordReset,
} from "firebase/auth";
import Input from "../../shared/components/Input/Input";
import Button from "../../shared/components/UIElements/Button";
import "./Auth.css";

import {
  email_validation,
  username_validation,
  password_validation,
} from "../../util/inputValidation";

export default function SignupAndResetPassword() {
  const [resetMode, setResetMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const methods = useForm();

  useEffect(() => {
    if (location.state !== null) {
      setResetMode(true);
    }
  }, [location.state]);

  async function submitHandler(data, e) {
    e.preventDefault();
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
        const errorCode = error.code;
        const errorMessage = error.message;
        navigate("/error", {
          state: {
            code: errorCode,
            message: errorMessage,
          },
        });
      }
      return;
    }
    try {
      const newUser = {
        username: data.username,
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
        username: newUser.username,
        id: user.uid,
        email: user.email,
      };

      await fetch("/api/signup", {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reqData),
      });

      methods.reset();

      await sendEmailVerification(firebaseAuth.currentUser);
      navigate("/verify-email", {
        state: { email: firebaseAuth.currentUser.email },
      });
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      navigate("/error", {
        state: {
          code: errorCode,
          message: errorMessage,
        },
      });
    }
  }

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
              <Input {...username_validation} />
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
