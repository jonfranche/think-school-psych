import React, { useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";

import { DUMMY_BLOGS, DUMMY_USERS } from "../../DummyData";
import {
  blog_title_validation,
  blog_text_validation,
} from "../../util/inputValidation";

import "./EditBlog.css";
import Input from "../../shared/components/Input/Input";

const EditBlog = () => {
  const methods = useForm();
  const navigate = useNavigate();
  let { id } = useParams();
  let { state } = useLocation();
  // convert id param to be a number
  id = Number(id);

  const blogData = DUMMY_BLOGS.find((blog) => blog.id === id);
  console.log(blogData);
  useEffect(() => {
    console.log(`/stories/${id}`);
  }, [id]);

  const cancelButtonHandler = () => {
    navigate(`/stories/${id}`);
  };

  const deleteButtonHandler = () => {
    // TODO: add a modal to confirm deletion
    const indexOfEditedBlog = DUMMY_BLOGS.findIndex((blog) => blog.id === id);
    DUMMY_BLOGS.splice(indexOfEditedBlog, 1);
    console.log(DUMMY_BLOGS);
    navigate("/stories");
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    const indexOfEditedBlog = DUMMY_BLOGS.findIndex((blog) => blog.id === id);

    DUMMY_BLOGS[indexOfEditedBlog].title = formJson.blogTitle;
    DUMMY_BLOGS[indexOfEditedBlog].text = formJson.blogText;
    navigate(`/stories/${id}`);
  };

  return (
    <div className="new-blog">
      <h2>Editing Story: {state.title}</h2>
      <div>
        <button className="blog-delete-button" onClick={cancelButtonHandler}>
          Cancel Edit
        </button>
        <button className="blog-delete-button" onClick={deleteButtonHandler}>
          Delete Story
        </button>
      </div>
      <FormProvider {...methods}>
        <form
          className="blog-form"
          onSubmit={methods.handleSubmit(submitHandler)}
        >
          <Input {...blog_title_validation} defaultValue={state.title}/>
          <Input {...blog_text_validation} defaultValue={state.text}/>
          {/* <label htmlFor="blog-title">Title: </label>
          <input
            className="blog-title-input"
            name="blogTitle"
            type="text"
            defaultValue={state.title}
          />
          <label htmlFor="blog-text">Story: </label>
          <textarea
            className="blog-text-input"
            name="blogText"
            defaultValue={state.text}
          ></textarea> */}
          <button type="submit">Share</button>
        </form>
      </FormProvider>
    </div>
  );
};

export default EditBlog;
