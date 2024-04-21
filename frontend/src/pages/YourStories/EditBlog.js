import React from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { useModal } from "react-hooks-use-modal";

import { useAuth } from "../../shared/context/auth-context";

import {
  blog_title_validation,
  blog_text_validation,
} from "../../util/inputValidation";

import "./EditBlog.css";
import Input from "../../shared/components/Input/Input";
import Button from "../../shared/components/UIElements/Button";
import Confirmation from "../../shared/components/UIElements/Confirmation";

const EditBlog = () => {
  const { currentUser } = useAuth();
  const [Modal, open, close] = useModal("root", {
    preventScroll: true,
    focusTrapOptions: {
      clickOutsideDeactivates: false,
    },
  });

  const methods = useForm();
  const navigate = useNavigate();
  let { id } = useParams();
  let { state } = useLocation();

  const cancelButtonHandler = () => {
    navigate(`/stories/id/${id}`);
  };

  const deleteButtonHandler = () => {
    open();
  };

  const deleteStory = () => {
    // const indexOfEditedBlog = DUMMY_BLOGS.findIndex((blog) => blog.id === id);
    // DUMMY_BLOGS.splice(indexOfEditedBlog, 1);
    // console.log(DUMMY_BLOGS);

    navigate("/stories");
  };

  const submitHandler = async (data, event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    const editedBlog = {
      title: formJson.blogTitle,
      text: formJson.blogText,
    };

    let reqData = JSON.stringify(editedBlog);

    const resData = await fetch(`/api/stories/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: "Bearer " + currentUser.accessToken,
      },
      body: reqData,
    });

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
};

export default EditBlog;
