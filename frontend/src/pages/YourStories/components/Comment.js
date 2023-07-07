import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useModal } from "react-hooks-use-modal";

import Input from "../../../shared/components/Input/Input";
import { edit_comment_validation } from "../../../util/inputValidation";
import { DUMMY_BLOGS, DUMMY_COMMENTS, DUMMY_USERS } from "../../../DummyData";
import "./Comment.css";
import Button from "../../../shared/components/UIElements/Button";
import Confirmation from "../../../shared/components/UIElements/Confirmation";

const Comment = (props) => {
  const navigate = useNavigate();
  const methods = useForm();
  const [editMode, setEditMode] = useState(false);
  const commentData = DUMMY_COMMENTS.find((comment) => comment.id === props.id);
  const commentDataIndex = DUMMY_COMMENTS.findIndex(
    (comment) => comment.id === props.id
  );
  const userData = DUMMY_USERS.find((user) => user.id === commentData.userId);

  const [Modal, open, close] = useModal("root", {
    preventScroll: true,
    focusTrapOptions: {
      clickOutsideDeactivates: false,
    },
  });

  const setEditModeHandler = () => {
    if (editMode) {
      methods.reset();
      setEditMode(false);
      return;
    }
    setEditMode(true);
  };

  const deleteCommentHandler = () => {
    // First delete the comment in the Comments array
    DUMMY_COMMENTS.splice(commentDataIndex, 1);

    // Next delete the reference to the comment in the Blog array
    let blogIndex = DUMMY_BLOGS.findIndex((blog) => blog.id === props.blogId);
    let commentIndexInBlog = DUMMY_BLOGS[blogIndex].commentsIds.findIndex(
      (i) => i === commentData.id
    );
    DUMMY_BLOGS[blogIndex].commentsIds.splice(commentIndexInBlog, 1);
    
    navigate(`/stories/${commentData.blogId}`);
  };

  const submitHandler = (data, e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    DUMMY_COMMENTS[commentDataIndex].text = formJson.commentText;
    setEditMode(false);
    methods.reset();
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
          <div className="comment-form__header">
            <Button danger={true} onClick={setEditModeHandler}>
              Cancel
            </Button>
            <Button danger={true} onClick={open}>
              Delete
            </Button>
          </div>
          <Modal>
            <Confirmation
              message="Are you sure you want to delete this comment?"
              yesButtonHandler={deleteCommentHandler}
              noButtonHandler={close}
            />
          </Modal>
          <form
            className="comment-form"
            onSubmit={methods.handleSubmit(submitHandler)}
          >
            <Input
              {...edit_comment_validation}
              defaultValue={commentData.text}
            />
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
