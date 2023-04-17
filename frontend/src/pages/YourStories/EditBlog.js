import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Comment from "./Comment";
import { DUMMY_BLOGS, DUMMY_USERS } from "../../DummyData";

import "./EditBlog.css";

const EditBlog = () => {
  let { id } = useParams();
  // convert id param to be a number
  id = Number(id);

  const blogData = DUMMY_BLOGS.find((blog) => blog.id === id);
  console.log(blogData);
  useEffect(() => {
    console.log(`/stories/${id}`);
  }, [id]);

  const getAuthor = () => {
    const author = DUMMY_USERS.filter((user) => user.id === blogData.userId);
    return author[0].name;
  };

  return (
    // TODO: rewrite this component into a form
    <div className="edit-blog">
      <h3>Editing: {blogData.title}</h3>
      <form className="edit-blog-form">
        <label htmlFor="blog-title">Change Title:</label>
        <input id="blog-title" type="text" name="blog-title"/>
        <label htmlFor="blog-text">Change Text:</label>
        <textarea id="blog-text" type="textbox" name="blog-text">{blogData.text}</textarea>
        <div></div>
      </form>
    </div>

    // <div className="full-blog">
    //   <div className="full-blog-header">
    //     <h3>Editing: {blogData.title}</h3>
    //     <div className="full-blog-header-sub-title">
    //       <span>{"by " + getAuthor()}</span>
    //       <span>{" " + blogData.date.toLocaleDateString()}</span>
    //     </div>
    //   </div>
    //   <div className="full-blog-body">
    //     <p>{blogData.text}</p>
    //   </div>
    //   <div className="full-blog-footer">
    //     <span>
    //       {blogData.commentsIds.length + " Comments"}
    //     </span>
    //     <button className="full-blog-footer__add-comment">
    //       Syb
    //     </button>
    //   </div>
    //   <div className="comments" id="comment-section">
    //     {blogData.commentsIds.map((comment) => (
    //       <Comment key={comment} id={comment} />
    //     ))}
    //   </div>
    // </div>
  );
};

export default EditBlog;
