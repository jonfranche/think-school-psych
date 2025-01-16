import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getAuth, sendEmailVerification } from "firebase/auth";
import Button from "../../shared/components/UIElements/Button";

export default function Email() {
  const auth = getAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const reVerify: boolean = location.state.reVerify;
  const email: string = location.state.email;
  const username: string = location.state.username;

  async function sendVerifcationButtonHandler() {
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        navigate("/verify-email", {
          state: { email: auth.currentUser.email },
        });
      } else throw new Error("currentUser is null");
    } catch (error) {
      let errorCode = "500";
      let errorMessage = "An error occurred, please try again later";
      if (error instanceof Error && error.message === "currentUser is null") {
        errorCode = "403";
        errorMessage = "You are not signed in. Please log in.";
      }
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
          <h3>Username Generation</h3>
          <p>
            You have been assigned the username: <b>{username}</b>. In an effort
            to keep all our users' identities anonymous, each is given a
            generated username. If you would like to change your username, a
            username regeneration feature is coming soon
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
            </Button>{" "}
            If it does not appear in your Inbox, please check your Spam folder.
          </p>
        </>
      )}
    </div>
  );
}
