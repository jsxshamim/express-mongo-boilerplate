const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");

let users = [
    { id: 1, name: "Shamim", age: 22 },
    { id: 2, name: "Ruhul", age: 25 },
    { id: 3, name: "Samrat", age: 28 },
    { id: 4, name: "Kamrul", age: 30 },
];

// get all users
module.exports.getUsers = async (req, res, next) => {
    try {
        const { limit, page } = req.query;
        const db = getDb();
        const cursor = db
            .collection("user")
            .find()
            .project({ address: 0 })
            .limit(+limit)
            .skip(+page * limit);
        const userCount = await db.collection("user").find().count();
        const users = await cursor.toArray();

        if (!users.length) {
            return await res.status(400).json({
                success: false,
                error: "Couldn't Find any users",
            });
        }
        await res.status(200).json({
            success: true,
            message: "Users get successfully!",
            count: userCount,
            data: users,
        });
    } catch (error) {
        await next(error);
    }
};

// get single user
module.exports.getUser = async (req, res, next) => {
    try {
        const db = getDb();
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return await res.status(400).json({
                success: false,
                error: "Id not valid",
            });
        }

        const user = await db.collection("user").findOne({ _id: ObjectId(id) });

        if (!user) {
            return await res.status(400).json({
                success: false,
                error: "Couldn't Find a User with the ID",
            });
        }

        res.status(200).json({
            success: true,
            message: "get user",
            data: user,
        });
    } catch (error) {
        await next(error);
    }
};

// add user
module.exports.addUser = async (req, res, next) => {
    try {
        const db = getDb();
        const user = req.body;
        const result = await db.collection("user").insertOne(user);

        if (!result.insertedId) {
            return await res.status(400).send({
                success: false,
                message: "something went wrong!",
            });
        }
        await res.status(200).send({
            success: true,
            message: `add user successfully, ID: ${result.insertedId}`,
            data: result,
        });
    } catch (error) {
        await next(error);
    }
};

// update user
module.exports.updateUser = async (req, res, next) => {
    try {
        const db = getDb();
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return await res.status(400).json({
                success: false,
                error: "Please insert the valid ID",
            });
        }

        const result = await db.collection("user").updateOne({ _id: ObjectId(id) }, { $set: req.body });

        if (!result.matchedCount) {
            return await res.status(400).json({
                success: false,
                error: "Couldn't Find the User with the ID",
            });
        } else if (!result.modifiedCount) {
            return await res.status(400).json({
                success: false,
                error: "Couldn't Update the User",
            });
        }

        res.status(200).json({
            success: true,
            message: "successfully updated the user",
            data: result,
        });
    } catch (error) {
        await next(error);
    }
};

// update multiple users
module.exports.updateUsers = async (req, res, next) => {
    try {
        const db = getDb();

        const result = await db.collection("user").updateOne({ _id: ObjectId(id) }, { $set: req.body });
        // const result = await db.collection("user").updateMany({ age: { $exists: true } }, { $set: { age: (Math.random(0, 100) * 200).toFixed(0) } });

        if (!result.matchedCount) {
            return await res.status(400).json({
                success: false,
                error: "Couldn't Update the Users",
            });
        }

        res.status(200).json({
            success: true,
            message: "successfully update the users",
            data: result,
        });
    } catch (error) {
        await next(error);
    }
};

// delete user
module.exports.deleteUser = async (req, res, next) => {
    try {
        const db = getDb();
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return await res.status(400).json({
                success: false,
                error: "Please insert the valid ID",
            });
        }

        const result = await db.collection("user").deleteOne({ _id: ObjectId(id) });

        if (!result.deletedCount) {
            return await res.status(400).json({
                success: false,
                error: "Couldn't delete the user",
            });
        }

        res.status(200).json({
            success: true,
            message: "Successfully Deleted the user",
            data: result,
        });
    } catch (error) {
        await next(error);
    }
};
