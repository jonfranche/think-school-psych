import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";

import Input from "../../../shared/components/Input/Input";
import { edit_comment_validation } from "../../../util/inputValidation";
import { DUMMY_BLOGS, DUMMY_COMMENTS, DUMMY_USERS } from "../../../DummyData";
import "./Comment.css";
import Button from "../../../shared/components/UIElements/Button";

const Comment = (props) => {
  const methods = useForm();
  const [editMode, setEditMode] = useState(false);
  const commentData = DUMMY_COMMENTS.find((comment) => comment.id === props.id);
  const commentDataIndex = DUMMY_COMMENTS.findIndex(
    (comment) => comment.id === props.id
  );
  const userData = DUMMY_USERS.find((user) => user.id === commentData.userId);

  const setEditModeHandler = () => {
    if (editMode) {
      setEditMode(false);
      return;
    }
    setEditMode(true);
  };

  const deleteCommentHandler = () => {
    DUMMY_COMMENTS.splice(commentDataIndex, 1);
    let blogIndex = DUMMY_BLOGS.findIndex((blog) => blog.id === props.blogId);
    let commentIndexInBlog = DUMMY_BLOGS[blogIndex].commentsIds.findIndex(
      (i) => i === commentData.id
    );
    DUMMY_BLOGS[blogIndex].commentsIds.splice(commentIndexInBlog, 1);
  };

  const submitHandler = (data, e) => {
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
          <Button onClick={setEditModeHandler}>Edit Comment</Button>
        </div>
      )}
      {editMode && (
        <FormProvider {...methods}>
          <form
            className="comment-form"
            onSubmit={methods.handleSubmit(submitHandler)}
          >
            <div className="comment-form__header">
              <Button danger={true} onClick={setEditModeHandler}>
                Cancel
              </Button>
              <Button danger={true} onclick={deleteCommentHandler}>
                Delete
              </Button>
            </div>
            <Input {...edit_comment_validation} />
            <Button type="submit" submit={true}>
              Submit
            </Button>
          </form>
        </FormProvider>
      )}
    </div>
  );
};

export default Comment;
