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
 public_users.get('/', function (req, res) {
    new Promise((resolve,reject) => {resolve(books)})
    .then((result) => {
            return res.status(200).json(result);
    })
    .catch((error) => {
        return res.status(500).json({message: "Some error occurred", error: error});   
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    new Promise((resolve, reject) => {resolve(books[isbn])})
    .then((result) => {
        return res.status(200).json(result);
    })
    .catch((error) => {
        return res.status(500).json({message: "Some error occurred", error: error});   
    });
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    new Promise((resolve, reject) => {
        let result = {message: `No books of ${author} found`};
        for(let isbn in books) {
            if(books[isbn].author == author) {
                result = books[isbn];
            }
        }
        resolve(result)
    })
    .then((result) => {
        return res.status(200).json(result);
    })
    .catch((error) => {
        return res.status(500).json({message: "Some error occurred", error: error});   
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    new Promise((resolve, reject) => {
        let result = {message: `No books titled ${title} found`};
        for(let isbn in books) {
            if(books[isbn].title == title) {
                result = books[isbn];
            }
        }
        resolve(result)
    })
    .then((result) => {
        return res.status(200).json(result);
    })
    .catch((error) => {
        return res.status(500).json({message: "Some error occurred", error: error});   
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    let reviews = books.hasOwnProperty(isbn) ? books[isbn].reviews : {message: `ISBN ${isbn} does not exist`};
    return res.status(200).json(reviews);
});

module.exports.general = public_users;
