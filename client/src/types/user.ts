export interface User {
  id: number;
  email: string;
  name: string;
  picture: string | null;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface GoogleLoginRequest {
  credential: string;
}
