const express = require("express");
const dotenv = require("dotenv");

// database connection

const DbConnection = require('./databaseConnection');

const { users } = require("./data/users.json");

//Importing routers
const usersRouters = require('./routers/users');
const booksRouters = require('./routers/books');

dotenv.config();

const app = express();

DbConnection();

app.use(express.json());

app.use('/users', usersRouters);
app.use('/books', booksRouters);

const PORT = 8081;

app.get("/", (req, res) => {
    res.status(200).send({
        Message: "Server is up and running"
    })
});

app.get("*", (req, res) => {
    res.status(404).send({
        Message: "This page do not exist"
    })
});

app.all("*", (req, res) => {
    res.status(500).send({
        Message: "This request is not available yet!"
    })
});


app.listen(PORT, () => {
    console.log(`Node js server started at port ${PORT}`);
});