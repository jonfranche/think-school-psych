import React, { SyntheticEvent } from "react";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Input from "../../../shared/components/Input/Input";
import Button from "../../../shared/components/UIElements/Button";
import { useAuth } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import { comment_validation } from "../../../util/inputValidation";
import "./NewComment.css";

type NewCommentProps = {
  blogId: string;
  setVisible: () => void;
  update: () => void;
};

type FormData = {
  comment: string;
};

export default function NewComment({
  blogId,
  setVisible,
  update,
}: NewCommentProps) {
  const { currentUser } = useAuth();
  const methods = useForm<FormData>();
  const { sendRequest } = useHttpClient();
  const navigator = useNavigate();

  function cancelButtonHandler(e: SyntheticEvent<Element, Event>) {
    e.preventDefault();
    setVisible();
  }

  const submitHandler: SubmitHandler<FormData> = async (data, event) => {
    try {
      event?.preventDefault();
      if (currentUser) {
        const newComment = {
          userID: currentUser.uid,
          text: data.comment,
        };
        let reqData = JSON.stringify(newComment);

        const userIdToken = await currentUser.getIdToken();
        await sendRequest(`/api/stories/${blogId}/comment`, "POST", reqData, {
          Authorization: "Bearer " + userIdToken,
        });
      } else throw new Error("You are not logged in.");

      setVisible();
      update();
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
  };

  return (
    <FormProvider {...methods}>
      <form
        className="new-comment-form"
        onSubmit={methods.handleSubmit(submitHandler)}
      >
        <Input {...comment_validation} />
        <div className="new-comment-buttons">
          <Button danger={true} onClick={cancelButtonHandler}>
            Cancel
          </Button>
          <Button type="submit" submit={true}>
            Submit
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
