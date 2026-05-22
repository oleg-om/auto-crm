/** Escape user input before use in MongoDB $regex (prevents invalid patterns and ReDoS-ish surprises). */
function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Case-insensitive substring match on a field; returns null if value is empty. */
function caseInsensitiveRegex(value) {
  if (value == null || value === '') return null
  const text = String(value).trim()
  if (!text) return null
  return { $regex: escapeRegex(text), $options: 'i' }
}

module.exports = { escapeRegex, caseInsensitiveRegex }
