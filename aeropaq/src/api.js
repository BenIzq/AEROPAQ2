import axios from 'axios';

const api = axios.create({
  baseURL: 'https://skyship-env.eba-hpyjyiyw.us-east-2.elasticbeanstalk.com/api',
});

// Interceptor para añadir el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
