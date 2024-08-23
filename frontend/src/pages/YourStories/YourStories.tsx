import React, { useState, useEffect } from "react";

import Blog, {BlogProps} from "./components/Blog";
import Button from "../../shared/components/UIElements/Button";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { getAuth } from "firebase/auth";

import "./YourStories.css";

const YourStories = () => {
  const [data, setData] = useState([]);
  const { isLoading, sendRequest } = useHttpClient();
  const auth = getAuth();

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await sendRequest("/api/stories");
        console.log(response);
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
        {auth.currentUser !== null && (
          <Button
            link={true}
            to={auth.currentUser.emailVerified ? "new" : "../verify-email"}
            state={{ reVerify: true, email: auth.currentUser.email }}
          >
            Share Your Story
          </Button>
        )}
        {
          auth.currentUser === null && (
            <Button link={true} to="/login" state={{message: "You must log in first before posting a Story"}}>
              Share Your Story
            </Button>
          )
        }
        {isLoading && <h4>Loading...</h4>}
        {!isLoading && data.length === 0 && (
          <p>No stories yet. Consider sharing your own!</p>
        )}
        {!isLoading && (
          <div className="your-stories-blogs">
            {data.map((blog: BlogProps) => (
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
