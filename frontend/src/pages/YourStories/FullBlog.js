import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Button from "../../shared/components/UIElements/Button";
import Comment from "./components/Comment";
import NewComment from "./components/NewComment";

import "./FullBlog.css";

const FullBlog = (props) => {
  const [blogData, setBlogData] = useState();
  const [loading, setLoading] = useState(false);
  const [showNewComment, setShowNewComment] = useState(false);
  let { id } = useParams();
  // convert id param to be a number

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

    setTimeout(() => {
      getBlogData();
      setLoading(true);
    }, 1000);
  }, []);

  const addCommentButtonHandler = () => {
    setShowNewComment(!showNewComment);
  };

  // TODO: add comments amounts to resopnse data

  return (
    <React.Fragment>
      {!loading && <h4>Loading...</h4>}
      {blogData && (
        <div className="full-blog">
          <div className="full-blog-header">
            <h3>{blogData.title}</h3>
            <div className="full-blog-header-sub-title">
              <span>{"by " + blogData.userID}</span>
              <span>{" " + new Date(blogData.date).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="full-blog-body">
            <p>{blogData.text}</p>
          </div>
          <div className="full-blog-footer">
            <span>0 Comments</span>
            <Button
              link={true}
              to={`../stories/edit/${id}`}
              state={{ title: blogData.title, text: blogData.text }}
            >
              Edit Story
            </Button>
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
                userId={blogData.userID}
              />
            )}
            {/* {blogData.commentsIds.map((comment) => (
             <Comment key={comment} id={comment} blogId={blogData.id}/>
           ))} */}
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default FullBlog;

