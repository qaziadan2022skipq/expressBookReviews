const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const axios = require("axios");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userExist = users.filter((user) => user.username === username);
  if (userExist.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  const authUser = users.filter((user) => user.username == username && user.password === password);
  if (authUser.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password =  req.body.password;
  if (!username || !password) {
    res.status(404).json({message: "Enter the username and/or password"})
  }

  if (authenticatedUser(username, password)){
    let token = jwt.sign(
      { data: username},
      "secretkey",
      { expiresIn: 60*60 }
    );

    req.session.authorization = {
      token: token,
      username: username
    }
    return res.status(200).json({message: "User logged in successfully"});
  } else {
    return res.status(208).json({message: "User Doesnot Exits"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let review = req.body.review;
  let username = req.session.authorization.username;
  if (books[isbn]){
    let book = books[isbn];
    book.reviews[username] = review;

    return res.status(200).json({message: "Your review sucessfully uploaded"});
  } else {
    return res.status(404).json({message: `Book with ${isbn} doesnt exist`});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  // let review = req.body.review;
  let username = req.session.authorization.username;
  if (books[isbn]){
    let book = books[isbn];
    delete book.reviews[username];
    return res.status(200).json({message: "Your review successfully deleted"});
  } else {
    return res.status(404).json({message: `the Book with ${isbn} not found`});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.users = users;
