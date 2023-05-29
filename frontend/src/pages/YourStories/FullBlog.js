import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Button from "../../shared/components/UIElements/Button";
import Comment from "./components/Comment";
import NewComment from "./components/NewComment";
import { DUMMY_BLOGS, DUMMY_USERS } from "../../DummyData";

import "./FullBlog.css";

const FullBlog = (props) => {
  const [showNewComment, setShowNewComment] = useState(false);
  let { id } = useParams();
  // convert id param to be a number
  id = Number(id);

  const blogData = DUMMY_BLOGS.find((blog) => blog.id === id);
  // console.log(blogData);
  useEffect(() => {
    // console.log(`/stories/${id}`);
  }, [id]);

  const getAuthor = () => {
    const author = DUMMY_USERS.filter((user) => user.id === blogData.userId);
    return author[0].name;
  };

  const addCommentButtonHandler = () => {
    setShowNewComment(!showNewComment);
  };

  return (
    <div className="full-blog">
      <div className="full-blog-header">
        <h3>{blogData.title}</h3>
        <div className="full-blog-header-sub-title">
          <span>{"by " + getAuthor()}</span>
          <span>{" " + blogData.date.toLocaleDateString()}</span>
        </div>
      </div>
      <div className="full-blog-body">
        <p>{blogData.text}</p>
      </div>
      <div className="full-blog-footer">
        <span>{blogData.commentsIds.length + " Comments"}</span>
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
            blogId={id}
            userId={1}
          />
        )}
        {blogData.commentsIds.map((comment) => (
          <Comment key={comment} id={comment} blogId={blogData.id}/>
        ))}
      </div>
    </div>
  );
};

export default FullBlog;
