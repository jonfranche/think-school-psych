package models

import "time"

type Story struct {
	ID string `json:"id"`
	Title string `json:"title"`
	Date time.Time `json:"date"`
	UserID string `json:"userID"`
	Text string `json:"text"`
	CommentIDs []string `json:"commentIDs"`
}

type User struct {
	ID string `json:"id"`
	JoinDate time.Time `json:"joinDate"`
	Name string `json:"name"`
	Email string `json:"email"`
	Password string `json:"password"`
	IsAdmin bool `json:"isAdmin"`
}

type Comment struct {
	ID string `json:"id"`
	Date time.Time `json:"date"`
	UserID string `json:"userID"`
	BlogID string `json:"blogID"`
	Text string `json:"text"`
}

var Stories = []Story {
	{
		ID: "1", 
		Date: time.Date(2022, 6, 12, 0, 0, 0, 0, time.Local), 
		UserID: "1", 
		CommentIDs: []string{"1", "2", "3"}, 
		Title: "Lorem Ipsum Dolor", 
		Text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
	},
	{
		ID: "2", 
		Date: time.Date(2022, 11, 3, 0, 0, 0, 0, time.Local), 
		UserID: "1", 
		CommentIDs: []string{"4", "5"}, 
		Title: "Dummy Blog Title", 
		Text: "This is placeholder text to test the blog functionality. This blog was made by user 1. It has 2 comments.",
	},
}

var Users = []User {
	{
		ID: "1", 
		JoinDate: time.Date(2022, 6, 11, 0, 0, 0, 0, time.Local), 
		Name: "fakeuser1",
		Email: "fakeuser1@test.com",
		Password: "password123",
		IsAdmin: true,
	},
	{
		ID: "2",
		JoinDate: time.Date(2022, 7, 20, 0, 0, 0, 0, time.Local),
		Name: "testuser2",
		Email: "testuser2@test.com",
		Password: "password123",
		IsAdmin: false,
	},
}

var Comments = []Comment {
	{
		ID: "1",
		Date: time.Date(2022, 7, 20, 0, 0, 0, 0, time.Local),
		UserID: "2",
		BlogID: "1",
		Text: "Wow great post!",
	  },
	  {
		ID: "2",
		Date: time.Date(2022, 7, 21, 0, 0, 0, 0, time.Local),
		UserID: "1",
		BlogID: "1",
		Text: "Thanks, testuser2!",
	  },
	  {
		ID: "3",
		Date: time.Date(2022, 7, 21, 0, 0, 0, 0, time.Local),
		UserID: "2",
		BlogID: "1",
		Text: "You're welcome!",
	  },
	  {
		ID: "4",
		Date: time.Date(2022, 11, 3, 0, 0, 0, 0, time.Local),
		UserID: "2",
		BlogID: "2",
		Text: "Another well written blog, fakeuser1.",
	  },
	  {
		ID: "5",
		Date: time.Date(2022, 11, 4, 0, 0, 0, 0, time.Local),
		UserID: "1",
		BlogID: "2",
		Text: "Thanks so much, testuser2!",
	  },
}