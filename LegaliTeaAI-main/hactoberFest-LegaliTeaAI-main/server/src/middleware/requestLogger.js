const requestLogger = (req, res, next) => {
    const start = Date.now();

    // Log request
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);

    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // Red for errors, green for success
        const resetColor = '\x1b[0m';

        console.log(
            `${new Date().toISOString()} - ${req.method} ${req.path} - ` +
            `${statusColor}${res.statusCode}${resetColor} - ${duration}ms`
        );
    });

    next();
};

export { requestLogger };