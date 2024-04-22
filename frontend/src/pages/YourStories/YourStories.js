import React, { useState, useEffect } from "react";

import Blog from "./components/Blog";
import Button from "../../shared/components/UIElements/Button";

import "./YourStories.css";

const YourStories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = () => {
      return fetch("/api/stories", { method: "GET" })
        .then((response) => {
          const respData = response.json();
          return respData;
        })
        .then((response) => {
          setData(response);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    setTimeout(() => {
      getData();
      setLoading(true);
    }, 1000);
  }, []);

  return (
    <React.Fragment>
      <div className="your-stories">
        <h2>Your Stories</h2>
        <Button link={true} to="new">
          Share Your Story
        </Button>
        {!loading && <h4>Loading...</h4>}
        {loading && data.length === 0 && (
          <p>No stories yet. Consider sharing your own!</p>
        )}
        {loading && (
          <div className="your-stories-blogs">
            {data.map((blog) => (
              <Blog
                key={blog.id}
                id={blog.id}
                date={blog.date}
                userID={blog.userID}
                username={blog.username}
                title={blog.title}
                text={blog.text}
                commentAmount={blog.commentAmount}
              />
            ))}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default YourStories;
