function isAdmin(roles) {
  return Array.isArray(roles) && roles.includes('admin')
}

function isBoss(roles) {
  return Array.isArray(roles) && roles.includes('boss')
}

module.exports = { isAdmin, isBoss }
