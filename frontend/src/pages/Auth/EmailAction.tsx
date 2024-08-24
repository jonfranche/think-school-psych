import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { firebaseAuth } from "../../firebase";
import { applyActionCode, verifyPasswordResetCode } from "firebase/auth";
import Button from "../../shared/components/UIElements/Button";

export default function EmailAction() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");
  const [verificationFailed, setVerificationFailed] = useState(false);
  const navigate = useNavigate();
  const auth = firebaseAuth;

  useEffect(() => {
    if (searchParams.get("mode") === "verifyEmail") {
      setTitle("Email Verification");
      VerifyEmailHandler();
    } else if (searchParams.get("mode") === "resetPassword") {
      setTitle("Resetting Password");
      ResetPasswordHandler();
    } else {
      navigate("/");
    }
  }, [searchParams.get("mode"), searchParams.get("oobCode")]);

  async function VerifyEmailHandler() {
    try {
      const actionCode = searchParams.get("oobCode");
      if (actionCode) {
        await applyActionCode(auth, actionCode);
        setMessage(
          "Email Verification Successful! Redirecting you to the home page."
        );
        setIsLoading(false);
        setTimeout(() => {
          navigate("/", { replace: true });
        }, 5000);
      } else throw new Error("actionCode is null");
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        setMessage(error.message);
      } else
        setMessage(
          "Code is invalid or expired. Please verify your email address again."
        );
      setVerificationFailed(true);
    }
  }

  async function ResetPasswordHandler() {
    try {
      const actionCode = searchParams.get("oobCode");
      if (actionCode) {
        const accountEmail = await verifyPasswordResetCode(auth, actionCode);
        setIsLoading(false);
        navigate("/reset-password", {
          state: { email: accountEmail, code: actionCode },
        });
      } else throw new Error("actionCode is null");
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        setMessage(error.message);
      } else
        setMessage(
          "Sorry, the period to reset your password has expired. Please go back to the login page to reset your password."
        );
    }
  }

  return (
    <>
      {isLoading && <h2>Loading...</h2>}
      {!isLoading && (
        <div>
          <h2>{title}</h2>
          <p>{message}</p>
          {verificationFailed && auth.currentUser !== null && (
            <Button
              link={true}
              to={"/verify-email"}
              state={{ reVerify: true, email: auth.currentUser.email }}
            >
              Click here to verify.
            </Button>
          )}
          {verificationFailed && auth.currentUser === null && (
            <Button link={true} to="/login">
              Login First to Verify
            </Button>
          )}
        </div>
      )}
    </>
  );
}
