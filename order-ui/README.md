# Publication Management Frontend

## Требования
- Node.js 16+
- npm 8+

## Установка зависимостей
```bash
npm install
```

## Запуск приложения
```bash
npm start
```

## Сборка для продакшена
```bash
npm run build
```

## Скрипты
- `npm start`: Запуск dev-сервера
- `npm run build`: Сборка продакшен-версии
- `npm test`: Запуск тестов
- `npm run lint`: Проверка кода
- `npm run lint:fix`: Автоматическое исправление ошибок кода

## Структура проекта
- `src/`: Исходный код
  - `components/`: Переиспользуемые компоненты
  - `context/`: Контексты React
  - `pages/`: Страницы приложения
  - `services/`: Сервисы для работы с API
  - `styles/`: Глобальные стили

## Используемые технологии
- React 18
- React Router
- Axios
- React Bootstrap
- React Icons
- React Toastify

## Переменные окружения
- `REACT_APP_API_URL`: URL бэкенд API
