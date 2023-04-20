import React, { useReducer } from "react";

import "./NewBlog.css";

// const reducer = (state, action) => {
//   if (action.type === "create-blog") {
//     return {

//     }
//   }
// }

const NewBlog = () => {
  // const [state, dispatch] = useReducer(reducer, {
  //   id: 0,
  //   date: "",
  //   userId: 1,
  //   commentsIds: [],
  //   title: "",
  //   text: ""
  // })

  const submitHandler = (event) => {
    event.preventDefault();
    // dispatch({type: "create-blog", title: event.target.});
    const form = event.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson);
  }

  return (
    <div className="new-blog">
      <h2>New Story</h2>
      <form className="new-blog-form" onSubmit={submitHandler}>
        <label htmlFor="blog-title">Title: </label>
        <input name="blog-title" type="text" />
        <label htmlFor="blog-text">Story: </label>
        <textarea name="blog-text"></textarea>
        <button type="submit">Share</button>
      </form>
    </div>
  );
};

export default NewBlog;
