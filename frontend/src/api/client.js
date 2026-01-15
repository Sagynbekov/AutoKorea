import axios from 'axios';

// Базовая конфигурация API клиента
const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 секунд
});

// Interceptor для обработки запросов
apiClient.interceptors.request.use(
  (config) => {
    // Здесь можно добавить токен авторизации, если нужно
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor для обработки ответов
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Централизованная обработка ошибок
    if (error.response) {
      // Сервер ответил с кодом ошибки
      console.error('Response error:', error.response.data);
      
      switch (error.response.status) {
        case 401:
          // Unauthorized - можно перенаправить на логин
          console.error('Unauthorized');
          break;
        case 404:
          console.error('Resource not found');
          break;
        case 500:
          console.error('Server error');
          break;
        default:
          console.error('Error:', error.response.status);
      }
    } else if (error.request) {
      // Запрос был отправлен, но ответа не получено
      console.error('Network error:', error.request);
    } else {
      // Что-то пошло не так при настройке запроса
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
