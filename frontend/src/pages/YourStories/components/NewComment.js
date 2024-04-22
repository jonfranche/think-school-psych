import React from "react";
import { useForm, FormProvider } from "react-hook-form";

import Input from "../../../shared/components/Input/Input";
import Button from "../../../shared/components/UIElements/Button";
import { useAuth } from "../../../shared/context/auth-context";

import { comment_validation } from "../../../util/inputValidation";
import "./NewComment.css";

const NewComment = (props) => {
  const { currentUser } = useAuth();
  const methods = useForm();

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

    const resData = await fetch(`/api/stories/${props.blogId}/comment`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + currentUser.accessToken,
      },
      body: reqData,
    });

    console.log(resData)

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
