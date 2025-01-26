const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{username: 'admin', password: 'admin'}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }}

//only registered users can login
regd_users.post("/login", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    if(username && password) {
        if(authenticatedUser(username, password)) {
            // Generate JWT access token
            let accessToken = jwt.sign({
                user: username
            }, 'access', { expiresIn: 60 * 60 });
            // Store access token and username in session
            req.session.authorization = {
                accessToken, username
            }
            return res.status(200).send("User successfully logged in");
        } else {
            return res.status(400).json({ message: "Invalid Login. Check username and password" })
        }
    } else {
        return res.status(400).json({ message: "Error logging in" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let user = req.session.authorization['username'];
    let review = req.query.review;
    let isbn = req.params.isbn;
    books[isbn].reviews[user] = review;
    return res.status(200).json(books[isbn]);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
