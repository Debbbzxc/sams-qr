export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sams-qr.vercel.app/api';

export const API_ENDPOINTS = {
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,
  AUTH_REGISTER: `${API_BASE_URL}/auth/register`,
  CLASSES: `${API_BASE_URL}/classes`,
  CLASSES_INSTRUCTOR: `${API_BASE_URL}/classes/instructor`,
  CLASSES_INSTRUCTOR_ARCHIVED: `${API_BASE_URL}/classes/instructor/archived`,
};
