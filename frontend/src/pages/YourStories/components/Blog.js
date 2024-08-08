import React from "react";

import Button from "../../../shared/components/UIElements/Button";
import { useAuth } from "../../../shared/context/auth-context";

import "./Blog.css";

export default function Blog(props) {
  const { currentUser } = useAuth();

  const limitBlog = () => {
    if (props.text.length > 1000) {
      return props.text.slice(0, 1000) + "...";
    }
    return props.text;
  };

  let date = new Date(props.date).toLocaleDateString();

  return (
    <div className="your-stories-blog">
      <div className="your-stories-blog-header">
        <h3>{props.title}</h3>
        <div className="your-stories-blog-header-sub-title">
          <span>{"by " + props.username}</span>
          <span>{" " + date}</span>
        </div>
      </div>
      <div className="your-stories-blog-body">
        <p>{limitBlog()}</p>
      </div>
      <div className="your-stories-blog-footer">
        <Button link={true} to={`/stories/id/${props.id}#comment-section`}>
          {props.commentAmount + " Comments"}
        </Button>
        {currentUser && currentUser.uid === props.userID && (
          <Button
            link={true}
            to={`edit/${props.id}`}
            state={{ title: props.title, text: props.text }}
          >
            Edit Story
          </Button>
        )}
        {props.text.length > 1000 && (
          <Button link={true} to={`id/${props.id}`}>
            View Full Story
          </Button>
        )}
      </div>
    </div>
  );
}
