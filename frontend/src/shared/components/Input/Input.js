import React from "react";

import { useFormContext } from "react-hook-form";

import "./Input.css";

const Input = ({ name, label, type, id, validation, placeholder, defaultValue}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const inputError = Object.keys(errors)
    .filter((key) => key.includes(name))
    .reduce((cur, key) => {
      return Object.assign(cur, { error: errors[key] });
    }, {});

  const isInvalid = Object.keys(inputError).length > 0 ? true : false;

  const input = (
    <input
      className="input-text"
      type={type}
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      {...register(name, validation)}
    />
  );

  const textArea = (
    <textarea
      className="input-story"
      name={name}
      placeholder={placeholder}
      defaultValue={defaultValue}
      {...register(name, validation)}
    />
  );

  return (
    <div className="input-container">
      <label htmlFor={name}>{label}: </label>
      {isInvalid && (
        <InputError
          message={inputError.error.message}
          key={inputError.error.message}
        />
      )}
      {type === "textarea" ? textArea : input}
    </div>
  );
};

const InputError = ({ message }) => {
  return <p className="input-error">{message}</p>;
};

export default Input;
