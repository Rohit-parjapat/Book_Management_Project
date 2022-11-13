const express = require("express");
const { getAllUsers, getSingleUsersById, deleteUser, updateUserById, createNewUser, getSubscriptionDetailById } = require("../Controllers/users-controller");

const { users } = require('../data/users.json');

const router = express.Router();

/**
 * Route: /users
 * Method: GET
 * Description: Get all users
 * Access: Public
 * Parameters: none
 */

router.get("/", getAllUsers);

/**
 * Route: /users/:id
 * Method: GET
 * Description: Get user by id
 * Access: Public
 * Parameters: id
 */

router.get("/:id", getSingleUsersById);

/**
 * Route: /users
 * Method: POST
 * Description: Create new user
 * Access: Public
 * Parameters: none
 */

router.post("/", createNewUser);

/**
 * Route: /users/:id
 * Method: PUT
 * Description: Updating user
 * Access: Public
 * Parameters: id
 */

router.put("/:id", updateUserById);

/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Deleting user
 * Access: Public
 * Parameters: id
 */

router.delete("/:id", deleteUser);

/**
 * Route: /users/subscription-details/:id
 * Method: GET
 * Description: Get all user subscription details
 * Access: Public
 * Parameters:id 
 */

router.get("/subscription-details/:id", getSubscriptionDetailById);

module.exports = router;