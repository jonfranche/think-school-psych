import React from "react";

import { useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import Input from "../../shared/components/Input/Input";

import {
  blog_text_validation,
  blog_title_validation,
} from "../../util/inputValidation";
import { DUMMY_BLOGS } from "../../DummyData";
import "./NewBlog.css";

const NewBlog = () => {
  const methods = useForm();
  const navigate = useNavigate();

  const cancelButtonHandler = () => {
    navigate("/stories");
  };

  const submitHandler = (data, event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    const newBlog = {
      id: Math.floor(Math.random() * 10000),
      date: new Date(),
      userId: 1,
      commentsIds: [],
      title: formJson.blogTitle,
      text: formJson.blogText,
    };

    DUMMY_BLOGS.push(newBlog);
    console.log(DUMMY_BLOGS);
    navigate("/stories");
  };

  return (
    <div className="new-blog">
      <h2>New Story</h2>
      <button className="blog-delete-button" onClick={cancelButtonHandler}>
        Cancel
      </button>
      <FormProvider {...methods}>
        <form className="blog-form" onSubmit={methods.handleSubmit(submitHandler)}>
          <Input {...blog_title_validation} className="blog-title-input" />
          <Input {...blog_text_validation} className="blog-text-input" />
          {/* <label htmlFor="blogTitle">Title: </label>
          <input className="blog-title-input" name="blogTitle" type="text" />
          <label htmlFor="blogText">Story: </label>
          <textarea className="blog-text-input" name="blogText"></textarea> */}
          <button type="submit">Share</button>
        </form>
      </FormProvider>
    </div>
  );
};

export default NewBlog;
