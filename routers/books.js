const express = require('express');
const router = express.Router();

const { books } = require('../data/books.json');
const { users } = require('../data/users.json');

/**
 * Route: /books
 * Method: GET
 * Description: Get all books
 * Access: Public
 * Parameters: none
 */

router.get("/", (req, res) => {
    res.status(200).json({
        Success: true,
        Data: books,
    });
});

/**
 * Route: /books/:id
 * Method: GET
 * Description: Get book by id
 * Access: Public
 * Parameters: id
 */

router.get("/:id", (req, res) => {
    const { id } = req.params;
    const book = books.find((each) => each.id === id);
    if (!book) {
        return res.status(404).json({
            Success: false,
            Message: "book not found"
        });
    }
    res.status(200).json({
        Success: true,
        Data: book,
    });
});

/**
 * Route: /books/issued/by-users
 * Method: GET
 * Description: Get issued books
 * Access: Public
 * Parameters: none
 */

router.get("/issued/by-users", (req, res) => {
    const usersWithIssuedBooks = users.filter((each) => {
        if (each.issuedBook) return each;
    });

    const issuedBooks = [];

    usersWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;

        issuedBooks.push(book);
    });

    if (issuedBooks.length === 0) {
        return res.status(404).json({
            Success: false,
            Message: "No books Issued yet",
        });
    }

    return res.status(200).json({
        Success: true,
        Message: "Issued Books List",
        Data: issuedBooks,
    })
});

/**
 * Route: /books
 * Method: POST
 * Description: Creating new book
 * Access: Public
 * Parameters: none
 */

router.post("/", (req, res) => {
    const { data } = req.body;

    if (!data) {
        return res.status(404).json({
            Success: false,
            Message: "No data send by user",
        });
    }

    const book = books.find((each) => each.id === data.id);
    if (book) {
        return res.status(202).json({
            Success: false,
            Message: "Book with specified Id already exist",
        });
    }

    const allBooks = [...books, data];

    return res.status(200).json({
        Success: true,
        Message: "New book added successfully",
        Data: allBooks,
    });
})

/**
 * Route: /books/:id
 * Method: PUT
 * Description: Updating a book
 * Access: Public
 * Parameters: id
 * data : id, name, etc..
 */

router.put("/:id", (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const book = books.find((each) => each.id === id);

    if (!book) {
        return res.status(404).json({
            Success: false,
            Message: "Book not found",
        });
    }

    const updateData = books.map((each) => {
        if (each.id === id) {
            return { ...each, ...data };
        }
        return each;
    });

    return res.status(200).json({
        Success: true,
        Message: 'book updated successfully',
        Data: updateData,
    });
});

/**
 * Route: /books/issued/with-fine
 * Method: GET
 * Description: Get issued books with fine
 * Access: Public
 * Parameters: none
 */

router.get("/issued/with-fine", (req, res) => {
    const usersWithIssuedBooksWithFine = users.filter((each) => {
        if (each.issuedBook) return each;
    });

    const issuedBooksWithFine = [];

    usersWithIssuedBooksWithFine.forEach((each) => {
        const book = books.find((book) => book.id === each.issuedBook);

        book.issuedBy = each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;


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

        let returnDate = getDateInDays(each.returnDate);

        let currentDate = getDateInDays();

        if (returnDate < currentDate) {
            issuedBooksWithFine.push(book);
        }
    });

    if (issuedBooksWithFine.length === 0) {
        return res.status(404).json({
            Success: false,
            Message: "No books which have fine",
        });
    }

    return res.status(200).json({
        Success: true,
        Message: "Issued Books List which have fine",
        Data: issuedBooksWithFine,
    })
});


module.exports = router;