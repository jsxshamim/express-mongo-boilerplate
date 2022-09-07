const errorHandler = (err, req, res, next) => {
    res.status(400).send({
        success: false,
        error: "Something went wrong!",
        data: err.message,
    });
};
module.exports = errorHandler;
