import React from "react";

import { DUMMY_COMMENTS, DUMMY_BLOGS } from "../../../DummyData";
import "./NewComment.css";

const NewComment = (props) => {
  const addCommentToBlog = (commentId) => {
    const blogIndex = DUMMY_BLOGS.findIndex(blog => blog.id === props.blogId);
    DUMMY_BLOGS[blogIndex].commentsIds.push(commentId);
  };

  const cancelButtonHandler = (e) => {
    e.preventDefault();
    props.setVisible();
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    const newComment = {
      id: Math.floor(Math.random() * 10000),
      date: new Date(),
      userId: props.userId,
      blogId: props.blogId,
      text: formJson.commentText,
    };

    DUMMY_COMMENTS.push(newComment);
    addCommentToBlog(newComment.id);

    props.setVisible();
  };

  return (
    <form className="new-comment-form" onSubmit={submitHandler}>
      <label className="new-comment-label" htmlFor="commentText">New Comment: </label>
      <textarea className="new-comment-text" name="commentText"></textarea>
      <div>
        <button className="new-comment-button__cancel" onClick={cancelButtonHandler}>Cancel</button>
        <button className="new-comment-button__submit" type="submit">Submit</button>
      </div>
    </form>
  );
};

export default NewComment;
