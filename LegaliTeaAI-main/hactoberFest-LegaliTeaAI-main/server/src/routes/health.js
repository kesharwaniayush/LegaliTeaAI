import express from 'express';

const router = express.Router();

// Health check endpoint
router.get('/', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        digitalOceanConfigured: !!process.env.DIGITALOCEAN_ACCESS_TOKEN
    });
});

// Detailed health check
router.get('/detailed', (req, res) => {
    const memoryUsage = process.memoryUsage();

    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        services: {
            digitalOceanAI: !!process.env.DIGITALOCEAN_ACCESS_TOKEN,
            // supabase: !!(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY)
        },
        system: {
            memory: {
                used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
                total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB',
                external: Math.round(memoryUsage.external / 1024 / 1024) + ' MB'
            },
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch
        }
    });
});

export default router;