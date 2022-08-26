const express = require("express");
const { users } = require("./data/users.json");

const app = express();

app.use(express.json());

const PORT = 8081;

app.get("/", (req, res) => {
    res.status(200).send({
        Message: "Server is up and running"
    })
});

app.get("/users", (req, res) => {
    res.status(200).json({
        Success: true,
        Data: users,
    });
});

app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);
    if (!user) {
        return res.status(404).json({
            Success: false,
            Message: "User not found"
        });
    }
    res.status(200).json({
        Success: true,
        Data: user,
    });
});

app.post("/users", (req, res) => {
    const { id, name, surname, email, subscriptionType, subscriptionDate } = req.body;

    const user = users.find((each) => each.id === id);

    if (user) {
        return res.status(201).json({
            Success: false,
            Message: "User already exist",
        })
    }

    users.push({
        id,
        name,
        surname,
        email,
        subscriptionType,
        subscriptionDate
    })

    return res.status(201).json({
        Success: true,
        data: users
    });
});

app.put("/user/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const user = users.find((each) => each.id === id);

    if (!user) {
        return res.status(404).json({
            Success: false,
            Message: "user not found"
        })
    }

    const updateUser = users.map((each) => {
        if (each.id === id) {
            return {
                ...each,
                ...data,
            };
        }
        return each;
    })
    return res.status(200).json({
        Success: true,
        data: updateUser,
    });
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