/**
 * UI state keeps a single tyre object; API expects an array (see mongoose tyre: Array).
 */
// eslint-disable-next-line import/prefer-default-export
export function tyresToPayload(tyres) {
  if (tyres == null) return []
  return Array.isArray(tyres) ? tyres : [tyres]
}
