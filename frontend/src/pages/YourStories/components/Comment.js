import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useModal } from "react-hooks-use-modal";

import Input from "../../../shared/components/Input/Input";
import { edit_comment_validation } from "../../../util/inputValidation";
import "./Comment.css";
import Button from "../../../shared/components/UIElements/Button";
import Confirmation from "../../../shared/components/UIElements/Confirmation";
import { useAuth } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";

const Comment = (props) => {
  const methods = useForm();
  const [editMode, setEditMode] = useState(false);
  const { currentUser } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

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

  const deleteCommentHandler = async () => {
    const response = await sendRequest(
      `/api/stories/comment/${props.id}`,
      "DELETE",
      null,
      {
        Authorization: "Bearer " + currentUser.accessToken,
      }
    );

    // TODO: make modal message for this
    console.log(response);
    close();
    props.update();
  };

  const submitHandler = async (data, e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    const editedComment = {
      userId: props.currentUser,
      text: formJson.comment,
    };

    const reqData = JSON.stringify(editedComment);

    const response = await sendRequest(
      `/api/stories/comment/${props.id}`,
      "PATCH",
      reqData,
      {
        Authorization: "Bearer " + currentUser.accessToken,
      }
    );

    // TODO: make modal message for this
    console.log(response);
    setEditMode(false);
    methods.reset();
    props.update();
  };

  let date = new Date(props.commentDate).toLocaleDateString();

  return (
    <div className="comment">
      <div className="comment-header">
        <span>
          <b>{props.username}</b>
        </span>
        <span>{date}</span>
      </div>
      {!editMode && (
        <div className="comment-body">
          <p>{props.commentText}</p>
          {props.currentUser === props.userId && (
            <Button onClick={setEditModeHandler}>Edit Comment</Button>
          )}
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
              defaultValue={props.commentText}
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
