import React from "react";

import "./NewBlog.css";

const NewBlog = () => {
  return (
    <div className="new-blog">
      <h2>New Story</h2>
      <form className="new-blog-form">
        <label htmlFor="blog-title">Title: </label>
        <input name="blog-title" type="text" />
        <label htmlFor="blog-text">Story: </label>
        <textarea name="blog-text"></textarea>
        <button type="submit">Share</button>
      </form>
    </div>
  );
};

export default NewBlog;
