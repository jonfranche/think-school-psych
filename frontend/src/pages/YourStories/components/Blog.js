import React from "react";

import Button from "../../../shared/components/UIElements/Button";

import "./Blog.css";

const Blog = (props) => {
  const limitBlog = () => {
    if (props.text.length > 1000) {
      return props.text.slice(0, 1000) + "...";
    }
    return props.text;
  };

  let date = new Date(props.date).toLocaleDateString()

  return (
    <div className="your-stories-blog">
      <div className="your-stories-blog-header">
        <h3>{props.title}</h3>
        <div className="your-stories-blog-header-sub-title">
          <span>{"by " + props.userId}</span>
          <span>{" " + date}</span>
        </div>
      </div>
      <div className="your-stories-blog-body">
        <p>{limitBlog()}</p>
      </div>
      <div className="your-stories-blog-footer">
        {/* TODO: Uncomment this once comments are implemented in backend
        <Button link={true} to={`${props.id}#comment-section`}>
          {props.commentsIds.length + " Comments"}
        </Button> */}
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
