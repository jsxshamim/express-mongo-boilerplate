const express = require("express");
const usersController = require("../../controllers/users.controller");
const { limiter } = require("../../middleware/rateLimit");
const viewCount = require("../../middleware/viewCount");

const router = express.Router();

// router.get("/", (req, res) => {
//     res.send("user found");
// });

// router.post("/", (req, res) => {
//     res.send("user added");
// });

// router.get("/:id", (req, res) => {
//     res.send(`user found with id: ${req.params.id}`);
// });

// Shorthand

router.route("/").get(usersController.getUsers).post(usersController.addUser).patch(usersController.updateUsers);

router.route("/:id").get(usersController.getUser).patch(usersController.updateUser).delete(usersController.deleteUser);

module.exports = router;
