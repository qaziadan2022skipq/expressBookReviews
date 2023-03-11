const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const { json } = require('express');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const userExist = (username) => {
  if (users.length === 0){
    return false;
  } else {
    const findUser = users.filter((user) => user.username === username);
    if (findUser.length > 0) {
      return true;
    }else {
      return false;
    }
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if (username && password){
    if (!userExist(username)){
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User Registered"});
    } else {
      return res.status(404).json({message: "User already Exists"});
    }
  } 
  res.status(404).json({message: "Missing username and/or password"});

});
// Task 10
// Used Promises
const showAllBooks = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Write your code here
  showAllBooks()
  .then((allBooks) => res.status(200).send(JSON.stringify(allBooks)),
  (err) => res.send("Can't show books"));
});

// Task 11
// Get book by ISBN via Promise
const findBookByIsbn = (isbn) => {
  return new Promise((resolve, reject) => {
    if (books[isbn]){
      resolve(books[isbn]);
    } else {
      reject(`No book with ${isbn} exists`);
    }
  });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  findBookByIsbn(isbn)
  .then((book) => res.status(200).send(JSON.stringify(book)),
  (err) => res.send(err));
 });


//  Task 12
// find book by author name via Promise
const findBookByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    let foundBook = []
    for (const book of Object.values(books)) {
      if (book.author === author){
        foundBook.push(book);
      }
    }
    if (foundBook.length > 0) {
      resolve(foundBook);
    } else {
      reject("No book found please provide correct author name")
    }
  });
}
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  findBookByAuthor(author)
  .then((bookData) => res.status(200).send(bookData),
  (err) => res.send(err));
});

// task 13
// Get book by title
const findBookByTitle = (title) => {
  return new Promise((resolve,reject) => {
    let foundBooks = []
    for (const book of Object.values(books)) {
      if (book.title === title){
        foundBooks.push(book);
      } 
    }
    if (foundBooks.length > 0) {
      resolve(foundBooks)
    } else {
      reject("No books found with this title please enter correct title");
    }
  });
}


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  findBookByTitle(title)
  .then((bookData) => res.status(200).send(bookData),
  (err) => res.send(err));
});

// show book review via promise
const showBookReview = (isbn) => {
  const book = books[isbn];
  return new Promise((resolve, reject) => {
    if(!book) {
      reject("No book found with this ISBN");
    } else {
      resolve(book.reviews)
    }
  })
}
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  showBookReview(isbn)
  .then((bookReview) => res.status(200).send(bookReview),
  (err) => res.send(err));
});


module.exports.general = public_users;
