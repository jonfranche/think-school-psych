import React from "react";

import { DUMMY_COMMENTS, DUMMY_BLOGS } from "../../DummyData";

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
    <form onSubmit={submitHandler}>
      <label htmlFor="commentText">New Comment: </label>
      <textarea name="commentText"></textarea>
      <button onClick={cancelButtonHandler}>Cancel</button>
      <button type="submit">Submit</button>
    </form>
  );
};

export default NewComment;
