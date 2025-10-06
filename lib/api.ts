import axios from 'axios';

// Create and configure an Axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_CONCEPT_API_URL_BASE || 'http://localhost:8080/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});


// You can add interceptors here, e.g., to refresh tokens
// api.interceptors.request.use(config => { ... });

export default api;