// Simple in-memory rate limiter
// In production, use Redis or a proper rate limiting service

const rateLimitStore = new Map();

const rateLimiter = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 100; // Max requests per window

    // Clean up old entries
    for (const [ip, data] of rateLimitStore.entries()) {
        if (now - data.windowStart > windowMs) {
            rateLimitStore.delete(ip);
        }
    }

    // Get or create client data
    let clientData = rateLimitStore.get(clientIP);
    if (!clientData || now - clientData.windowStart > windowMs) {
        clientData = {
            windowStart: now,
            requestCount: 0
        };
    }

    clientData.requestCount++;
    rateLimitStore.set(clientIP, clientData);

    // Check if limit exceeded
    if (clientData.requestCount > maxRequests) {
        return res.status(429).json({
            error: 'Too many requests',
            message: `Rate limit exceeded. Try again in ${Math.ceil((windowMs - (now - clientData.windowStart)) / 1000)} seconds.`,
            retryAfter: Math.ceil((windowMs - (now - clientData.windowStart)) / 1000)
        });
    }

    // Add rate limit headers
    res.set({
        'X-RateLimit-Limit': maxRequests,
        'X-RateLimit-Remaining': Math.max(0, maxRequests - clientData.requestCount),
        'X-RateLimit-Reset': new Date(clientData.windowStart + windowMs).toISOString()
    });

    next();
};

export { rateLimiter };