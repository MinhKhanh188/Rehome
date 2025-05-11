// back-end/src/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong 😢';

    // Log in dev mode only
    if (process.env.NODE_ENV === 'development') {
        console.error(`💥 [${req.method}] ${req.originalUrl} -`, err);
    }

    res.status(statusCode).json({
        success: false,
        message
    });
};

module.exports = errorHandler;
