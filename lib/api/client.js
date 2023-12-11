import config from '@/utils/config';
import axios from 'axios';

const client = axios.create(
    {
        baseURL: config.api.url,
        headers: {
            'Content-Type': 'application/json',
        },
    }
);

client.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('auth_token');

        console.log('token', token);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

export default client;