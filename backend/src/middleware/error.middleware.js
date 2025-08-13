// Centralized error handler for Express
const errorHandler = (err, req, res, next) => {
    console.error('❌ Error:', err);

    // If response already sent, delegate to default Express handler
    if (res.headersSent) {
        return next(err);
    }

    // Set status code
    const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

    res.status(statusCode).json({
        success: false,
        message: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
};

export default errorHandler;
