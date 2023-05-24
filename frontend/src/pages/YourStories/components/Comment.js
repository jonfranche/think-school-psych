import React, { useState } from "react";

import { DUMMY_BLOGS, DUMMY_COMMENTS, DUMMY_USERS } from "../../../DummyData";
import "./Comment.css";

const Comment = (props) => {
  const [editMode, setEditMode] = useState(false);
  const commentData = DUMMY_COMMENTS.find((comment) => comment.id === props.id);
  const commentDataIndex = DUMMY_COMMENTS.findIndex(
    (comment) => comment.id === props.id
  );
  const userData = DUMMY_USERS.find((user) => user.id === commentData.userId);

  const setEditModeHandler = () => {
    setEditMode(true);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setEditMode(false);
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    DUMMY_COMMENTS[commentDataIndex].text = formJson.commentText;
  };

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
          <button className="comment-edit-button" onClick={setEditModeHandler}>
            Edit Comment
          </button>
        </div>
      )}
      {editMode && (
        <form className="comment-form" onSubmit={submitHandler}>
          <button className="comment-form__delete">Cancel</button>
          <textarea
            name="commentText"
            className="comment-form__input"
            defaultValue={commentData.text}
          ></textarea>
          <button className="comment-form__submit" type="submit">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default Comment;
