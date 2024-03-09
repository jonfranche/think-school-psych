package main

import (
	"time"
)

type Story struct {
	ID string `json:"id"`
	Title string `json:"title"`
	Date time.Time `json:"date"`
	UserID string `json:"userID"`
	Text string `json:"text"`
}

type User struct {
	ID string `json:"id"`
	JoinDate time.Time `json:"joinDate"`
	Name string `json:"name"`
	Email string `json:"email"`
	Password string `json:"password"`
}

type Comment struct {
	ID string `json:"id"`
	Date time.Time `json:"date"`
	UserID string `json:"userID"`
	BlogID string `json:"blogID"`
	Text string `json:"text"`
}

