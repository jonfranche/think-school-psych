import React from "react";

import Button from "../../../shared/components/UIElements/Button";

import "./Blog.css";

import { DUMMY_BLOGS, DUMMY_USERS } from "../../../DummyData";

const Blog = (props) => {
  const getAuthor = () => {
    const author = DUMMY_USERS.filter((user) => user.id === props.userId);
    return author[0].name;
  };

  const limitBlog = () => {
    if (props.text.length > 1000) {
      console.log("LimitBlog called");
      return props.text.slice(0, 1000) + "...";
    }
    return props.text;
  };

  console.log(props.id);

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
        <p>{limitBlog()}</p>
      </div>
      <div className="your-stories-blog-footer">
        <Button link={true} to={`${props.id}#comment-section`}>
          {props.commentsIds.length + " Comments"}
        </Button>
        <Button
          link={true}
          to={`edit/${props.id}`}
          state={{ title: props.title, text: props.text }}
        >
          Edit Story
        </Button>
        {props.text.length > 1000 && (
          <Button link={true} to={`${props.id}`} >
            View Full Story
          </Button>
        )}
      </div>
    </div>
  );
};

export default Blog;
