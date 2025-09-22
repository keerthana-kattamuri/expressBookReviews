const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    const data = users.find((user) =>
        user.username === username && user.password === password
    )
    if (!!data)
        return true
    else return false
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    console.log("login entered")
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
        res.status(401).send("Error unauthorized - User details are not sent.")
    }
    else if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: username
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken,
            username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        res.status(401).send("User is not authorized")
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    console.log("entered")
    const receivedReview = req.query.review;
    const providedIsbn = req.params.isbn;
    const reviewer = req.session.authorization['username'];
    let foundExsistingUserReview = false;
    if (Object.keys(books[providedIsbn].reviews).length > 0) {
        for (let key in books[providedIsbn].reviews) {
            if (key === reviewer) {
                foundExsistingUserReview = true;
                books[providedIsbn].reviews[reviewer] = receivedReview
            }
        }
        if (!foundExsistingUserReview) books[providedIsbn].reviews[reviewer] = receivedReview;
    } else if (Object.keys(books[providedIsbn].reviews).length == 0) {
        books[providedIsbn].reviews[reviewer] = receivedReview;
    }
    res.status(200).send("Review was updated successfully");
});

regd_users.delete("/auth/review/:isbn", (req,res)=>{
    const providedIsbn = req.params.isbn;
    const reviewer = req.session.authorization['username'];
    delete books[providedIsbn].reviews[reviewer]
    res.status(200).send("deleted successfully")
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
