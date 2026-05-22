// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('[api]', req.method, req.originalUrl, err.message)
  if (err.stack) {
    console.error(err.stack)
  }

  const status = err.status || err.statusCode || 500
  res.status(status >= 400 && status < 600 ? status : 500).json({
    status: 'error',
    message: err.message || 'Internal server error'
  })
}

function registerProcessHandlers() {
  process.on('unhandledRejection', (reason) => {
    console.error('[unhandledRejection]', reason)
  })

  process.on('uncaughtException', (err) => {
    console.error('[uncaughtException]', err)
  })
}

module.exports = { errorHandler, registerProcessHandlers }
