import React from "react";
import { useNavigate } from "react-router-dom";

import { DUMMY_BLOGS } from "../../DummyData";
import "./NewBlog.css";

const NewBlog = () => {
  const navigate = useNavigate();

  const submitHandler = (event) => {
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
      <form className="new-blog-form" onSubmit={submitHandler}>
        <label htmlFor="blogTitle">Title: </label>
        <input name="blogTitle" type="text" />
        <label htmlFor="blogText">Story: </label>
        <textarea name="blogText"></textarea>
        <button type="submit">Share</button>
      </form>
    </div>
  );
};

export default NewBlog;
