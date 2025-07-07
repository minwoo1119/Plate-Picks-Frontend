import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.platepicks.pics',
    withCredentials: true,
});

export default api;
