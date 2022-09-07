const errorHandler = (err, req, res, next) => {
    res.status(400).send({
        success: false,
        error: err.message,
    });
};
module.exports = errorHandler;
