const password_validation = {
  name: "password",
  label: "Password",
  type: "password",
  id: "password",
  placeholder: "",
  validation: {
    required: {
      value: true,
      message: "A password is required",
    },
    minLength: {
      value: 8,
      message: "Your password must be atleast 8 characters",
    },
  },
};

const email_validation = {
  name: "email",
  label: "Email",
  type: "email",
  id: "email",
  placeholder: "",
  validation: {
    required: {
      value: true,
      message: "An email is required",
    },
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: "Not a valid email",
    },
  },
};

const comment_validation = {
  name: "comment",
  label: "New Comment",
  type: "textarea",
  id: "comment-input",
  placeholder: "",
  validation: {
    required: {
      value: true,
      message: "Text for the comment is required",
    },
    maxLength: {
      value: 2000,
      message: "Your comment is over the 2000 character limit.",
    },
  },
};

const edit_comment_validation = {
  name: "comment",
  label: "Edit Comment",
  type: "textarea",
  id: "comment-input",
  placeholder: "",
  validation: {
    required: {
      value: true,
      message: "Text for the comment is required",
    },
    maxLength: {
      value: 2000,
      message: "Your comment is over the 2000 character limit.",
    },
  },
};

const blog_title_validation = {
  name: "blogTitle",
  label: "Title",
  type: "text",
  id: "title-input",
  placeholder: "",
  validation: {
    required: {
      value: true,
      message: "A title is required",
    },
    minLength: {
      value: 3,
      message: "Your title is too short (3 characters minimum).",
    },
  },
};

const blog_text_validation = {
  name: "blogText",
  label: "Story",
  type: "textarea",
  id: "story-input",
  placeholder: "",
  validation: {
    required: {
      value: true,
      message: "Text for the story is required",
    },
    minLength: {
      value: 250,
      message: "Your story is too short (250 characters minimum)."
    }
  }
}

export {
  password_validation,
  email_validation,
  comment_validation,
  edit_comment_validation,
  blog_title_validation,
  blog_text_validation
}