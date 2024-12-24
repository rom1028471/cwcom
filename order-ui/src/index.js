import React from 'react'
import ReactDOM from 'react-dom/client'
import 'semantic-ui-css/semantic.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import './App.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import axios from 'axios';
import { toast } from 'react-toastify';

// Глобальная конфигурация Axios
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          toast.error('Необходима повторная авторизация');
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          toast.error('У вас недостаточно прав для выполнения этого действия');
          break;
        case 404:
          toast.error('Запрошенный ресурс не найден');
          break;
        case 500:
          toast.error('Внутренняя ошибка сервера');
          break;
        default:
          toast.error('Произошла неизвестная ошибка');
      }
    } else if (error.request) {
      toast.error('Сервер не отвечает. Проверьте подключение к интернету.');
    } else {
      toast.error('Ошибка при выполнении запроса');
    }
    return Promise.reject(error);
  }
);

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
