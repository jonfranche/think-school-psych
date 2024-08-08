import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import Input from "../../../shared/components/Input/Input";
import Button from "../../../shared/components/UIElements/Button";
import { useAuth } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import { comment_validation } from "../../../util/inputValidation";
import "./NewComment.css";

export default function NewComment(props) {
  const { currentUser } = useAuth();
  const methods = useForm();
  const { sendRequest } = useHttpClient();
  const navigator = useNavigate();

  function cancelButtonHandler(e) {
    e.preventDefault();
    props.setVisible();
  }

  async function submitHandler(data, e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    const newComment = {
      userID: currentUser.uid,
      text: formJson.comment,
    };

    let reqData = JSON.stringify(newComment);
    try {
      await sendRequest(
        `/api/stories/${props.blogId}/comment`,
        "POST",
        reqData,
        { Authorization: "Bearer " + currentUser.accessToken }
      );
    } catch (error) {
      navigator("/error", {
        state: {
          code: 500,
          message: "Something went wrong. Unable to post your commment.",
        },
      });
    }

    props.setVisible();
    props.update();
  }

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
