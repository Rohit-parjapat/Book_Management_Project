const { UserModel, BookModel } = require('../Models');

exports.getAllUsers = async (req, res) => {

    const users = await UserModel.find();

    if (!users) {
        return res.status(404).json({
            Success: false,
            Message: "Users not found",
        });
    }
    res.status(200).json({
        Success: true,
        Data: users,
    });
}

exports.getSingleUsersById = async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findById(id);

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
}

exports.createNewUser = async (req, res) => {
    const { data } = req.body;

    const newUser = await UserModel.create({
        ...data,
    });

    return res.status(201).json({
        Success: true,
        data: newUser,
    });
}

exports.updateUserById = async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    const updatedUser = await UserModel.findOneAndUpdate(
        {
            _id: id,
        },
        {
            $set: {
                ...data,
            },
        },
        {
            new: true,
        });

    return res.status(200).json({
        Success: true,
        data: updatedUser,
    });
}

exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.deleteOne({
        _id: id,
    });

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

        return res.status(200).json({
            Success: true,
            Message: "user Deleted",
            DeletedUser: user.id,
            Data: user,
        });
    }
}

exports.getSubscriptionDetailById = async (req, res) => {
    const { id } = req.params;

    const user = await UserModel.findById(id);

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
}