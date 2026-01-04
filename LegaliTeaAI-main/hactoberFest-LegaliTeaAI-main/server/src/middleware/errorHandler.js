const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let error = {
        message: err.message || 'Internal server error',
        status: err.status || 500
    };

    // Specific error types
    if (err.name === 'ValidationError') {
        error.status = 400;
        error.message = 'Validation failed';
        error.details = err.details;
    } else if (err.name === 'SyntaxError' && err.type === 'entity.parse.failed') {
        error.status = 400;
        error.message = 'Invalid JSON in request body';
    } else if (err.code === 'LIMIT_FILE_SIZE') {
        error.status = 413;
        error.message = 'File too large';
    } else if (err.message.includes('DigitalOcean AI')) {
        error.status = 503;
        error.message = 'AI service temporarily unavailable';
    }

    // Don't expose internal errors in production
    if (process.env.NODE_ENV === 'production' && error.status === 500) {
        error.message = 'Internal server error';
    }

    res.status(error.status).json({
        error: error.message,
        ...(error.details && { details: error.details }),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

export { errorHandler };