import React from "react";

import "./Blog.css";

import { DUMMY_USERS } from "../../DummyData";

const Blog = (props) => {
  const getAuthor = () => {
    const author = DUMMY_USERS.filter((user) => user.id === props.userId);
    return author[0].name;
  };

  return (
    <div className="your-stories-blog">
      <div className="your-stories-blog-header">
        <h3>{props.title}</h3>
        <div className="your-stories-blog-header-sub-title">
          <span>{"by " + getAuthor()}</span>
          <span>{" " + props.date.toLocaleDateString()}</span>
        </div>
      </div>
      <div className="your-stories-blog-body">
        <p>{props.text}</p>
      </div>
      <div className="your-stories-blog-footer">
        <span>{props.commentsIds.length + " Comments"}</span>
        <button>Expand</button>
      </div>
    </div>
  );
};

export default Blog;
