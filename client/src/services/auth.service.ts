import type { GoogleLoginRequest, LoginResponse, User } from '@/types/user';
import { api } from './api.service';

async function googleLogin(params: GoogleLoginRequest): Promise<LoginResponse> {
  const response = await api.post('/auth/google', params, {
    withCredentials: true,
  });
  return response.data;
}

async function getCurrentUser(): Promise<User> {
  const response = await api.get('/auth/me', {
    withCredentials: true,
  });
  return response.data;
}

async function logout() {
  return await api.post('/auth/logout', {}, { withCredentials: true });
}
export { googleLogin, getCurrentUser, logout };
