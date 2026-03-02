import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';
import { BASE_URL } from '../config/api';

const api = axios.create({
    baseURL: BASE_URL,
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        // You can also add ngrok headers here if needed
        // config.headers['ngrok-skip-browser-warning'] = '69420';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling 401 errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token might be expired or invalid
            console.warn("Unauthorized request detected (401). Logging out...");
            store.dispatch(logout());

            // Optionally redirect to login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
