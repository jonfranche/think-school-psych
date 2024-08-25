import React, { SyntheticEvent } from "react";
import { Link } from "react-router-dom";

import "./Button.css";

type ButtonProps = {
  download?: boolean;
  reverify?: boolean;
  link?: boolean;
  size?: string;
  danger?: boolean;
  submit?: boolean;
  type?: "submit" | "button" | "reset";
  disabled?: boolean;
  onClick?: (() => {}) | ((e: SyntheticEvent<Element, Event>) => void);
  children?: React.ReactNode;
  to?: string;
  state?: {};
  className?: string;
};

function Button({
  download,
  reverify,
  link,
  size,
  danger,
  submit,
  type,
  disabled,
  onClick,
  children,
  to,
  state,
}: ButtonProps) {
  if (download) {
    return (
      <button className="download-button" onClick={onClick}>
        {children}
      </button>
    );
  }

  if (reverify) {
    return (
      <button className="reverify-button" onClick={onClick}>
        {children}
      </button>
    );
  }

  if (link && to) {
    return (
      <Link className="link-button" to={to} state={state}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={`button button--${size || "default"} ${
        danger && "button--danger"
      } ${submit && "button--submit"}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default Button;
