const { BookModel, UserModel } = require("../Models/index");

const IssuedBook = require("../dtos/book-dto");

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
};

exports.getBookById = async (req, res) => {
  const { id } = req.params;
  const book = await BookModel.findById(id);
  if (!book) {
    return res.status(404).json({
      Success: false,
      Message: "book not found",
    });
  }
  res.status(200).json({
    Success: true,
    Data: book,
  });
};

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
  });
};

exports.addNewBook = async (req, res) => {
  const { data } = req.body;

  if (!data) {
    return res.status(404).json({
      Success: false,
      Message: "No data send by user",
    });
  }

  await BookModel.create({ ...data });

  const allBooks = await BookModel.find();

  return res.status(200).json({
    Success: true,
    Message: "New book added successfully",
    Data: allBooks,
  });
};

exports.updateBookById = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const updatedBook = await BookModel.findOneAndUpdate(
    {
      _id: id,
    },
    data,
    {
      new: true,
    }
  );

  return res.status(200).json({
    Success: true,
    Message: "book updated successfully",
    Data: updatedBook,
  });
};

exports.getIssuedBookWithFine = async (req, res) => {
  const usersWithIssuedBooks = await UserModel.find({
    issuedBook: { $exists: true },
  }).populate("issuedBook");

  const issuedBook = usersWithIssuedBooks.map((each) => new IssuedBook(each));

  const issuedBooksWithFine = [];

  issuedBook.forEach((each) => {
    // console.log(issuedBook);
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
      issuedBooksWithFine.push(issuedBook);
    }
    console.log(issuedBooksWithFine);
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
  });
};

// (req, res) => {
//     const usersWithIssuedBooksWithFine = users.filter((each) => {
//         if (each.issuedBook) return each;
//     });

//     const issuedBooksWithFine = [];

//     usersWithIssuedBooksWithFine.forEach((each) => {
//         const book = books.find((book) => book.id === each.issuedBook);

//         book.issuedBy = each.name;
//         book.issuedDate = each.issuedDate;
//         book.returnDate = each.returnDate;

//         const getDateInDays = (data = "") => {
//             let date;
//             if (data === "") {
//                 date = new Date();
//             } else {
//                 date = new Date(data);
//             }
//             let days = Math.floor(date / (1000 * 60 * 60 * 24)); //1000 is for milliseconds
//             return days;
//         };

//         let returnDate = getDateInDays(each.returnDate);

//         let currentDate = getDateInDays();

//         if (returnDate < currentDate) {
//             issuedBooksWithFine.push(book);
//         }
//     });

//     if (issuedBooksWithFine.length === 0) {
//         return res.status(404).json({
//             Success: false,
//             Message: "No books which have fine",
//         });
//     }

//     return res.status(200).json({
//         Success: true,
//         Message: "Issued Books List which have fine",
//         Data: issuedBooksWithFine,
//     })
// }
