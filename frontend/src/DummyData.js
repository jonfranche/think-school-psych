const DUMMY_BLOGS = [
  {
    id: 1,
    date: new Date(2022, 6, 12),
    userId: 1,
    commentsIds: [1, 2, 3],
    title: "Lorem Ipsum Dolor",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
  },
  {
    id: 2,
    date: new Date(2022, 11, 3),
    userId: 1,
    commentsIds: [4, 5],
    title: "Dummy Blog Title",
    text: "This is placeholder text to test the blog functionality. This blog was made by user 1. It has 2 comments.",
  },
];

const DUMMY_USERS = [
  {
    id: 1,
    joinDate: new Date(2022, 6, 11),
    name: "fakeuser1",
    email: "fakeuser1@test.com",
    password: "password123",
    isAdmin: true,
  },
  {
    id: 2,
    joinDate: new Date(2022, 7, 20),
    name: "testuser2",
    email: "testuser2@test.com",
    password: "password123",
    isAdmin: false,
  },
];

const DUMMY_COMMENTS = [
  {
    id: 1,
    date: new Date(2022, 7, 20),
    userId: 2,
    blogId: 1,
    text: "Wow great post!",
  },
  {
    id: 2,
    date: new Date(2022, 7, 21),
    userId: 1,
    blogId: 1,
    text: "Thanks, testuser2!",
  },
  {
    id: 1,
    date: new Date(2022, 7, 21),
    userId: 2,
    blogId: 1,
    text: "You're welcome!",
  },
  {
    id: 1,
    date: new Date(2022, 11, 3),
    userId: 2,
    blogId: 2,
    text: "Another well written blog, fakeuser1.",
  },
  {
    id: 2,
    date: new Date(2022, 11, 4),
    userId: 1,
    blogId: 2,
    text: "Thanks so much, testuser2!",
  },
];

exports.DUMMY_BLOGS = DUMMY_BLOGS;
exports.DUMMY_USERS = DUMMY_USERS;
exports.DUMMY_COMMENTS = DUMMY_COMMENTS;
