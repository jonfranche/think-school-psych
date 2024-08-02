import React from "react";
import { useForm, FormProvider } from "react-hook-form";

import Input from "../../../shared/components/Input/Input";
import Button from "../../../shared/components/UIElements/Button";
import { useAuth } from "../../../shared/context/auth-context";
import { useHttpClient } from "../../../shared/hooks/http-hook";

import { comment_validation } from "../../../util/inputValidation";
import "./NewComment.css";

const NewComment = (props) => {
  const { currentUser } = useAuth();
  const methods = useForm();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const cancelButtonHandler = (e) => {
    e.preventDefault();
    props.setVisible();
  };

  const submitHandler = async (data, e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    const newComment = {
      userID: currentUser.uid,
      text: formJson.comment,
    };

    let reqData = JSON.stringify(newComment);

    const response = await sendRequest(
      `http://127.0.0.1/api/stories/${props.blogId}/comment`,
      "POST",
      reqData,
      { Authorization: "Bearer " + currentUser.accessToken }
    );

    props.setVisible();
    props.update();
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
};

export default NewComment;
