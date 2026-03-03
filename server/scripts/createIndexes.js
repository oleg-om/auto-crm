/* eslint-disable no-console */
// Скрипт для создания индексов MongoDB
// Запустите на сервере: node server/scripts/createIndexes.js

const mongoose = require('mongoose')
const config = require('../config')

const createIndexes = async () => {
  try {
    console.log('Подключение к MongoDB...')
    await mongoose.connect(config.default.mongoURL)

    console.log('Подключено к MongoDB')

    const { db } = mongoose.connection
    const shinomontazhsCollection = db.collection('shinomontazhs')

    console.log('Создание индексов для коллекции shinomontazhs...')

    // Составной индекс для оптимизации getFiltered
    await shinomontazhsCollection.createIndex(
      {
        place: 1,
        id_shinomontazhs: 1,
        regnumber: 1,
        'employee.id': 1,
        dateStart: -1
      },
      { background: true, name: 'filtered_query_compound' }
    )
    console.log('✓ Создан индекс: filtered_query_compound')

    // Индекс для быстрого поиска по dateStart
    await shinomontazhsCollection.createIndex({ dateStart: -1 }, { background: true })
    console.log('✓ Создан индекс: dateStart_-1')

    // Индекс для поиска по месту и дате
    await shinomontazhsCollection.createIndex(
      { place: 1, dateStart: -1 },
      { background: true, name: 'place_dateStart' }
    )
    console.log('✓ Создан индекс: place_dateStart')

    // Показать все индексы
    const indexes = await shinomontazhsCollection.indexes()
    console.log('\nВсе индексы коллекции shinomontazhs:')
    indexes.forEach((index) => {
      console.log(`  - ${index.name}:`, JSON.stringify(index.key))
    })

    // Показать статистику коллекции
    const stats = await shinomontazhsCollection.stats()
    console.log('\nСтатистика коллекции:')
    console.log(`  Количество документов: ${stats.count}`)
    console.log(`  Размер: ${(stats.size / 1024 / 1024).toFixed(2)} MB`)
    console.log(`  Средний размер документа: ${stats.avgObjSize} bytes`)

    console.log('\n✓ Индексы успешно созданы!')
  } catch (error) {
    console.error('Ошибка при создании индексов:', error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('Соединение закрыто')
    process.exit(0)
  }
}

createIndexes()
