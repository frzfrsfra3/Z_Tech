import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ||  'http://localhost:8000/api', // Laravel API URL
    withCredentials: true, // Required for Sanctum
});

export default axiosInstance;
