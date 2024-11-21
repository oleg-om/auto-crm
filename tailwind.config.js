const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  purge: ['./client/**/*.html', './client/**/*.jsx', './client/**/*.js'],
  theme: {
    extend: {
      colors: {
        main: {
          500: process.env?.MODE === 'study' ? '#f56565' : '#4299e1',
          600: process.env?.MODE === 'study' ? '#e53e3e' : '#e53e3e',
          700: process.env?.MODE === 'study' ? '#c53030' : '#c53030'
        }
      }
    }
  },
  variants: {},
  plugins: []
}
