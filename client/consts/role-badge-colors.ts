import roleList from '../lists/role-list'

// Fixed hue rotation so each role in role-list.js gets a stable, distinct
// badge color regardless of list order changes elsewhere in the app.
const ROLE_BADGE_PALETTE = [
  'border-transparent bg-red-100 text-red-800 hover:bg-red-100/80',
  'border-transparent bg-orange-100 text-orange-800 hover:bg-orange-100/80',
  'border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100/80',
  'border-transparent bg-lime-100 text-lime-800 hover:bg-lime-100/80',
  'border-transparent bg-green-100 text-green-800 hover:bg-green-100/80',
  'border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80',
  'border-transparent bg-teal-100 text-teal-800 hover:bg-teal-100/80',
  'border-transparent bg-cyan-100 text-cyan-800 hover:bg-cyan-100/80',
  'border-transparent bg-sky-100 text-sky-800 hover:bg-sky-100/80',
  'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-100/80',
  'border-transparent bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80',
  'border-transparent bg-violet-100 text-violet-800 hover:bg-violet-100/80',
  'border-transparent bg-purple-100 text-purple-800 hover:bg-purple-100/80',
  'border-transparent bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-100/80',
  'border-transparent bg-pink-100 text-pink-800 hover:bg-pink-100/80'
]

export const DEFAULT_ROLE_BADGE_COLOR =
  'border-transparent bg-gray-100 text-gray-800 hover:bg-gray-100/80'

export const ROLE_BADGE_COLORS: Record<string, string> = (roleList as string[]).reduce<
  Record<string, string>
>((acc, role, index) => {
  acc[role] = ROLE_BADGE_PALETTE[index % ROLE_BADGE_PALETTE.length]
  return acc
}, {})
