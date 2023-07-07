import React from "react";
import { useForm, FormProvider } from "react-hook-form";

import Input from "../../../shared/components/Input/Input";
import Button from "../../../shared/components/UIElements/Button";

import { comment_validation } from "../../../util/inputValidation";
import { DUMMY_COMMENTS, DUMMY_BLOGS } from "../../../DummyData";
import "./NewComment.css";

const NewComment = (props) => {
  const methods = useForm();

  const addCommentToBlog = (commentId) => {
    const blogIndex = DUMMY_BLOGS.findIndex(blog => blog.id === props.blogId);
    DUMMY_BLOGS[blogIndex].commentsIds.push(commentId);
  };

  const cancelButtonHandler = (e) => {
    e.preventDefault();
    props.setVisible();
  };

  const submitHandler = (data, e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    const newComment = {
      id: Math.floor(Math.random() * 10000),
      date: new Date(),
      userId: props.userId,
      blogId: props.blogId,
      text: formJson.commentText,
    };

    DUMMY_COMMENTS.push(newComment);
    addCommentToBlog(newComment.id);

    props.setVisible();
  };

  return (
    <FormProvider {...methods}>
      <form className="new-comment-form" onSubmit={methods.handleSubmit(submitHandler)}>
        <Input {...comment_validation} />
        <div className="new-comment-buttons">
          <Button danger={true} onClick={cancelButtonHandler}>Cancel</Button>
          <Button type="submit" submit={true}>Submit</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default NewComment;
