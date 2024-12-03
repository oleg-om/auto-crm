const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  purge: ['./client/**/*.html', './client/**/*.jsx', './client/**/*.js'],
  theme: {
    extend: {
      colors: {
        main: {
          500: process.env.MODE === 'study' ? '#22c55e' : '#4299e1',
          600: process.env.MODE === 'study' ? '#16a34a' : '#2563eb',
          700: process.env.MODE === 'study' ? '#15803d' : '#1d4ed8'
        }
      }
    }
  },
  variants: {},
  plugins: []
}
