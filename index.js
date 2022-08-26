const express = require("express");

const app = express();

app.use(express.json());

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