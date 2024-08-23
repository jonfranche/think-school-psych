import React from "react";

import Button from "../../../shared/components/UIElements/Button";
import { useAuth } from "../../../shared/context/auth-context";

import "./Blog.css";

type BlogProps = {
  id: string;
  title: string;
  text: string;
  date: Date;
  username: string;
  userID: string;
  commentAmount: number;
};

export default function Blog({
  id,
  title,
  text,
  date,
  username,
  userID,
  commentAmount,
}: BlogProps) {
  const { currentUser } = useAuth();

  const limitBlog = () => {
    if (text.length > 1000) {
      return text.slice(0, 1000) + "...";
    }
    return text;
  };

  let dateStr = new Date(date).toLocaleDateString();

  return (
    <div className="your-stories-blog">
      <div className="your-stories-blog-header">
        <h3>{title}</h3>
        <div className="your-stories-blog-header-sub-title">
          <span>{"by " + username}</span>
          <span>{" " + dateStr}</span>
        </div>
      </div>
      <div className="your-stories-blog-body">
        <p>{limitBlog()}</p>
      </div>
      <div className="your-stories-blog-footer">
        <Button link={true} to={`/stories/id/${id}#comment-section`}>
          {commentAmount + " Comments"}
        </Button>
        {currentUser && currentUser.uid === userID && (
          <Button
            link={true}
            to={`edit/${id}`}
            state={{ title: title, text: text }}
          >
            Edit Story
          </Button>
        )}
        {text.length > 1000 && (
          <Button link={true} to={`id/${id}`}>
            View Full Story
          </Button>
        )}
      </div>
    </div>
  );
}
