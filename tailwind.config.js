const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  purge: ['./client/**/*.html', './client/**/*.jsx', './client/**/*.js'],
  theme: {
    extend: {
      colors: {
        main: {
          500: process.env.MODE === 'study' ? '#22c55e' : '#4299e1',
          600: process.env.MODE === 'study' ? '#16a34a' : '#e53e3e',
          700: process.env.MODE === 'study' ? '#15803d' : '#c53030'
        }
      }
    }
  },
  variants: {},
  plugins: []
}
