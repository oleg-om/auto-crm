# Базовый образ Node.js (совместимый с твоим проектом, например Node 18 LTS)
FROM node:12

# Рабочая директория внутри контейнера
WORKDIR /app

# Устанавливаем зависимости
COPY package*.json yarn.lock* ./
RUN yarn install

# Копируем весь код (но в dev-режиме будем монтировать)
COPY . .

# Открываем порт для webpack-dev-server или API
EXPOSE 8087

# Команда по умолчанию (можно переопределить в docker-compose)
CMD ["yarn", "dev"]
