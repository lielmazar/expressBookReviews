const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    if (!req.body.hasOwnProperty('username')) {
        return res.status(400).json({message: "no 'username' field in request's JSON body"});
    }
    if (!req.body.hasOwnProperty('password')) {
        return res.status(400).json({message: "no 'password' field in request's JSON body"});
    }
    for (let user of users) {
        if (user.username == req.body.username) {
            return res.status(400).json({message: "username already taken"});
        };
    }
    users.push({username: req.body.username, password: req.body.password})
    return res.status(200).json({message: "Registered!"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let result = {message: `No books of ${author} found`};
    for(let isbn in books) {
        if(books[isbn].author == author) {
            result = books[isbn];
        }
    }
    return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let result = {message: `No books titled ${title} found`};
    for(let isbn in books) {
        if(books[isbn].title == title) {
            result = books[isbn];
        }
    }
    return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let reviews = books.hasOwnProperty(isbn) ? books[isbn].reviews : {message: `ISBN ${isbn} does not exist`};
    return res.status(200).json(reviews);
});

module.exports.general = public_users;
