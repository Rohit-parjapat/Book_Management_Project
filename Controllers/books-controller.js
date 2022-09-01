const { BookModel, UserModel, IssuedBook } = require("../Models");

exports.getAllBooks = async (req, res) => {
    const books = await BookModel.find();

    if (books.length === 0) {
        return res.status(404).json({
            success: false,
            Message: "Book not found",
        });
    }

    res.status(200).json({
        Success: true,
        Data: books,
    });
}

exports.getBookById = async (req, res) => {
    const { id } = req.params;
    const book = await BookModel.findById(id);
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
}

exports.getAllIssuedBooks = async (req, res) => {
    const users = await UserModel.find({
        issuedBook: { $exists: true },
    }).populate("issuedBook");

    const issuedBooks = users.map((each) => new IssuedBook(each));

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
}