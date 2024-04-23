import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Button from "../../shared/components/UIElements/Button";
import Comment from "./components/Comment";
import NewComment from "./components/NewComment";
import { useAuth } from "../../shared/context/auth-context";

import "./FullBlog.css";

const FullBlog = (props) => {
  const [blogData, setBlogData] = useState();
  const [update, setUpdate] = useState(false);
  const [commentData, setCommentData] = useState();
  const [loading, setLoading] = useState(false);
  const [showNewComment, setShowNewComment] = useState(false);
  const { currentUser } = useAuth();
  const navigator = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    const getBlogData = () => {
      return fetch(`/api/stories/${id}`, { method: "GET" })
        .then((response) => {
          const respData = response.json();
          return respData;
        })
        .then((response) => {
          setBlogData(response);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const getComments = () => {
      return fetch(`/api/stories/${id}/comments`, { methods: "GET" })
        .then((response) => {
          const respData = response.json();
          return respData;
        })
        .then((response) => {
          setCommentData(response);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    setTimeout(() => {
      getBlogData();
    }, 1000);

    setTimeout(() => {
      getComments();
      setLoading(true);
    }, 500);

    setUpdate(false);
  }, [update]);

  const addCommentButtonHandler = () => {
    if (currentUser === null) {
      navigator("/login");
    }
    setShowNewComment(!showNewComment);
  };

  const updateHandler = () => {
    setUpdate(true);
  };

  return (
    <React.Fragment>
      {!loading && <h4>Loading...</h4>}
      {blogData && (
        <div className="full-blog">
          <div className="full-blog-header">
            <h3>{blogData.title}</h3>
            <div className="full-blog-header-sub-title">
              <span>{"by " + blogData.username}</span>
              <span>{" " + new Date(blogData.date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="full-blog-body">
            <p>{blogData.text}</p>
          </div>
          <div className="full-blog-footer">
            <span>{commentData.length} Comments</span>
            {currentUser && currentUser.uid === blogData.userID && (
              <Button
                link={true}
                to={`../stories/edit/${id}`}
                state={{ title: blogData.title, text: blogData.text }}
              >
                Edit Story
              </Button>
            )}
            {!showNewComment && (
              <button
                className="full-blog-footer__add-comment"
                onClick={addCommentButtonHandler}
              >
                Add Comment
              </button>
            )}
          </div>
          <div className="comments" id="comment-section">
            {showNewComment && (
              <NewComment
                visible={showNewComment}
                setVisible={addCommentButtonHandler}
                blogId={blogData.id}
                update={updateHandler}
              />
            )}
            {commentData.map((comment) => (
              <Comment
                key={comment.id}
                id={comment.id}
                blogId={comment.storyID}
                userId={comment.userID}
                username={comment.username}
                commentDate={comment.date}
                commentText={comment.text}
                currentUser={currentUser.uid}
                update={updateHandler}
              />
            ))}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default FullBlog;
