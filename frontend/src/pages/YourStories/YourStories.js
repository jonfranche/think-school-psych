import React from "react";

import Blog from "./components/Blog";
import Button from "../../shared/components/UIElements/Button";

import "./YourStories.css";

import { DUMMY_BLOGS } from "../../DummyData";

const YourStories = () => {
  return (
    <React.Fragment>
      <div className="your-stories">
        <h2>Your Stories</h2>
        <Button link={true} to="new">Share Your Story</Button>
        <div className="your-stories-blogs">
          {DUMMY_BLOGS.map((blog) => (
            <Blog
              key={blog.id}
              id={blog.id}
              date={blog.date}
              userId={blog.userId}
              commentsIds={blog.commentsIds}
              title={blog.title}
              text={blog.text}
            />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
};

export default YourStories;
