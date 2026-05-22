/** Wrap async Express handlers so rejections are passed to errorHandler. */
function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch(next)
  }
}

module.exports = { asyncRoute }
