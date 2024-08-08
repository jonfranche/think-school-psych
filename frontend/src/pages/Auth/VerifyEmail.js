import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, sendEmailVerification } from "firebase/auth";
import Button from "../../shared/components/UIElements/Button";

export default function Email() {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const reVerify = location.state.reVerify;
  const email = location.state.email;

  async function sendVerifcationButtonHandler() {
    try {
      await sendEmailVerification(auth.currentUser);
      navigate("/verify-email", {
        state: { email: auth.currentUser.email },
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
      {!reVerify && (
        <>
          <h2>Account Successfully Made!</h2>
          <p>
            A verification email has been sent to {email}. Please open it to
            verify your account. If it does not appear in your Inbox, please
            check your Spam folder.
          </p>
        </>
      )}
      {reVerify && (
        <>
          <h2>Please verify your email</h2>
          <p>
            You have not yet verified your email.{" "}
            <Button reverify={true} onClick={sendVerifcationButtonHandler}>
              Click this link to send a verifcation to the email address:{" "}
              {email}.
            </Button> If it does not appear in your Inbox, please check your Spam
            folder.
          </p>
        </>
      )}
    </div>
  );
}
