const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Function to check if the user exists
const doesExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    return userswithsamename.length > 0;
};


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).send("Error logging in");
    } else if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).send("User successfully registered. Now you can login");
        } else {
            return res.status(404).send("User already exists!");
        }
    }
    return res.status(404).send("Unable to register user.");
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    res.status(200).send(JSON.stringify(books, null, 4))
});

async function fetchData() {
    try {
        const response = await axios.get("https://keerthanakat-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");
        console.log("Task 10 - fetch data using async/await axios", response.data)
    } catch (error) {
        console.error("Error fetching data", error)
    }
}
fetchData()

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const requestedISBN = req.params.isbn;
    res.status(200).send(JSON.stringify(books[requestedISBN], null, 4));
});

const fetchDataByISBNWithPromiseAxios = (isbn)=>{
    axios.get(`https://keerthanakat-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`)
        .then((response) => console.log("task 12",response.data))
        .catch((error) => console.error("error fetching data", error))
}

fetchDataByISBNWithPromiseAxios(3)

// async function fetchDataByISBN(isbn) {
//     try {
//         const response = await axios.get(`https://keerthanakat-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/isbn/${isbn}`);
//         console.log("Task 11 - fetch data using promise with axios",response.data)
//     } catch (error) {
//         console.error("Error fetching data", error)
//     }
// }
// fetchDataByISBN(2)


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const requestedAuthor = req.params.author;
    const dataByAuthor = []
    //Write your code here
    for (let key in books) {
        if (books[key].author === requestedAuthor)
            dataByAuthor.push(books[key])
    }
    res.status(200).send(JSON.stringify(dataByAuthor, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const requestedTitle = req.params.title;
    const dataByTitle = []
    //Write your code here
    for (let key in books) {
        if (books[key].title === requestedTitle)
            dataByTitle.push(books[key])
    }
    res.status(200).send(JSON.stringify(dataByTitle, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const requestedReviewByisbn = req.params.isbn;
    const review = books[requestedReviewByisbn].reviews
    res.status(200).send(JSON.stringify(review, null, 4));
});

module.exports.general = public_users;
