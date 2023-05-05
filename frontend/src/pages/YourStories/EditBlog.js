import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import { DUMMY_BLOGS, DUMMY_USERS } from "../../DummyData";

import "./EditBlog.css";

const EditBlog = () => {
  let { id } = useParams();
  let { state } = useLocation();
  // convert id param to be a number
  id = Number(id);

  const blogData = DUMMY_BLOGS.find((blog) => blog.id === id);
  console.log(blogData);
  useEffect(() => {
    console.log(`/stories/${id}`);
  }, [id]);

  const submitHandler = (event) => {
    event.preventDefault();
    // dispatch({type: "create-blog", title: event.target.});
    const form = event.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <div className="new-blog">
      <h2>Editing Story: {state.title}</h2>
      <form className="blog-form" onSubmit={submitHandler}>
        <label htmlFor="blog-title">Title: </label>
        <input className="blog-title-input" name="blog-title" type="text" defaultValue={state.title}/>
        <label htmlFor="blog-text">Story: </label>
        <textarea className="blog-text-input" name="blog-text" defaultValue={state.text}></textarea>
        <button type="submit">Share</button>
      </form>
    </div>
  );
};

export default EditBlog;
