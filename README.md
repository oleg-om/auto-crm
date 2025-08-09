# Auto CRM

Система управления автосервисом с полным функционалом для работы с клиентами, заказами, запчастями и услугами.

## 🚀 Быстрый старт с Docker

### Предварительные требования

- Docker Desktop
- Docker Compose

### Запуск приложения

1. **Клонируйте репозиторий:**
   ```bash
   git clone <repository-url>
   cd auto-crm
   ```

2. **Запустите приложение:**
   ```bash
   ./docker-start.sh
   ```

3. **Откройте в браузере:**
   ```
   http://localhost
   ```

### Управление Docker контейнерами

```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Просмотр логов
docker-compose logs -f

# Перезапуск
docker-compose restart
```

## 🏗️ Архитектура

Приложение состоит из трех сервисов:

- **mongodb** - База данных MongoDB 6.0 (порт 27017)
- **app** - Node.js приложение (порт 8081)
- **nginx** - Веб-сервер и обратный прокси (порт 80)

## 💾 Сохранение данных

Данные MongoDB сохраняются в именованном томе `mongodb_data`. При перезапуске контейнеров данные остаются нетронутыми.

## 🔧 Разработка

### Локальная разработка

```bash
# Установка зависимостей
yarn install

# Запуск в режиме разработки
yarn dev

# Сборка для продакшена
yarn build
```

### Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```env
NODE_ENV=development
PORT=8087
MONGO_URL=mongodb://localhost:27017/auto-crm
SECRET_JWT=your-secret-key
ENABLE_SOCKETS=true
MODE=production
```

## 📋 Функциональность

- **Управление клиентами** - создание, редактирование, поиск клиентов
- **Заказы** - создание и отслеживание заказов на услуги
- **Запчасти** - управление автозапчастями и их наличием
- **Услуги** - шиномонтаж, СТО, мойка, окна, кондиционеры
- **Отчеты** - различные отчеты по работе сервиса
- **Пользователи** - система ролей и прав доступа

## 🗄️ База данных

### MongoDB Collections

- `users` - пользователи системы
- `customers` - клиенты
- `autoparts` - автозапчасти
- `shinomontazhs` - шиномонтаж
- `stos` - СТО услуги
- `washs` - мойка
- `materials` - материалы
- `vendors` - поставщики
- `places` - места работы
- `categorys` - категории

### Доступ к MongoDB

```bash
# Через командную строку
docker exec -it auto-crm-mongodb mongosh -u app_user -p app_password auto-crm

# Через MongoDB Compass
mongodb://app_user:app_password@localhost:27017/auto-crm?authSource=auto-crm
```

## 🔒 Безопасность

### В продакшене обязательно измените:

1. **Пароли MongoDB** в `docker-compose.yml`
2. **JWT секрет** в переменных окружения
3. **Порты** на нестандартные
4. **Настройте SSL/TLS**

## 🆘 Устранение неполадок

### Проблемы с Docker

```bash
# Проверка статуса контейнеров
docker-compose ps

# Просмотр логов
docker-compose logs app
docker-compose logs mongodb
docker-compose logs nginx

# Пересборка образов
docker-compose build --no-cache
```

### Проблемы с базой данных

```bash
# Проверка подключения к MongoDB
docker exec -it auto-crm-mongodb mongosh

# Сброс данных (осторожно!)
docker-compose down -v
```

## 📁 Структура проекта

```
auto-crm/
├── client/                 # React приложение
│   ├── components/         # React компоненты
│   ├── scenes/            # Страницы приложения
│   ├── redux/             # Redux store
│   └── assets/            # Статические файлы
├── server/                # Node.js сервер
│   ├── controller/        # Контроллеры API
│   ├── model/            # Mongoose модели
│   └── routes/           # API маршруты
├── docker/               # Docker конфигурация
├── docker-compose.yml    # Docker Compose
├── webpack.*.config.js   # Webpack конфигурации
└── package.json          # Зависимости
```

## 📄 Лицензия

MIT License

## 🤝 Поддержка

Для получения поддержки создайте issue в репозитории или обратитесь к команде разработки.
