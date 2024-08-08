import React, { useState, useEffect } from "react";

import Blog from "./components/Blog";
import Button from "../../shared/components/UIElements/Button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { getAuth } from "firebase/auth";

import "./YourStories.css";

const YourStories = () => {
  const [data, setData] = useState([]);
  const { isLoading, error, sendRequest } = useHttpClient();
  const auth = getAuth();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await sendRequest("/api/stories");
        setData(response);
      } catch (err) {}
    };
    setTimeout(() => {
      getData();
    }, 1000);
  }, []);

  return (
    <React.Fragment>
      <div className="your-stories">
        <h2>Your Stories</h2>
        <Button
          link={true}
          to={auth.currentUser.emailVerified ? "new" : "../verify-email"}
          state={{ reVerify: true, email: auth.currentUser.email }}
        >
          Share Your Story
        </Button>
        {isLoading && <h4>Loading...</h4>}
        {/* {error && <h4>{error}</h4>} */}
        {!isLoading && data.length === 0 && !error && (
          <p>No stories yet. Consider sharing your own!</p>
        )}
        {!isLoading && (
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
