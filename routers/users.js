const express = require("express");

const { users } = require('../data/users.json');

const router = express.Router();

/**
 * Route: /users
 * Method: GET
 * Description: Get all users
 * Access: Public
 * Parameters: none
 */

router.get("/", (req, res) => {
    res.status(200).json({
        Success: true,
        Data: users,
    });
});

/**
 * Route: /users/:id
 * Method: GET
 * Description: Get user by id
 * Access: Public
 * Parameters: id
 */

router.get("/:id", (req, res) => {
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

/**
 * Route: /users
 * Method: POST
 * Description: Create new user
 * Access: Public
 * Parameters: none
 */

router.post("/", (req, res) => {
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

/**
 * Route: /users/:id
 * Method: PUT
 * Description: Updating user
 * Access: Public
 * Parameters: id
 */

router.put("/:id", (req, res) => {
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

/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Deleting user
 * Access: Public
 * Parameters: id
 */

router.delete("/:id", (req, res) => {
    const { id } = req.params;
    const user = users.find((each) => each.id === id);

    if (!user) {
        return res.status(404).json({
            Success: false,
            Message: "user to be deleted not found",
        });
    }

    const index = users.indexOf(user);
    users.splice(index, 1);

    return res.status(200).json({
        Success: true,
        Message: "user Deleted",
        DeletedUser: user.id,
        Data: users,
    });
});

module.exports = router;