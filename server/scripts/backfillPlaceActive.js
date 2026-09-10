/* eslint-disable no-console */
// Бэкофилл поля `active` для адресов, созданных до его появления в схеме.
// Запустите на сервере (в т.ч. на проде): node server/scripts/backfillPlaceActive.js

const mongoose = require('mongoose')
const config = require('../config')
const Place = require('../model/place')

const run = async () => {
  console.log('Подключение к MongoDB...')
  await mongoose.connect(config.default.mongoURL)
  console.log('Подключено к MongoDB')

  const result = await Place.updateMany({ active: { $exists: false } }, { $set: { active: true } })
  console.log(`Проставлено active: true у ${result.modifiedCount} адрес(ов)`)
}

run()
  .catch((error) => {
    console.error('Ошибка при бэкофилле active:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.connection.close()
    console.log('Соединение закрыто')
  })
