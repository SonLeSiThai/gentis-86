import api from './axios';

interface LoginDto {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: {
    name: string;
    phone: string;
    role: string;
    // thêm field nếu cần
  };
}

export const login = (data: LoginDto) => {
  return api.post<LoginResponse>('/v1/auth/login', data);
};
