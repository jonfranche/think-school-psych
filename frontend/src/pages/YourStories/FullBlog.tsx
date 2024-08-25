import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Button from "../../shared/components/UIElements/Button";
import Comment from "./components/Comment";
import NewComment from "./components/NewComment";
import { useAuth } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import "./FullBlog.css";

type Blog = {
  id: string;
  title: string;
  text: string;
  date: Date;
  userID: string;
  username: string;
};

type Comment = {
  id: string;
  storyID: string;
  userID: string;
  username: string;
  date: Date;
  text: string;
};

export default function FullBlog() {
  const [blogData, setBlogData] = useState<Blog>();
  const [update, setUpdate] = useState(false);
  const [commentData, setCommentData] = useState<Comment[]>([]);
  const [showNewComment, setShowNewComment] = useState(false);
  const { currentUser } = useAuth();
  const { isLoading, sendRequest } = useHttpClient();
  const navigator = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    async function getBlogData() {
      try {
        const response = await sendRequest(`/api/stories/${id}`);
        setBlogData(response);
      } catch (err) {}
    }

    async function getComments() {
      try {
        const response = await sendRequest(`/api/stories/${id}/comments`);
        setCommentData(response);
      } catch (err) {}
    }

    setTimeout(() => {
      getBlogData();
    }, 1000);

    setTimeout(() => {
      getComments();
    }, 500);

    setUpdate(false);
  }, [update]);

  function addCommentButtonHandler() {
    try {
      if (currentUser && currentUser.emailVerified) {
        setShowNewComment(!showNewComment);
      } else if (currentUser === null)
        throw new Error("You must log in before commenting");
      else if (!currentUser.emailVerified) throw new Error("reverify");
    } catch (err) {
      if (
        err instanceof Error &&
        err.message === "You must log in before commenting"
      ) {
        navigator("/login", { state: { message: err.message } });
      } else if (err instanceof Error && err.message === "reverify") {
        navigator("/verify-email", {
          state: { reVerify: true, email: currentUser?.email },
        });
      }
    }
  }

  function updateHandler() {
    setUpdate(true);
  }

  return (
    <React.Fragment>
      {isLoading && <h4>Loading...</h4>}
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
                currentUserId={currentUser?.uid}
                update={updateHandler}
              />
            ))}
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
