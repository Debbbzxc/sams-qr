import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'sams_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getUserFromToken = () => {
  const token = getToken();

  if (!token) {
    return null;
  }

  try {
    return jwtDecode(token);
  } catch {
    clearToken();
    return null;
  }
};

export const getDefaultRouteForRole = (role) => {
  if (role === 'Instructor') {
    return '/instructor';
  }

  if (role === 'Student') {
    return '/student';
  }

  return '/';
};
