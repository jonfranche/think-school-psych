import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useForm, FormProvider, SubmitHandler } from "react-hook-form";
import { useModal } from "react-hooks-use-modal";

import { useAuth } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import {
  blog_title_validation,
  blog_text_validation,
} from "../../util/inputValidation";

import "./EditBlog.css";
import Input from "../../shared/components/Input/Input";
import Button from "../../shared/components/UIElements/Button";
import Confirmation from "../../shared/components/UIElements/Confirmation";

type FormData = {
  blogTitle: string;
  blogText: string;
};

function EditBlog() {
  const { currentUser } = useAuth();
  const { sendRequest } = useHttpClient();
  const [Modal, open, close] = useModal("root", {
    preventScroll: true,
    focusTrapOptions: {
      clickOutsideDeactivates: false,
    },
  });

  const methods = useForm<FormData>();
  const navigate = useNavigate();
  let { id } = useParams();
  let { state } = useLocation();

  const cancelButtonHandler = () => {
    navigate(`/stories/id/${id}`);
  };

  const deleteButtonHandler = () => {
    open();
  };

  const deleteStory = async () => {
    try {
      if (currentUser) {
        const userIdToken = await currentUser.getIdToken();
        await sendRequest(`/api/stories/${id}`, "DELETE", null, {
          Authorization: "Bearer " + userIdToken,
        });
        close();
        navigate("/stories");
      } else throw new Error("You are not logged in.");
    } catch (err) {
      if (err instanceof Error)
        navigate("/error", { state: { code: "403", message: err.message } });
    }
  };

  const submitHandler: SubmitHandler<FormData> = async (data, event) => {
    try {
      event?.preventDefault();
      if (currentUser) {
        const editedBlog = {
          title: data.blogTitle,
          text: data.blogText,
        };

        let reqData = JSON.stringify(editedBlog);
        const userIdToken = await currentUser.getIdToken();
        await sendRequest(`/api/stories/${id}`, "PATCH", reqData, {
          Authorization: "Bearer " + userIdToken,
        });
      } else throw new Error("You are not logged in.");
    } catch (err) {
      if (err instanceof Error)
        navigate("/error", { state: { code: "403", message: err.message } });
    }

    methods.reset();
    navigate(`/stories/id/${id}`);
  };

  return (
    <div className="new-blog">
      <h2>Editing Story: {state.title}</h2>
      <div className="new-blog-header">
        <Button danger={true} onClick={cancelButtonHandler}>
          Cancel Edit
        </Button>
        <Button danger={true} onClick={deleteButtonHandler}>
          Delete Story
        </Button>
      </div>
      <Modal>
        <Confirmation
          message="Are you sure you want to delete this story?"
          yesButtonHandler={deleteStory}
          noButtonHandler={close}
        />
      </Modal>
      <FormProvider {...methods}>
        <form
          className="blog-form"
          onSubmit={methods.handleSubmit(submitHandler)}
        >
          <Input {...blog_title_validation} defaultValue={state.title} />
          <Input {...blog_text_validation} defaultValue={state.text} />
          <Button submit={true} type="submit">
            Share
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}

export default EditBlog;
