import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useForm, FormProvider } from "react-hook-form";
import { useModal } from "react-hooks-use-modal";

import { DUMMY_BLOGS, DUMMY_USERS } from "../../DummyData";
import {
  blog_title_validation,
  blog_text_validation,
} from "../../util/inputValidation";

import "./EditBlog.css";
import Input from "../../shared/components/Input/Input";
import Button from "../../shared/components/UIElements/Button";
import Confirmation from "../../shared/components/UIElements/Confirmation";

const EditBlog = () => {
  // const [Modal, open, close, isOpen] = useModal("root", {
  //   preventScroll: true,
  //   focusTrapOptions: {
  //     clickOutsideDeactivates: false,
  //   },
  // });
  const [Modal, open, close, isOpen] = useModal("root", {
    preventScroll: true,
    focusTrapOptions: {
      clickOutsideDeactivates: false,
    },
  });

  const methods = useForm();
  const navigate = useNavigate();
  let { id } = useParams();
  let { state } = useLocation();
  // convert id param to be a number
  id = Number(id);

  const blogData = DUMMY_BLOGS.find((blog) => blog.id === id);
  console.log(blogData);
  useEffect(() => {
    console.log(`/stories/${id}`);
  }, [id]);

  const cancelButtonHandler = () => {
    navigate(`/stories/${id}`);
  };

  const deleteButtonHandler = () => {
    open();
  };

  const deleteStory = () => {
    const indexOfEditedBlog = DUMMY_BLOGS.findIndex((blog) => blog.id === id);
    DUMMY_BLOGS.splice(indexOfEditedBlog, 1);
    console.log(DUMMY_BLOGS);
    navigate("/stories");
  };

  const submitHandler = (data, event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    const indexOfEditedBlog = DUMMY_BLOGS.findIndex((blog) => blog.id === id);

    DUMMY_BLOGS[indexOfEditedBlog].title = formJson.blogTitle;
    DUMMY_BLOGS[indexOfEditedBlog].text = formJson.blogText;
    navigate(`/stories/${id}`);
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
