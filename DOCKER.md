# Auto CRM Docker Setup

Этот документ описывает, как запустить Auto CRM в Docker контейнерах с сохранением данных MongoDB.

## 🚀 Быстрый старт

### Предварительные требования

- Docker Desktop установлен и запущен
- Docker Compose установлен

### Запуск приложения

1. **Запустите все сервисы:**
   ```bash
   ./docker-start.sh
   ```

2. **Или используйте docker-compose напрямую:**
   ```bash
   docker-compose up --build -d
   ```

3. **Откройте приложение в браузере:**
   ```
   http://localhost
   ```

## 🏗️ Архитектура

Приложение состоит из трех сервисов:

- **mongodb** - База данных MongoDB 6.0
- **app** - Node.js приложение (порт 8081)
- **nginx** - Веб-сервер и обратный прокси (порт 80)

## 💾 Сохранение данных

Данные MongoDB сохраняются в именованном томе `mongodb_data`. При перезапуске контейнеров данные остаются нетронутыми.

## 🔧 Управление

### Просмотр логов
```bash
# Все сервисы
docker-compose logs -f

# Конкретный сервис
docker-compose logs -f app
docker-compose logs -f mongodb
docker-compose logs -f nginx
```

### Остановка сервисов
```bash
./docker-stop.sh
# или
docker-compose down
```

### Перезапуск
```bash
docker-compose restart
```

### Полная очистка (включая данные)
```bash
docker-compose down -v
```

## 🗄️ Доступ к MongoDB

### Через командную строку
```bash
docker exec -it auto-crm-mongodb mongosh -u app_user -p app_password auto-crm
```

### Через MongoDB Compass
```
mongodb://app_user:app_password@localhost:27017/auto-crm?authSource=auto-crm
```

## 🔧 Конфигурация

### Переменные окружения

Основные переменные настраиваются в `docker-compose.yml`:

- `MONGO_URL` - строка подключения к MongoDB
- `SECRET_JWT` - секретный ключ для JWT токенов
- `NODE_ENV` - окружение приложения
- `PORT` - порт приложения

### Изменение портов

Для изменения портов отредактируйте секцию `ports` в `docker-compose.yml`:

```yaml
ports:
  - "8080:80"  # Изменить внешний порт на 8080
```

## 🐛 Отладка

### Проверка статуса контейнеров
```bash
docker-compose ps
```

### Вход в контейнер приложения
```bash
docker exec -it auto-crm-app sh
```

### Просмотр файлов в контейнере
```bash
docker exec -it auto-crm-app ls -la /app
```

## 📁 Структура файлов

```
auto-crm/
├── docker-compose.yml          # Основная конфигурация Docker
├── docker-start.sh             # Скрипт запуска
├── docker-stop.sh              # Скрипт остановки
├── docker/
│   ├── PROD.Dockerfile         # Dockerfile для продакшена
│   ├── mongo-init.js           # Скрипт инициализации MongoDB
│   └── nginx/
│       └── default.conf        # Конфигурация Nginx
└── DOCKER.md                   # Эта документация
```

## 🔒 Безопасность

### В продакшене обязательно измените:

1. **Пароли MongoDB:**
   - `MONGO_INITDB_ROOT_PASSWORD`
   - Пароль пользователя `app_user` в `mongo-init.js`

2. **JWT секрет:**
   - `SECRET_JWT`

3. **Порты:**
   - Используйте нестандартные порты
   - Настройте SSL/TLS

## 🆘 Устранение неполадок

### Проблема: Контейнеры не запускаются
```bash
# Проверьте логи
docker-compose logs

# Пересоберите образы
docker-compose build --no-cache
```

### Проблема: MongoDB не подключается
```bash
# Проверьте статус MongoDB
docker-compose logs mongodb

# Проверьте сеть
docker network ls
```

### Проблема: Приложение недоступно
```bash
# Проверьте статус всех контейнеров
docker-compose ps

# Проверьте логи nginx
docker-compose logs nginx
```
