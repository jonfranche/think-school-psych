import React, { useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";

import Comment from "./Comment";
import { DUMMY_BLOGS, DUMMY_USERS } from "../../DummyData";

import "./FullBlog.css";

const FullBlog = () => {
  let { id } = useParams();

  const blogData = DUMMY_BLOGS.find((blog) => blog.id == id);
  console.log(blogData);
  useEffect(() => {
    console.log(`/stories/${id}`);
  }, [id]);

  const getAuthor = () => {
    const author = DUMMY_USERS.filter((user) => user.id === blogData.userId);
    return author[0].name;
  };

  return (
    <div className="full-blog">
      <div className="full-blog-header">
        <h3>{blogData.title}</h3>
        <div className="full-blog-header-sub-title">
          <span>{"by " + getAuthor()}</span>
          <span>{" " + blogData.date.toLocaleDateString()}</span>
        </div>
      </div>
      <div className="full-blog-body">
        <p>{blogData.text}</p>
      </div>
      <div className="full-blog-footer">
        <span>
          {blogData.commentsIds.length + " Comments"}
        </span>
        <button className="full-blog-footer__add-comment">
          Add Comment
        </button>
      </div>
      <div className="comments" id="comment-section">
        {blogData.commentsIds.map((comment) => (
          <Comment key={comment} id={comment} />
        ))}
      </div>
    </div>
  );
};

export default FullBlog;
