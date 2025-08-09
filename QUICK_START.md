# 🚀 Быстрый старт Auto CRM

## Запуск с Docker (рекомендуется)

### 1. Запуск приложения
```bash
./docker-start.sh
```

### 2. Открыть в браузере
```
http://localhost
```

### 3. Остановка
```bash
./docker-stop.sh
```

## Ручной запуск

### 1. Установка зависимостей
```bash
yarn install
```

### 2. Запуск MongoDB
```bash
# Установите MongoDB локально или используйте Docker
docker run -d -p 27017:27017 --name mongodb mongo:6.0
```

### 3. Настройка переменных окружения
```bash
cp .env.example .env
# Отредактируйте .env файл
```

### 4. Запуск приложения
```bash
yarn dev
```

### 5. Открыть в браузере
```
http://localhost:8087
```

## 📊 Статус сервисов

```bash
# Проверка статуса Docker контейнеров
docker-compose ps

# Просмотр логов
docker-compose logs -f
```

## 🔧 Полезные команды

```bash
# Перезапуск сервисов
docker-compose restart

# Пересборка образов
docker-compose build --no-cache

# Доступ к MongoDB
docker exec -it auto-crm-mongodb mongosh -u app_user -p app_password auto-crm

# Полная очистка (включая данные)
docker-compose down -v
```

## 🌐 Доступные порты

- **80** - Веб-интерфейс (через nginx)
- **8081** - API сервер (напрямую)
- **27017** - MongoDB

## 📝 Первые шаги

1. Откройте http://localhost
2. Создайте первого пользователя
3. Настройте категории услуг
4. Добавьте места работы
5. Начните работу с клиентами

## 🆘 Проблемы?

```bash
# Проверьте логи
docker-compose logs app
docker-compose logs mongodb
docker-compose logs nginx

# Проверьте статус
docker-compose ps
```
