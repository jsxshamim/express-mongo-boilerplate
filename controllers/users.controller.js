const { ObjectId } = require("mongodb");
const { getDb } = require("../utils/dbConnect");

let users = [
    { id: 1, name: "Shamim", age: 22 },
    { id: 2, name: "Ruhul", age: 25 },
    { id: 3, name: "Samrat", age: 28 },
    { id: 4, name: "Kamrul", age: 30 },
];

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
        const users = await cursor.toArray();
        if (!users.length) {
            return await res.status(400).json({
                success: false,
                error: "no user",
            });
        }
        await res.status(200).json({
            success: true,
            message: "Users get successfully!",
            data: users,
        });
    } catch (error) {
        await next(error);
    }
};

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

        res.status(200).json({
            success: true,
            message: "get user",
            data: user,
        });
    } catch (error) {
        await next(error);
    }
};

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

    // const exist = users.find((user) => user.id === Number(req.body.id));
    // if (!exist) {
    //     users.push(req.body);
    // }
    // res.status(200).send({
    //     status: 200,
    //     success: true,
    //     message: "add user successfully",
    //     data: users,
    // });
    // res.status(500).send({
    //     status: 500,
    //     success: false,
    //     error: "Internal server error",
    // });
};

module.exports.updateUser = (req, res) => {
    const { id } = req.params;
    const exist = users.find((user) => user.id === Number(id));

    exist.age = req.body.age ? req.body.age : exist.age;
    exist.name = req.body.name ? req.body.name : exist.name;

    res.send(exist);
};

module.exports.deleteUser = (req, res) => {
    const { id } = req.params;
    const remaining = users.filter((user) => user.id !== Number(id));
    users = remaining;
    res.send(remaining);
};
