interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) { // 10 requests per minute by default
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Clean up expired entries every 5 minutes
    setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const entry = this.limits.get(identifier);

    if (!entry || now > entry.resetTime) {
      // First request or window expired, allow it
      this.limits.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
      return true;
    }

    if (entry.count >= this.maxRequests) {
      // Rate limit exceeded
      return false;
    }

    // Increment counter
    entry.count++;
    this.limits.set(identifier, entry);
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const entry = this.limits.get(identifier);
    if (!entry) return this.maxRequests;

    const now = Date.now();
    if (now > entry.resetTime) {
      return this.maxRequests;
    }

    return Math.max(0, this.maxRequests - entry.count);
  }

  getResetTime(identifier: string): number {
    const entry = this.limits.get(identifier);
    return entry ? entry.resetTime : Date.now() + this.windowMs;
  }

  // Get rate limit info for a specific identifier
  getRateLimitInfo(identifier: string): {
    remaining: number;
    resetTime: number;
    isAllowed: boolean;
  } {
    const isAllowed = this.isAllowed(identifier);
    const remaining = this.getRemainingRequests(identifier);
    const resetTime = this.getResetTime(identifier);

    return {
      remaining,
      resetTime,
      isAllowed,
    };
  }
}

// Create singleton instances for different use cases
export const analysisRateLimiter = new RateLimiter(5, 60000); // 5 analyses per minute
export const saveAnalysisRateLimiter = new RateLimiter(3, 60000); // 3 saves per minute
export const fetchAnalysesRateLimiter = new RateLimiter(10, 60000); // 10 fetches per minute

// Utility function to get client IP (for server-side use)
export const getClientIP = (req: any): string => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  );
};

// Utility function to create identifier from email
export const createEmailIdentifier = (email: string): string => {
  return `email:${email.toLowerCase().trim()}`;
};

// Utility function to create identifier from IP
export const createIPIdentifier = (ip: string): string => {
  return `ip:${ip}`;
};

// Combined identifier for stricter rate limiting
export const createCombinedIdentifier = (email: string, ip: string): string => {
  return `combined:${email.toLowerCase().trim()}:${ip}`;
};