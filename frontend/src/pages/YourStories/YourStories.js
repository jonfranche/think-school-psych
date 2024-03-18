import React, { useState, useEffect } from "react";

import Blog from "./components/Blog";
import Button from "../../shared/components/UIElements/Button";

import "./YourStories.css";

// import { DUMMY_BLOGS } from "../../DummyData";

const YourStories = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getData = () => {
      return fetch("/api/stories", {"method": "GET"})
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
        {loading && (
          <div className="your-stories-blogs">
            {data.map((blog) => (
              <Blog
                key={blog.id}
                id={blog.id}
                date={blog.date}
                userId={blog.userId}
                title={blog.title}
                text={blog.text}
              />
            ))}
          </div>
        )}
      </div>
    </React.Fragment>
  );
};

export default YourStories;
