const express = require("express");

const { books } = require("../data/books.json");
const { users } = require("../data/users.json");

const {
  getAllBooks,
  getBookById,
  getAllIssuedBooks,
  addNewBook,
  updateBookById,
  getIssuedBookWithFine,
} = require("../Controllers/books-Controller");

const router = express.Router();

/**
 * Route: /books
 * Method: GET
 * Description: Get all books
 * Access: Public
 * Parameters: none
 */

router.get("/", getAllBooks);

/**
 * Route: /books/:id
 * Method: GET
 * Description: Get book by id
 * Access: Public
 * Parameters: id
 */

router.get("/:id", getBookById);

/**
 * Route: /books/issued/by-users
 * Method: GET
 * Description: Get issued books
 * Access: Public
 * Parameters: none
 */

router.get("/issued/by-users", getAllIssuedBooks);

/**
 * Route: /books
 * Method: POST
 * Description: Creating new book
 * Access: Public
 * Parameters: none
 */

router.post("/", addNewBook);

/**
 * Route: /books/:id
 * Method: PUT
 * Description: Updating a book
 * Access: Public
 * Parameters: id
 * data : id, name, etc..
 */

router.put("/:id", updateBookById);

/**
 * Route: /books/issued/with-fine
 * Method: GET
 * Description: Get issued books with fine
 * Access: Public
 * Parameters: none
 */

router.get("/issued/with-fine", getIssuedBookWithFine);

module.exports = router;
