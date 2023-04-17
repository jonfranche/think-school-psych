import React from "react";
import { Link } from "react-router-dom";

import Blog from "./Blog";

import "./YourStories.css";

import { DUMMY_BLOGS } from "../../DummyData";

const YourStories = () => {
  return (
    <React.Fragment>
      <div className="your-stories">
        <h2>Your Stories</h2>
        <Link className="your-stories-share-button" to="new" path="relative">
          Share Your Story
        </Link>
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
