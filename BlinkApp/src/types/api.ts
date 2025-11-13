export interface User {
  id: string;
  phone: string;
  alias?: string;
  alias_tag?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  phone: string;
  password: string;
}

export interface ApiError {
  error: string;
  message?: string;
  statusCode?: number;
}