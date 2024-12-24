FROM node:18-alpine as builder
WORKDIR /app

# Копируем оба файла
COPY package*.json ./

# Используем clean install с package-lock.json
RUN npm ci --legacy-peer-deps

COPY . .
RUN npm run build

# Используем nginx для раздачи статики
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]