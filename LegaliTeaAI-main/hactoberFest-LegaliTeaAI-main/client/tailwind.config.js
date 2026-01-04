/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                success: {
                    DEFAULT: "hsl(var(--success))",
                    foreground: "hsl(var(--success-foreground))",
                },
                warning: {
                    DEFAULT: "hsl(var(--warning))",
                    foreground: "hsl(var(--warning-foreground))",
                },
                info: {
                    DEFAULT: "hsl(var(--info))",
                    foreground: "hsl(var(--info-foreground))",
                },
                // Brand colors for animations and logo
                brand: {
                    blue: "#1e40af",
                    green: "#059669",
                    gold: "#f59e0b",
                    'blue-light': "#3b82f6",
                    'green-light': "#10b981",
                    'gold-light': "#fbbf24",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            // Custom animations
            animation: {
                // Logo animations
                'logo-pulse': 'logo-pulse 2s ease-in-out infinite',
                'logo-gradient': 'logo-gradient 3s ease-in-out infinite',
                'steam-float': 'steam-float 2s ease-in-out infinite',
                'typewriter': 'typewriter 2s steps(12) 1s forwards',

                // Micro animations
                'fade-in': 'fade-in 0.5s ease-out forwards',
                'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
                'scale-in': 'scale-in 0.3s ease-out forwards',
                'slide-in-right': 'slide-in-right 0.4s ease-out forwards',
                'bounce-gentle': 'bounce-gentle 0.6s ease-out',

                // Loading animations
                'skeleton-pulse': 'skeleton-pulse 1.5s ease-in-out infinite',
                'progress-sweep': 'progress-sweep 2s ease-in-out infinite',
                'count-up': 'count-up 1s ease-out forwards',

                // Interactive animations
                'button-press': 'button-press 0.1s ease-out',
                'card-hover': 'card-hover 0.2s ease-out forwards',
                'ripple': 'ripple 0.6s ease-out forwards',
            },
            keyframes: {
                // Logo keyframes
                'logo-pulse': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.02)' },
                },
                'logo-gradient': {
                    '0%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' },
                    '100%': { backgroundPosition: '0% 50%' },
                },
                'steam-float': {
                    '0%': { transform: 'translateY(0) scale(1)', opacity: '0.7' },
                    '50%': { transform: 'translateY(-10px) scale(1.1)', opacity: '0.4' },
                    '100%': { transform: 'translateY(-20px) scale(1.2)', opacity: '0' },
                },
                'typewriter': {
                    '0%': { width: '0' },
                    '100%': { width: '100%' },
                },

                // Micro animation keyframes
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'fade-in-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                'slide-in-right': {
                    '0%': { opacity: '0', transform: 'translateX(20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                'bounce-gentle': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' },
                    '100%': { transform: 'scale(1)' },
                },

                // Loading keyframes
                'skeleton-pulse': {
                    '0%': { opacity: '1' },
                    '50%': { opacity: '0.4' },
                    '100%': { opacity: '1' },
                },
                'progress-sweep': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                'count-up': {
                    '0%': { transform: 'scale(0.8)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },

                // Interactive keyframes
                'button-press': {
                    '0%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(0.95)' },
                    '100%': { transform: 'scale(1)' },
                },
                'card-hover': {
                    '0%': { transform: 'translateY(0) scale(1)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
                    '100%': { transform: 'translateY(-2px) scale(1.01)', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' },
                },
                'ripple': {
                    '0%': { transform: 'scale(0)', opacity: '1' },
                    '100%': { transform: 'scale(4)', opacity: '0' },
                },
            },
            // Animation timing functions
            transitionTimingFunction: {
                'bounce-gentle': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
                'snappy': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            },
            // Animation durations
            transitionDuration: {
                '250': '250ms',
                '350': '350ms',
                '400': '400ms',
                '600': '600ms',
                '800': '800ms',
                '1200': '1200ms',
            },
        },
    },
    plugins: [],
}