import React from "react";

import { DUMMY_COMMENTS, DUMMY_USERS } from "../../DummyData";
import "./Comment.css";

const Comment = (props) => {
  const commentData = DUMMY_COMMENTS.find((comment) => comment.id === props.id);
  const userData = DUMMY_USERS.find((user) => user.id === commentData.userId);
  console.log(`props.id = ${props.id}`);
  console.log(commentData);

  return (
    <div className="comment">
      <div className="comment-header">
        <span><b>{userData.name}</b></span>
        <span>{commentData.date.toLocaleDateString()}</span>
      </div>
      <p>{commentData.text}</p>
    </div>
  );
};

export default Comment;
