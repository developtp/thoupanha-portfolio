const apiUrl = import.meta.env.VITE_API_URL;

if (!apiUrl) {
	throw new Error('VITE_API_URL is not set. Add it to frontend/.env.local.');
}

export const API_URL = apiUrl;