import React, { useState } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useModal } from "react-hooks-use-modal";

import Input from "../../../shared/components/Input/Input";
import { edit_comment_validation } from "../../../util/inputValidation";
import "./Comment.css";
import Button from "../../../shared/components/UIElements/Button";
import Confirmation from "../../../shared/components/UIElements/Confirmation";
import { useAuth } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";

type CommentProps = {
  id: string;
  userId: string;
  username: string;
  update: () => {};
  currentUserId: string;
  commentDate: Date;
  commentText: string;
};

type FormData = {
  comment: string;
};

export default function Comment({
  id,
  userId,
  username,
  update,
  currentUserId,
  commentDate,
  commentText,
}: CommentProps) {
  const methods = useForm<FormData>();
  const [editMode, setEditMode] = useState(false);
  const { currentUser } = useAuth();
  const { sendRequest } = useHttpClient();
  const navigator = useNavigate();
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

  async function deleteCommentHandler() {
    try {
      if (currentUser) {
        await sendRequest(`/api/stories/comment/${id}`, "DELETE", null, {
          Authorization: "Bearer " + currentUser.getIdToken,
        });
      } else {
        throw new Error("You are not logged in");
      }
    } catch (error) {
      if (error instanceof Error) {
        navigator("/error", { state: { code: 403, message: error.message } });
      } else {
        navigator("/error", {
          state: {
            code: 500,
            message: "Something went wrong. Unable to post your commment.",
          },
        });
      }
    }

    close();
    update();
  }

  const submitHandler: SubmitHandler<FormData> = async (data, event) => {
    try {
      event?.preventDefault();
      if (currentUser) {
        const editedComment = {
          userId: currentUserId,
          text: data.comment,
        };

        const reqData = JSON.stringify(editedComment);

        await sendRequest(`/api/stories/comment/${id}`, "PATCH", reqData, {
          Authorization: "Bearer " + currentUser.getIdToken,
        });
      } else throw new Error();
    } catch (error) {
      navigator("/error", {
        state: {
          code: 500,
          message: "Something went wrong. Could not edit your comment.",
        },
      });
    }

    setEditMode(false);
    methods.reset();
    update();
  };

  let date = new Date(commentDate).toLocaleDateString();

  return (
    <div className="comment">
      <div className="comment-header">
        <span>
          <b>{username}</b>
        </span>
        <span>{date}</span>
      </div>
      {!editMode && (
        <div className="comment-body">
          <p>{commentText}</p>
          {currentUserId === userId && (
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
            <Input {...edit_comment_validation} defaultValue={commentText} />
            <Button type="submit" submit={true}>
              Submit
            </Button>
          </form>
        </FormProvider>
      )}
    </div>
  );
}
