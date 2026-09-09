const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  content: ['./client/**/*.html', './client/**/*.jsx', './client/**/*.js'],
  theme: {
    extend: {
      colors: {
        main: {
          400: process.env.MODE === 'study' ? '#4ade80' : '#60a5fa',
          500: process.env.MODE === 'study' ? '#22c55e' : '#4299e1',
          600: process.env.MODE === 'study' ? '#16a34a' : '#2563eb',
          700: process.env.MODE === 'study' ? '#15803d' : '#1d4ed8'
        },
        // shadcn/ui tokens, driven by CSS variables set in client/assets/scss/main.scss
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      // Preserve Tailwind v1 defaults still relied on across the app so the
      // v1 -> v3 upgrade doesn't silently change borders sitewide (v2+
      // switched the default border color from #e2e8f0 to currentColor).
      borderColor: {
        DEFAULT: '#e2e8f0'
      },
      boxShadow: {
        outline: '0 0 0 3px rgba(66, 153, 225, 0.5)',
        'outline-gray': '0 0 0 3px rgba(160, 174, 192, 0.5)',
        'outline-blue': '0 0 0 3px rgba(66, 153, 225, 0.5)',
        'outline-red': '0 0 0 3px rgba(245, 101, 101, 0.5)',
        'outline-green': '0 0 0 3px rgba(72, 187, 120, 0.5)',
        'outline-orange': '0 0 0 3px rgba(237, 137, 54, 0.5)',
        'outline-yellow': '0 0 0 3px rgba(236, 201, 75, 0.5)',
        'outline-purple': '0 0 0 3px rgba(159, 122, 234, 0.5)',
        'outline-pink': '0 0 0 3px rgba(237, 100, 166, 0.5)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
}
