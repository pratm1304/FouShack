// Check if we're in development or production
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default API_URL;