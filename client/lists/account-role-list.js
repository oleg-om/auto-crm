// `color` is a shadcn/Tailwind badge className (bg-*-100/text-*-800), used to
// render each access as a distinct colored Badge in the Accounts table -
// kept alongside the definition so a new role always ships with its color.
module.exports = [
  {
    name: 'Прием заказов (запчасти)',
    value: 'autopartsimple',
    color: 'border-transparent bg-red-100 text-red-800 hover:bg-red-100/80'
  },
  {
    name: 'Обработка заказов (запчасти)',
    value: 'autopartfull',
    color: 'border-transparent bg-orange-100 text-orange-800 hover:bg-orange-100/80'
  },
  {
    name: 'Бухгалтер',
    value: 'bookkeeper',
    color: 'border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100/80'
  },
  {
    name: 'Администратор',
    value: 'admin',
    color: 'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
  },
  {
    name: 'Развал-схождение',
    value: 'razval',
    color: 'border-transparent bg-lime-100 text-lime-800 hover:bg-lime-100/80'
  },
  {
    name: 'Начальник',
    value: 'boss',
    color: 'border-transparent bg-green-100 text-green-800 hover:bg-green-100/80'
  },
  {
    name: 'Работник шиномонтажа',
    value: 'shinomontazh',
    color: 'border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80'
  },
  {
    name: 'Прием заказов (шины)',
    value: 'tyresimple',
    color: 'border-transparent bg-teal-100 text-teal-800 hover:bg-teal-100/80'
  },
  {
    name: 'Шины (стол заказов)',
    value: 'tyresOrder',
    color: 'border-transparent bg-cyan-100 text-cyan-800 hover:bg-cyan-100/80'
  },
  {
    name: 'Обработка заказов (шины)',
    value: 'tyrefull',
    color: 'border-transparent bg-sky-100 text-sky-800 hover:bg-sky-100/80'
  },
  {
    name: 'Хранение',
    value: 'hranenie',
    color: 'border-transparent bg-blue-100 text-blue-800 hover:bg-blue-100/80'
  },
  {
    name: 'Кассир',
    value: 'kassa',
    color: 'border-transparent bg-indigo-100 text-indigo-800 hover:bg-indigo-100/80'
  },
  {
    name: 'Прием заказов (инструмент)',
    value: 'toolsimple',
    color: 'border-transparent bg-violet-100 text-violet-800 hover:bg-violet-100/80'
  },
  {
    name: 'Обработка заказов (инструмент)',
    value: 'toolfull',
    color: 'border-transparent bg-purple-100 text-purple-800 hover:bg-purple-100/80'
  },
  {
    name: 'Работник СТО',
    value: 'sto',
    color: 'border-transparent bg-fuchsia-100 text-fuchsia-800 hover:bg-fuchsia-100/80'
  },
  {
    name: 'Работник автомойки',
    value: 'wash',
    color: 'border-transparent bg-pink-100 text-pink-800 hover:bg-pink-100/80'
  },
  {
    name: 'Замена лобовых стекол',
    value: 'window',
    color: 'border-transparent bg-rose-100 text-rose-800 hover:bg-rose-100/80'
  },
  {
    name: 'Кондиционеры',
    value: 'cond',
    color: 'border-transparent bg-red-100 text-red-800 hover:bg-red-100/80'
  },
  {
    name: 'Доступ к странице отчет',
    value: 'report',
    color: 'border-transparent bg-orange-100 text-orange-800 hover:bg-orange-100/80'
  },
  {
    name: 'Электронный журнал',
    value: 'journal',
    color: 'border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100/80'
  },
  {
    name: 'Оплата шиномонтаж/сто/мойка/стекла/покраска',
    value: 'oplataStoShinoWashWindow',
    color: 'border-transparent bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80'
  },
  {
    name: 'Покраска дисков',
    value: 'diskpainting',
    color: 'border-transparent bg-lime-100 text-lime-800 hover:bg-lime-100/80'
  }
]

module.exports.PAYMENT_ACCESS_ROLE = 'oplataStoShinoWashWindow'
module.exports.PAYMENT_BLOCK_ROLES = [
  module.exports.PAYMENT_ACCESS_ROLE,
  'bookkeeper',
  'kassa',
  'admin',
  'boss'
]
