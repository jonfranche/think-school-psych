import React from "react";

import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import Input from "../../shared/components/Input/Input";
import Button from "../../shared/components/UIElements/Button";
import { useAuth } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import {
  blog_text_validation,
  blog_title_validation,
} from "../../util/inputValidation";
import "./NewBlog.css";

const NewBlog = () => {
  const { currentUser } = useAuth();
  const { sendRequest } = useHttpClient();
  const methods = useForm();
  const navigate = useNavigate();

  const cancelButtonHandler = () => {
    navigate("/stories");
  };

  const submitHandler = async (data, event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    const newBlog = {
      title: formJson.blogTitle,
      text: formJson.blogText,
    };

    let reqData = JSON.stringify(newBlog);

    try {
      const response = await sendRequest(
        `/api/stories/new/${currentUser.uid}`,
        "POST",
        reqData,
        {
          Authorization: "Bearer " + currentUser.accessToken,
        }
      );
    } catch (err) {}

    setTimeout(function () {
      navigate("/stories");
    }, 1000);
  };

  return (
    <div className="new-blog">
      <h2>New Story</h2>
      <button className="blog-delete-button" onClick={cancelButtonHandler}>
        Cancel
      </button>
      <FormProvider {...methods}>
        <form
          className="blog-form"
          onSubmit={methods.handleSubmit(submitHandler)}
        >
          <Input {...blog_title_validation} className="blog-title-input" />
          <Input {...blog_text_validation} className="blog-text-input" />
          <Button type="submit" submit={true}>
            Share
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

export default NewBlog;
