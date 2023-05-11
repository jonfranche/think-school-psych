import React, { useState } from "react";

import { DUMMY_COMMENTS, DUMMY_USERS } from "../../../DummyData";
import "./Comment.css";

const Comment = (props) => {
  const [editMode, setEditMode] = useState(false);
  const commentData = DUMMY_COMMENTS.find((comment) => comment.id === props.id);
  const userData = DUMMY_USERS.find((user) => user.id === commentData.userId);

  const setEditModeHandler = () => {
    setEditMode(true);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setEditMode(false);
    // TODO: Complete submission, maybe use useState to update
    // TODO: Update CSS for edit comment form
  }

  return (
    <div className="comment">
      <div className="comment-header">
        <span>
          <b>{userData.name}</b>
        </span>
        <span>{commentData.date.toLocaleDateString()}</span>
      </div>
      {!editMode && (
        <div className="comment-body">
          <p>{commentData.text}</p>
          <button onClick={setEditModeHandler}>Edit Comment</button>
        </div>
      )}
      {editMode && (
        <form className="comment-form" onSubmit={submitHandler}>
          <button>Delete Comment</button>
          <textarea defaultValue={commentData.text}></textarea>
          <button type="submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default Comment;
