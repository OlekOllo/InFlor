# Используем официальный образ V
FROM vlang/vlang:latest AS builder

# Копируем исходники проекта
WORKDIR /app
COPY . .

# Собираем серверное приложение (предположим, что основной файл — inflor_server/main.v)
RUN v -prod ./inflor_server/main.v

# Используем минимальный образ для запуска
FROM debian:buster-slim

WORKDIR /app

# Копируем собранный бинарник из builder
COPY --from=builder /app/inflor_server/main /app/main

# Копируем фронтенд (если нужен)
COPY inflor_client /app/inflor_client

# Открываем нужный порт (например, 8080)
EXPOSE 8080

# Запуск приложения
CMD ["./main"]