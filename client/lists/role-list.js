// `color` is a shadcn/Tailwind badge className (bg-*-100/text-*-800), used to
// render each position as a distinct colored Badge in the Employees table -
// kept alongside the definition so a new position always ships with its
// color. Same shape as lists/account-role-list.js by design (see
// client/components/ui/badge-list.tsx, shared by both employees and
// accounts). `value` equals `name` here since employee.role has always
// stored the Russian label itself (unlike accounts, which store a short
// code) - keeping them separate fields still lets both lists share the same
// shape/consumers.
module.exports = [
  {
    name: 'Прием заказов (запчасти)',
    value: 'Прием заказов (запчасти)',
    color: 'border-transparent bg-red-100 text-red-800 hover:bg-red-100/80'
  },
  {
    name: 'Обработка заказов (запчасти)',
    value: 'Обработка заказов (запчасти)',
    color: 'border-transparent bg-orange-100 text-orange-800 hover:bg-orange-100/80'
  },
  {
    name: 'Бухгалтер',
    value: 'Бухгалтер',
    color: 'border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100/80'
  },
  {
    name: 'Развал-схождение',
    value: 'Развал-схождение',
    color: 'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
  },
  {
    name: 'Работник шиномонтажа',
    value: 'Работник шиномонтажа',
    color: 'border-transparent bg-lime-100 text-lime-800 hover:bg-lime-100/80'
  },
  {
    name: 'Прием заказов (шины)',
    value: 'Прием заказов (шины)',
    color: 'border-transparent bg-green-100 text-green-800 hover:bg-green-100/80'
  },
  {
    name: 'Обработка заказов (шины)',
    value: 'Обработка заказов (шины)',
    color: 'border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80'
  },
  {
    name: 'Хранение',
    value: 'Хранение',
    color: 'border-transparent bg-teal-100 text-teal-800 hover:bg-teal-100/80'
  },
  {
    name: 'Прием заказов (инструмент)',
    value: 'Прием заказов (инструмент)',
    color: 'border-transparent bg-cyan-100 text-cyan-800 hover:bg-cyan-100/80'
  },
  {
    name: 'Обработка заказов (инструмент)',
    value: 'Обработка заказов (инструмент)',
    color: 'border-transparent bg-sky-100 text-sky-800 hover:bg-sky-100/80'
  },
  {
    name: 'Работник СТО',
    value: 'Работник СТО',
    color: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-100/80'
  },
  {
    name: 'Работник автомойки',
    value: 'Работник автомойки',
    color: 'border-transparent bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80'
  },
  {
    name: 'Замена лобовых стекол',
    value: 'Замена лобовых стекол',
    color: 'border-transparent bg-violet-100 text-violet-800 hover:bg-violet-100/80'
  },
  {
    name: 'Кондиционеры',
    value: 'Кондиционеры',
    color: 'border-transparent bg-purple-100 text-purple-800 hover:bg-purple-100/80'
  },
  {
    name: 'Покраска дисков',
    value: 'Покраска дисков',
    color: 'border-transparent bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-100/80'
  }
]
