const apiUrl = import.meta.env.VITE_API_URL?.trim() || '/api';

export const API_URL = apiUrl.replace(/\/$/, '');