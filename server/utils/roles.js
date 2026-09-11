function isAdmin(roles) {
  return Array.isArray(roles) && roles.includes('admin')
}

module.exports = { isAdmin }
