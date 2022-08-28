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

    if (user.issuedBook) {

        const getDateInDays = (data = "") => {
            let date;
            if (data === "") {
                date = new Date();
            } else {
                date = new Date(data);
            }
            let days = Math.floor(date / (1000 * 60 * 60 * 24)); //1000 is for milliseconds
            return days;
        };

        let returnDate = getDateInDays(user.returnDate);

        let currentDate = getDateInDays();

        const data = {
            ...user,
            fine: returnDate < currentDate ? 100
                : 0,
        }

        return res.status(201).json({
            Success: false,
            Message: "User can't be deleted untill user have issued books and fine",
            Data: data,
        })
    } else {
        const index = users.indexOf(user);
        users.splice(index, 1);

        return res.status(200).json({
            Success: true,
            Message: "user Deleted",
            DeletedUser: user.id,
            Data: users,
        });
    }
});

/**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Description: Get all user subscription details
 * Access: Public
 * Parameters:id 
 */

router.get("/subscription-details/:id", (req, res) => {
    const { id } = req.params;

    const user = users.find((each) => each.id === id);

    if (!user) {
        return res.status(404).json({
            Success: false,
            Message: "user not found",
        });
    }
    // called from 190 // data comes from arguement
    const getDateInDays = (data = "") => {
        let date;
        if (data === "") {
            date = new Date();
        } else {
            date = new Date(data);
        }
        let days = Math.floor(date / (1000 * 60 * 60 * 24)); //1000 is for milliseconds
        return days;
    };

    const subscriptionType = (date) => {
        if (user.subscriptionType === "Basic") {
            date = date + 90;
        } else if (user.subscriptionType === "Standard") {
            date = date + 180;
        } else if (user.subscriptionType === "Premium") {
            date = date + 365;
        }
        return date;
    };

    //Subscription expiration calculation
    // January 1, 1970, UTC. // milliseconds

    let returnDate = getDateInDays(user.returnDate);

    let currentDate = getDateInDays();

    let subscriptionDate = getDateInDays(user.subscriptionDate);

    let subscriptionExpiration = subscriptionType(subscriptionDate);

    const data = {
        ...user,
        subscriptionExpired: subscriptionExpiration < subscriptionDate,
        daysLeftForExpiration:
            subscriptionExpiration <= currentDate ? 0 : subscriptionExpiration - currentDate,
        fine: returnDate < currentDate ?
            subscriptionExpiration <= currentDate
                ? 200
                : 100
            : 0,
    }

    return res.status(200).json({
        Success: true,
        data: data,
    })
});

module.exports = router;