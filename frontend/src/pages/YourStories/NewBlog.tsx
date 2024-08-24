import React from "react";

import { useNavigate } from "react-router-dom";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import Input from "../../shared/components/Input/Input";
import Button from "../../shared/components/UIElements/Button";
import { useAuth } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import {
  blog_text_validation,
  blog_title_validation,
} from "../../util/inputValidation";
import "./NewBlog.css";

type FormData = {
  blogTitle: string;
  blogText: string;
};

const NewBlog = () => {
  const { currentUser } = useAuth();
  const { sendRequest } = useHttpClient();
  const methods = useForm<FormData>();
  const navigate = useNavigate();

  const cancelButtonHandler = () => {
    navigate("/stories");
  };

  const submitHandler: SubmitHandler<FormData> = async (data, event) => {
    event?.preventDefault();
    try {
      const newBlog = {
        title: data.blogTitle,
        text: data.blogText,
      };

      let reqData = JSON.stringify(newBlog);
      if (currentUser) {
        const userIdToken = await currentUser.getIdToken();
        await sendRequest(
          `/api/stories/new/${currentUser.uid}`,
          "POST",
          reqData,
          {
            Authorization: "Bearer " + userIdToken,
          }
        );
      } else throw new Error("You are not logged in.");

      setTimeout(function () {
        navigate("/stories");
      }, 1000);
    } catch (err) {
      if (err instanceof Error) {
        navigate("/error", { state: { code: "403", message: err.message } });
      }
    }
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
