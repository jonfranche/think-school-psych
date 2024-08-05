import { useLocation } from "react-router-dom";

export default function ResetLinkSent(props) {
  const location = useLocation();
  return (
    <div>
      <h2>Link Sent!</h2>
      <p>
        A link was sent to <b>{location.state.email}</b>. Please check the email to reset your
        password.
      </p>
    </div>
  );
}
